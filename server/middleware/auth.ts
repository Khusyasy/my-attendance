import prisma from "@/db"
import jwt from "jsonwebtoken"

export default defineEventHandler(async (event) => {
  const jwtCookie = getCookie(event, "jwt") || null
  if (!jwtCookie) return;

  if (process.env.JWT_SECRET === undefined) {
    throw new Error("env JWT_SECRET is not defined")
  }

  const { id } = jwt.verify(jwtCookie, process.env.JWT_SECRET) as { id: string }
  if (!id) return;

  const authToken = await prisma.authToken.findFirst({
    where: {
      userId: parseInt(id),
      token: jwtCookie,
    },
  })
  if (!authToken) return;

  const user = await prisma.user.findUnique({
    where: {
      id: parseInt(id),
    },
  })
  if (!user) return;

  const { password, ...userWithoutPassword } = user
  event.context.auth = userWithoutPassword
})
