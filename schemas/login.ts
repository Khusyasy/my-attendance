import { z } from "zod";

export const loginPostSchema = z.object({
  username: z.string(),
  password: z.string().min(8, "Must be at least 8 characters"),
});

export type LoginPostSchema = z.infer<typeof loginPostSchema>;
