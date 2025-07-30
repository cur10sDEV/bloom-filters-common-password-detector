import { createClient } from "redis";
import { env } from "../utils/env.js";

export const redisClient = createClient({
  url: env.REDIS_URL,
});
