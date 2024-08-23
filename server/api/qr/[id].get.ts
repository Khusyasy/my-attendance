export default defineEventHandler(async (event) => {
  const id = Number(getRouterParam(event, "id"));

  const qr = await prisma.session.findUnique({
    where: {
      id: id,
    },
  });

  return qr;
});
