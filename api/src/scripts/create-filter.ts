import {
  REDIS_BLOOM_FILTER_CAPACITY,
  REDIS_BLOOM_FILTER_ERROR_RATE,
  REDIS_BLOOM_FILTER_KEY,
} from "../../constants.js";
import { redisClient } from "../lib/redis.js";

async function main() {
  try {
    await redisClient.connect();

    // create a bloom filter
    await redisClient.bf.reserve(
      REDIS_BLOOM_FILTER_KEY,
      REDIS_BLOOM_FILTER_ERROR_RATE,
      REDIS_BLOOM_FILTER_CAPACITY
    );

    console.log("Bloom Filter Created Successfully");
  } catch (error) {
    console.error(error);
  } finally {
    redisClient.destroy();
  }
}

main();
