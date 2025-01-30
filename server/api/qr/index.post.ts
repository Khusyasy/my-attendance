import { z } from "zod";

const bodySchema = z.object({
  lat: z.number().min(-90).max(90),
  long: z.number().min(-180).max(180),
  radius: z.number().min(0),
});

export default defineEventHandler(async (event) => {
  const result = await readValidatedBody(event, (body) =>
    bodySchema.safeParse(body),
  );
  // if (!result.success) throw result.error.issues;
  if (!result.success) {
    return jsend.fail(null);
  }
  const { lat, long, radius } = result.data;

  const now = new Date();
  const qr = await prisma.session.create({
    data: {
      createTimestamp: now,
      expireTimestamp: new Date(now.getTime() + 1000 * 60 * 60),
      QRCodeHash: randomHash(),
      lat,
      long,
      radius,
    },
  });

  return jsend.success(qr);
});
