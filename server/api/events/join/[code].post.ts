export default defineEventHandler(async (event) => {
  if (!event.context.auth) {
    return jsend.fail("Unauthorized");
  }

  const code = String(getRouterParam(event, "code"));

  const ev = await prisma.event.findUnique({
    where: {
      code,
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
  if (ev.Enrollment.length > 0) {
    return jsend.fail("You are already enrolled in this event");
  }

  const enrollment = await prisma.enrollment.create({
    data: {
      userId: event.context.auth.id,
      eventId: ev.id,
      role: "Attendee",
    },
  });

  if (!enrollment) {
    return jsend.fail("Failed to join event");
  }

  return jsend.success(enrollment);
});
