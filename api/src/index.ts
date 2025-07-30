import { serve } from "@hono/node-server";
import { zValidator } from "@hono/zod-validator";
import { Hono } from "hono";
import { REDIS_BLOOM_FILTER_KEY } from "../constants.js";
import { pool } from "./lib/pg.js";
import { redisClient } from "./lib/redis.js";
import { passwordCheckSchema } from "./validation/schema.js";

import { cors } from "hono/cors";
import { env } from "./utils/env.js";

const app = new Hono();

app.use(
  cors({
    origin: [env.CLIENT_ORIGIN_URL, "http://localhost:5173"],
  })
);

app.get("/", (c) => {
  return c.json({ message: "The server is fine 🚀" });
});

app.post(
  "/password/check",
  zValidator("json", passwordCheckSchema),
  async (c) => {
    try {
      const { password } = c.req.valid("json");

      // check in bloom filters
      const bloomFilter = await redisClient.bf.exists(
        REDIS_BLOOM_FILTER_KEY,
        password
      );

      // if true in bloom filter, check in db
      if (bloomFilter) {
        const dbResult = await pool.query(
          "SELECT password FROM password WHERE password = $1 LIMIT 1",
          [password]
        );
        const database = dbResult.rows.length > 0 ? true : false;

        c.status(200);
        return c.json({
          success: true,
          bloomFilter,
          database,
          falsePositive: bloomFilter !== database,
        });
      } else {
        c.status(200);
        return c.json({
          success: true,
          bloomFilter,
          database: null,
          falsePositive: false,
        });
      }
    } catch (error) {
      console.error(error);
      c.status(500);
      return c.json({
        success: false,
        bloomFilter: null,
        database: null,
        falsePositive: false,
      });
    }
  }
);

serve(
  {
    fetch: app.fetch,
    port: env.API_PORT,
  },
  async (info) => {
    await pool.connect();
    await redisClient.connect();
    console.log(`Server is running on http://localhost:${info.port}`);
  }
);

process.on("uncaughtException", (error) => {
  console.error(error);
});
