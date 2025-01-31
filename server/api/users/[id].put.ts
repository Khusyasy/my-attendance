export default defineEventHandler(async (event) => {
  const id = Number(getRouterParam(event, "id"));
  const result = await readValidatedBody(event, (body) =>
    usersPostSchema.partial().safeParse(body),
  );
  // if (!result.success) throw result.error.issues;
  if (!result.success) {
    return jsend.fail(null);
  }
  const { username, password, role } = result.data;

  const user = await prisma.user.findUnique({
    where: {
      id: id,
    },
  });

  if (!user) {
    return jsend.fail("User not found");
  }

  const updatedUser = await prisma.user.update({
    where: { id },
    data: {
      username,
      password: password ? hashPassword(password) : undefined,
      roleName: role,
    },
  });

  return jsend.success(updatedUser);
});
