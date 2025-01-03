import { z } from "zod";

const bodySchema = z.object({
  QRCodeHash: z
    .string()
    .length(16)
    .regex(/^[0-9A-Za-z]+$/),
  lat: z.number().min(-90).max(90),
  long: z.number().min(-180).max(180),
});

export default defineEventHandler(async (event) => {
  const result = await readValidatedBody(event, (body) =>
    bodySchema.safeParse(body),
  );
  if (!result.success) throw result.error.issues;

  const { QRCodeHash, lat, long } = result.data;

  const session = await prisma.session.findFirst({
    where: {
      QRCodeHash,
    },
  });

  if (!session) {
    throw createError({
      statusCode: 400,
      statusMessage: "QR code not found",
    });
  }

  const distance = calculateDistance(lat, long, session.lat, session.long);
  if (distance > 0.5) {
    throw createError({
      statusCode: 400,
      statusMessage: "You are too far from the session",
    });
  }

  const attendance = await prisma.attendance.create({
    data: {
      sessionId: session.id,
      timestamp: new Date(),
      QRCodeHash,
      lat,
      long,
    },
  });

  return { attendance, session, distance };
});
