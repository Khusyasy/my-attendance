import { z } from "zod";

const bodySchema = z.object({
  lat: z.number().min(-90).max(90),
  long: z.number().min(-180).max(180),
});

export default defineEventHandler(async (event) => {
  const result = await readValidatedBody(event, (body) =>
    bodySchema.safeParse(body),
  );
  if (!result.success) throw result.error.issues;
  console.log(result.data);

  const { lat, long } = result.data;

  const now = new Date();

  const qr = await prisma.session.create({
    data: {
      createTimestamp: now,
      expireTimestamp: new Date(now.getTime() + 1000 * 60 * 60),
      QRCodeHash: randomHash(),
      lat,
      long,
    },
  });

  return qr;
});
