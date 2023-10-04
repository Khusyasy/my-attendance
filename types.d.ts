import type { User } from "@prisma/client";

type UserWithoutPassword = Omit<User, "password">;

declare module 'h3' {
  interface H3EventContext {
    auth: UserWithoutPassword;
  }
}
