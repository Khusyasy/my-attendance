export default defineEventHandler(async () => {
  const evs = await prisma.event.findMany();
  return jsend.success(evs);
});
