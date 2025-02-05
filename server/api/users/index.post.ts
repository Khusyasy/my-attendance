export default defineEventHandler(async (event) => {
  const result = await readValidatedBody(event, (body) =>
    usersPostSchema.safeParse(body),
  );
  if (!result.success) {
    return jsend.fail(result.error.issues);
  }
  const { email, name, password } = result.data;

  // TODO: implement register logic, check if user already exists
  const user = await prisma.user.create({
    data: {
      email,
      name,
      password: hashPassword(password),
    },
  });

  if (!user) {
    return jsend.error("Failed to create user");
  }

  return jsend.success(user);
});
