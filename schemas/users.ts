import { z } from "zod";

export const usersPostSchema = z.object({
  email: z.string().email(),
  name: z.string(),
  password: z.string().min(8, "Must be at least 8 characters"),
});

export type UsersPostSchema = z.infer<typeof usersPostSchema>;
