export default defineEventHandler(async (event) => {
  if (!event.context.auth) {
    return jsend.error("Unauthorized");
  }

  const id = Number(getRouterParam(event, "id"));
  if (isNaN(id)) {
    return jsend.fail("Invalid ID");
  }

  const ev = await prisma.event.findUnique({
    where: { id },
    include: {
      Enrollment: {
        where: {
          userId: event.context.auth.id,
        },
      },
    },
  });

  if (!ev) {
    return jsend.fail("Event not found");
  }

  if (ev.Enrollment.length <= 0 || ev.Enrollment[0].role !== "Owner") {
    return jsend.error("Unauthorized");
  }

  await prisma.event.delete({
    where: { id },
  });

  return jsend.success(null);
});
