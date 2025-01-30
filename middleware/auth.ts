export default defineNuxtRouteMiddleware(async (to, _) => {
  // allow pages here
  if (to.path === "/login") return;

  try {
    // try to refresh the token
    await $fetch("/api/auth/refresh", {
      method: "POST",
    });
  } catch {
    return navigateTo("/login");
  }
});
