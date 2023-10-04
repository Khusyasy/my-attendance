import prisma from "@/db"
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"

function comparePassword(password: string, hash: string) {
  return bcrypt.compareSync(password, hash)
}

function createJwtToken(id: number) {
  if (process.env.JWT_SECRET === undefined) {
    throw new Error("env JWT_SECRET is not defined")
  }

  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: "1d",
  })
}

export default defineEventHandler(async (event) => {
  const jwt = getCookie(event, "jwt") || null

  if (jwt) {
    return {
      status: "fail",
      data: { info: "already logged in" },
    }
  }

  const body = await readBody(event)
  const { username, password } = body

  if (!username || !password) {
    return {
      status: "fail",
      data: {
        username: "username are required",
        password: "password are required",
      },
    }
  }

  const user = await prisma.user.findUnique({
    where: {
      username,
    },
  })

  if (!user) {
    return {
      status: "fail",
      data: {
        username: "username or password is incorrect",
        password: "username or password is incorrect",
      },
    }
  }

  if (!comparePassword(password, user.password)) {
    return {
      status: "fail",
      data: {
        username: "username or password is incorrect",
        password: "username or password is incorrect",
      },
    }
  }

  const jwtToken = createJwtToken(user.id)

  // save to database

  setCookie(event, "jwt", jwtToken)

  return {
    status: "success",
    data: null,
  }
})
