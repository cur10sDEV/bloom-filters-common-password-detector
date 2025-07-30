import z from "zod";

const envSchema = z.object({
  POSTGRES_USER: z.string().min(1),
  POSTGRES_PASSWORD: z.string().min(1),
  POSTGRES_DB: z.string().min(1),
  POSTGRES_HOST: z.string().min(1),
  POSTGRES_PORT: z.coerce.number().min(1),
  REDIS_URL: z.string().min(1),
  VITE_API_BASE_URL: z.string().min(1),
  API_PORT: z.coerce.number().min(1),
  CLIENT_ORIGIN_URL: z.string().min(1),
});

export const env = envSchema.parse(process.env);
