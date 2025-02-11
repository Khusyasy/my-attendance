const FIVE_MINUTES = 5 * 60 * 1000;

export default defineNuxtRouteMiddleware(async (to, _) => {
  // allow pages here
  if (to.path === "/login") return;

  const lastCheck = useState("lastCheck", () => 0);
  const diff = Date.now() - lastCheck.value;
  if (diff < FIVE_MINUTES) return;

  // refresh the token
  const { data } = await useFetch("/api/auth/refresh", {
    method: "POST",
  });
  lastCheck.value = Date.now();

  const toast = useToast();

  if (!data.value || data.value.status === "fail") {
    toast.add({
      title: "Session expired",
      description: "Please login again",
      icon: "i-heroicons-information-circle",
      color: "red",
      timeout: 0,
    });
    return navigateTo("/login");
  }
});
