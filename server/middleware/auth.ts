export default defineEventHandler(async (event) => {
  const accessToken = getCookie(event, "auth_token");
  if (!accessToken) {
    return;
  }

  try {
    const decoded = verifyAccessToken(accessToken);
    const user = await prisma.user.findUnique({
      where: { id: decoded.userId },
    });

    if (!user) {
      return;
    }

    event.context.auth = {
      id: user.id,
    };
  } catch {
    return;
  }
});
