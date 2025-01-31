export default defineNuxtRouteMiddleware(async (to, _) => {
  // allow pages here
  if (to.path === "/login") return;

  // try to refresh the token
  const { data } = await useFetch("/api/auth/refresh", {
    method: "POST",
  });

  if (!data.value || data.value.status === "fail") {
    return navigateTo("/login");
  }
});
