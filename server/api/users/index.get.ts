export default defineEventHandler(async () => {
  const users = await prisma.user.findMany();
  return jsend.success(users);
});
