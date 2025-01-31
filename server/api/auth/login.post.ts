export default defineEventHandler(async (event) => {
  const result = await readValidatedBody(event, (body) =>
    loginPostSchema.safeParse(body),
  );
  // if (!result.success) throw result.error.issues;
  if (!result.success) {
    return jsend.fail("Invalid username or password");
  }
  const { username, password } = result.data;

  const user = await prisma.user.findUnique({
    where: { username },
    omit: {
      password: false,
    },
  });
  if (!user) {
    return jsend.fail("Invalid username or password");
  }

  if (!comparePassword(password, user.password)) {
    return jsend.fail("Invalid username or password");
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
    username: user.username,
    role: user.roleName,
  });
});
