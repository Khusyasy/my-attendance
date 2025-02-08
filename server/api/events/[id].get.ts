export default defineEventHandler(async (event) => {
  const id = Number(getRouterParam(event, "id"));
  if (isNaN(id)) {
    return jsend.fail("Invalid ID");
  }

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
