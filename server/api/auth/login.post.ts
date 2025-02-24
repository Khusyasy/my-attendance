export default defineEventHandler(async (event) => {
  const result = await readValidatedBody(event, (body) =>
    loginPostSchema.safeParse(body),
  );
  if (!result.success) {
    return jsend.fail("Invalid email or password");
  }
  const { email, password } = result.data;

  const user = await prisma.user.findUnique({
    where: { email },
    omit: {
      password: false,
    },
  });
  if (!user) {
    return jsend.fail("Invalid email or password");
  }

  if (!comparePassword(password, user.password)) {
    return jsend.fail("Invalid email or password");
  }

  const { accessToken, refreshToken } = generateTokens({
    userId: user.id,
  });

  await prisma.user.update({
    where: { id: user.id },
    data: {
      refreshToken: refreshToken,
    },
  });

  setCookie(event, "auth_token", accessToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 60 * 15, // 15 minutes
  });

  setCookie(event, "refresh_token", refreshToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 60 * 60 * 24 * 7, // 7 days
  });

  return jsend.success({
    id: user.id,
    email: user.email,
  });
});
