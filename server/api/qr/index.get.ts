export default defineEventHandler(async () => {
  const qrs = await prisma.session.findMany();
  return jsend.success(qrs);
});
