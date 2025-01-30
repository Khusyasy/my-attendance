export default defineEventHandler(async (event) => {
  const cookies = parseCookies(event);
  const refreshToken = cookies.refresh_token;

  if (!refreshToken) {
    throw createError({
      statusCode: 401,
      statusMessage: "Refresh token required",
    });
  }

  try {
    const decoded = verifyRefreshToken(refreshToken);
    const user = await prisma.user.findUnique({
      where: { id: decoded.userId },
    });

    if (!user || user.refreshToken !== refreshToken) {
      throw createError({
        statusCode: 401,
        statusMessage: "Invalid refresh token",
      });
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

    return {
      user: {
        id: user.id,
        username: user.username,
        role: user.roleName,
      },
    };
  } catch {
    throw createError({
      statusCode: 401,
      statusMessage: "Invalid refresh token",
    });
  }
});
