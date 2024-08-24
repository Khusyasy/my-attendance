import { z } from "zod";

const bodySchema = z.object({
  QRCodeHash: z
    .string()
    .length(16)
    .regex(/^[0-9A-Za-z]+$/),
});

export default defineEventHandler(async (event) => {
  const result = await readValidatedBody(event, (body) =>
    bodySchema.safeParse(body),
  );
  if (!result.success) throw result.error.issues;

  const { QRCodeHash } = result.data;

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

  const attendance = await prisma.attendance.create({
    data: {
      sessionId: session.id,
      timestamp: new Date(),
      QRCodeHash,
      geolocation: "0,0",
    },
  });

  return { attendance, session };
});
