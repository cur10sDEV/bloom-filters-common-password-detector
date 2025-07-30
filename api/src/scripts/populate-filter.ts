import { REDIS_BLOOM_FILTER_KEY } from "../../constants.js";
import { pool } from "../lib/pg.js";
import { redisClient } from "../lib/redis.js";

const BATCH_SIZE = 1000;

async function main() {
  try {
    await pool.connect();
    await redisClient.connect();

    const totalRecordsData = await pool.query("SELECT COUNT(*) FROM password");

    // total no of records
    const TOTAL_RECORDS = totalRecordsData.rows[0].count;

    // loop through every record and populate the bloom filter
    const loopCount = Math.ceil(TOTAL_RECORDS / BATCH_SIZE);
    for (let i = 0; i < loopCount; i++) {
      const skipCount = BATCH_SIZE * i;
      const records = await pool.query(
        "SELECT password FROM password LIMIT $1 OFFSET $2",
        [BATCH_SIZE, skipCount]
      );

      // create an array of passwords
      const passwords = records.rows.map((data) => data.password.trim()); // have to trim cause CHAR: 256 so extra padding

      // add to bloom filters
      await redisClient.bf.mAdd(REDIS_BLOOM_FILTER_KEY, passwords);

      console.log("Added items: ", records.rowCount);
    }

    console.log("Bloom Filter Populated Successfully");
  } catch (error) {
    console.error(error);
  } finally {
    await pool.end();
    redisClient.destroy();
  }
}

main();
