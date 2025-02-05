import { z } from "zod";

export const loginPostSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8, "Must be at least 8 characters"),
});

export type LoginPostSchema = z.infer<typeof loginPostSchema>;
