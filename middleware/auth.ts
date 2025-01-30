export default defineNuxtRouteMiddleware(async (to, _) => {
  // allow pages here
  if (to.path === "/login") return;

  try {
    // try to refresh the token
    const { error } = await useFetch("/api/auth/refresh", {
      method: "POST",
    });

    if (error.value) {
      return navigateTo("/login");
    }
  } catch {
    return navigateTo("/login");
  }
});
