import bcrypt from "bcryptjs";
import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

async function main() {
  const adminRole = await prisma.role.upsert({
    where: { name: "admin" },
    update: {},
    create: {
      name: "admin",
    },
  });

  const teacherRole = await prisma.role.upsert({
    where: { name: "teacher" },
    update: {},
    create: {
      name: "teacher",
    },
  });

  const studentRole = await prisma.role.upsert({
    where: { name: "student" },
    update: {},
    create: {
      name: "student",
    },
  });

  await prisma.user.upsert({
    where: { username: "admin1" },
    update: {},
    create: {
      username: "admin1",
      roleName: "admin",
      password: bcrypt.hashSync("password", 10),
    },
  });

  await prisma.user.upsert({
    where: { username: "teacher1" },
    update: {},
    create: {
      username: "teacher1",
      roleName: "teacher",
      password: bcrypt.hashSync("password", 10),
    },
  });

  await prisma.user.upsert({
    where: { username: "student1" },
    update: {},
    create: {
      username: "student1",
      roleName: "student",
      password: bcrypt.hashSync("password", 10),
    },
  });

  // make dummy 10 users per role
  for (let i = 0; i < 10; i++) {
    for (const role of [adminRole, teacherRole, studentRole]) {
      await prisma.user.create({
        data: {
          username: `${role.name}user${i}`,
          roleName: role.name,
          password: bcrypt.hashSync("password", 10),
        },
      });
    }
  }
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
