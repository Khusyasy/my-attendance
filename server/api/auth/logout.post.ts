export default defineEventHandler(async (event) => {
  if (!event.context.auth) {
    return jsend.fail(null);
  }

  await prisma.user.updateMany({
    where: { id: event.context.auth.id },
    data: { refreshToken: null },
  });

  deleteCookie(event, "auth_token", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
  });

  deleteCookie(event, "refresh_token", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
  });

  return jsend.success(null);
});
