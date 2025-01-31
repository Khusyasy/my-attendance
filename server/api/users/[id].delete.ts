// TODO: users delete api
export default defineEventHandler(async (event) => {
  const id = Number(getRouterParam(event, "id"));

  const user = await prisma.user.findUnique({
    where: { id },
  });

  if (!user) {
    return jsend.fail("User not found");
  }

  await prisma.user.delete({
    where: { id },
  });

  return jsend.success(null);
});
