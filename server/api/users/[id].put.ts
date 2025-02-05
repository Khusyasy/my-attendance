export default defineEventHandler(async (event) => {
  const id = Number(getRouterParam(event, "id"));
  const result = await readValidatedBody(event, (body) =>
    usersPostSchema.partial().safeParse(body),
  );
  if (!result.success) {
    return jsend.fail(result.error.issues);
  }
  const { email, name, password } = result.data;

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
      email,
      name,
      password: password ? hashPassword(password) : undefined,
    },
  });

  return jsend.success(updatedUser);
});
