export default defineEventHandler(async (event) => {
  const cookies = parseCookies(event);
  const refreshToken = cookies.refresh_token;

  if (!refreshToken) {
    return jsend.fail(null);
  }

  try {
    const decoded = verifyRefreshToken(refreshToken);
    const user = await prisma.user.findUnique({
      where: { id: decoded.userId },
      omit: {
        refreshToken: false,
      },
    });

    if (!user || user.refreshToken !== refreshToken) {
      return jsend.fail(null);
    }

    const { accessToken, refreshToken: newRefreshToken } = generateTokens({
      userId: user.id,
    });

    await prisma.user.update({
      where: { id: user.id },
      data: { refreshToken: newRefreshToken },
    });

    setCookie(event, "auth_token", accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 15, // 15 minutes
    });

    setCookie(event, "refresh_token", newRefreshToken, {
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
  } catch {
    return jsend.fail(null);
  }
});
