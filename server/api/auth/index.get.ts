export default defineEventHandler(async (event) => {
  const user = event.context.auth

  if (!user) {
    return {
      status: "fail",
      data: { info: "not logged in" },
    }
  }

  return {
    status: "success",
    data: user,
  }
})
