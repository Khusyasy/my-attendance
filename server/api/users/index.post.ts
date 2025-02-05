export default defineEventHandler(async (event) => {
  const result = await readValidatedBody(event, (body) =>
    usersPostSchema.safeParse(body),
  );
  if (!result.success) {
    return jsend.fail(result.error.issues);
  }
  const { username, password } = result.data;

  const user = await prisma.user.create({
    data: {
      username,
      password: hashPassword(password),
    },
  });

  if (!user) {
    return jsend.error("Failed to create user");
  }

  return jsend.success(user);
});
