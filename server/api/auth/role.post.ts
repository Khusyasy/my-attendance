export default defineEventHandler(async (event) => {
  const cookies = parseCookies(event);
  const accessToken = cookies.auth_token;
  if (!accessToken) {
    return jsend.fail(null);
  }

  try {
    const decoded = verifyAccessToken(accessToken);
    const user = await prisma.user.findUnique({
      where: { id: decoded.userId },
    });

    if (!user) {
      return jsend.fail(null);
    }

    return jsend.success(user.roleName as "admin" | "teacher" | "student");
  } catch {
    return jsend.fail(null);
  }
});
