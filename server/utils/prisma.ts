import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient({
  omit: {
    user: {
      password: true,
      refreshToken: true,
    },
  },
});

export default prisma;
