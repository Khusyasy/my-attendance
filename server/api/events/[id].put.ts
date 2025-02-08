export default defineEventHandler(async (event) => {
  if (!event.context.auth) {
    return jsend.error("Unauthorized");
  }

  const id = Number(getRouterParam(event, "id"));
  if (isNaN(id)) {
    return jsend.fail("Invalid ID");
  }

  const result = await readValidatedBody(event, (body) =>
    eventsPostSchema.partial().safeParse(body),
  );
  if (!result.success) {
    return jsend.fail(result.error.issues);
  }
  const { name, lat, long, radius } = result.data;

  const ev = await prisma.event.findUnique({
    where: {
      id: id,
    },
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

  const updatedEv = await prisma.event.update({
    where: { id },
    data: {
      name,
      lat,
      long,
      radius,
    },
  });

  return jsend.success(updatedEv);
});
