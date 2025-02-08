export default defineEventHandler(async (event) => {
  const id = Number(getRouterParam(event, "id"));
  if (isNaN(id)) {
    return jsend.fail("Invalid ID");
  }

  const qr = await prisma.session.findUnique({
    where: {
      id: id,
    },
  });

  if (!qr) {
    return jsend.fail("QR code not found");
  }

  return jsend.success(qr);
});
