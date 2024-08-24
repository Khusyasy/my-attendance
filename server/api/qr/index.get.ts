export default defineEventHandler(async () => {
  const qrs = await prisma.session.findMany();
  return qrs;
});
