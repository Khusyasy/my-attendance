export default defineEventHandler(async (event) => {
  const body = await readBody(event);
  console.log(body);

  const now = new Date();

  const qr = await prisma.session.create({
    data: {
      createTimestamp: now,
      expireTimestamp: new Date(now.getTime() + 1000 * 60 * 60),
      QRCodeHash: randomHash(),
      geolocation: "latitute,longitude",
    },
  });

  return qr;
});
