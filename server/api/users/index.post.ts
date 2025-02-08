export default defineEventHandler(async (event) => {
  const result = await readValidatedBody(event, (body) =>
    usersPostSchema.safeParse(body),
  );
  if (!result.success) {
    return jsend.fail(result.error.issues);
  }
  const { email, name, password } = result.data;

  const check = await prisma.user.findUnique({
    where: { email },
  });
  if (check) {
    return jsend.fail("Email already used");
  }

  const user = await prisma.user.create({
    data: {
      email,
      name,
      password: hashPassword(password),
    },
  });

  if (!user) {
    return jsend.fail("Failed to create user");
  }

  return jsend.success(user);
});
