import { Client, type ConnectionConfig, Pool } from "pg";
import { env } from "../utils/env.js";

const config: ConnectionConfig = {
  host: env.POSTGRES_HOST,
  port: env.POSTGRES_PORT,
  database: env.POSTGRES_DB,
  user: env.POSTGRES_USER,
  password: env.POSTGRES_PASSWORD,
};

export const pool = new Pool(config);
export const db = new Client(config);
