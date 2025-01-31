export default defineEventHandler(async (event) => {
  const id = Number(getRouterParam(event, "id"));

  const user = await prisma.user.findUnique({
    where: {
      id: id,
    },
  });

  if (!user) {
    return jsend.fail("User not found");
  }

  return jsend.success(user);
});
