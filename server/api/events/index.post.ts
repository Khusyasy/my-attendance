export default defineEventHandler(async (event) => {
  if (!event.context.auth) {
    return jsend.error("Unauthorized");
  }

  const result = await readValidatedBody(event, (body) =>
    eventsPostSchema.safeParse(body),
  );
  if (!result.success) {
    return jsend.fail(result.error.issues);
  }
  const { name, lat, long, radius } = result.data;

  const ev = await prisma.event.create({
    data: {
      name,
      code: nidEventCode(),
      lat,
      long,
      radius,
      Enrollment: {
        create: {
          role: "Owner",
          user: {
            connect: {
              id: event.context.auth.id,
            },
          },
        },
      },
    },
  });

  if (!ev) {
    return jsend.fail("Failed to create event");
  }

  return jsend.success(ev);
});
