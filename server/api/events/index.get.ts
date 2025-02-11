export default defineEventHandler(async (event) => {
  if (!event.context.auth) {
    return jsend.success([]);
  }

  const evs = await prisma.event.findMany({
    include: {
      Enrollment: {
        select: {
          role: true,
        },
        where: {
          userId: event.context.auth.id,
        },
      },
    },
    where: {
      Enrollment: {
        some: {
          userId: event.context.auth.id,
        },
      },
    },
  });

  const evsRole = evs.map((ev) => {
    const role = ev.Enrollment[0].role;
    return { ...ev, role };
  });

  return jsend.success(evsRole);
});
