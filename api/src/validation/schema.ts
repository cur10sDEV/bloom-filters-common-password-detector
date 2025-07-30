import z from "zod";

export const passwordCheckSchema = z.object({
  password: z.string().trim().min(1).max(128),
});

export type PASSWORDCHECKSCHEMA = z.infer<typeof passwordCheckSchema>;
