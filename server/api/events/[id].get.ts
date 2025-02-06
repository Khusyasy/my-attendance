export default defineEventHandler(async (event) => {
  const id = Number(getRouterParam(event, "id"));

  const evnt = await prisma.event.findUnique({
    where: {
      id: id,
    },
  });

  if (!evnt) {
    return jsend.fail("Event not found");
  }

  return jsend.success(evnt);
});
