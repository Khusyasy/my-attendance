export default defineNuxtRouteMiddleware(async (to, _) => {
  // allow pages here
  if (to.path === "/login") return;

  // recheck only after 5 minutes
  const lastCheck = useState("lastCheck", () => 0);
  if (Date.now() - lastCheck.value < 5 * 60 * 1000) return;

  // try to refresh the token
  const { data } = await useFetch("/api/auth/refresh", {
    method: "POST",
  });
  lastCheck.value = Date.now();

  if (!data.value || data.value.status === "fail") {
    return navigateTo("/login");
  }
});
