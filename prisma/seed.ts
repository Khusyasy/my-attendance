import bcrypt from "bcryptjs";
import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

async function main() {
  // make dummy 10 users
  for (let i = 1; i <= 10; i++) {
    await prisma.user.create({
      data: {
        email: `user${i}@test.com`,
        name: `User ${i}`,
        password: bcrypt.hashSync("password", 10),
      },
    });
  }

  // dummy event
  const event1 = await prisma.event.create({
    data: {
      name: "Event 1",
      lat: 37.123456,
      long: 127.123456,
      radius: 100,
      Enrollment: {
        createMany: {
          data: [
            {
              userId: 1,
              role: "Owner",
            },
            {
              userId: 2,
              role: "Organizer",
            },
            {
              userId: 3,
              role: "Attendee",
            },
          ],
        },
      },
    },
  });

  // make session
  const _session1 = await prisma.session.create({
    data: {
      eventId: event1.id,
      createTimestamp: new Date(),
      expireTimestamp: new Date(),
      QRCodeHash: "123456",
      geolocation: true,
    },
  });
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
