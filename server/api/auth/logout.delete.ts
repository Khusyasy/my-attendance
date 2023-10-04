import prisma from "@/db"

export default defineEventHandler(async (event) => {
  const user = event.context.auth;
  const jwtCookie = getCookie(event, "jwt") || null

  if (!user || !jwtCookie) {
    return {
      status: "fail",
      data: { info: "not logged in" },
    }
  }

  await prisma.authToken.delete({
    where: {
      token: jwtCookie,
    },
  })

  deleteCookie(event, "jwt")

  return {
    status: "success",
    data: null,
  }
})
