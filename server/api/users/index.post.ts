export default defineEventHandler(async (event) => {
  const result = await readValidatedBody(event, (body) =>
    usersPostSchema.safeParse(body),
  );
  // if (!result.success) throw result.error.issues;
  if (!result.success) {
    return jsend.fail(null);
  }
  const { username, password, role } = result.data;

  const user = await prisma.user.create({
    data: {
      username,
      password: hashPassword(password),
      roleName: role,
    },
  });

  if (!user) {
    return jsend.error("Failed to create user");
  }

  return jsend.success(user);
});
