export default function () {
  const currentRole = ref<"admin" | "teacher" | "student" | null>(null);
  const lastCheck = ref<number | null>(null);

  const getRole = async () => {
    const now = new Date().getTime();
    if (
      currentRole.value !== null &&
      lastCheck.value !== null &&
      now - lastCheck.value < 1000 * 60 * 5 // 5 minutes
    ) {
      return currentRole.value;
    }

    try {
      const data = await $fetch("/api/auth/role", {
        method: "POST",
      });

      currentRole.value = data;
      if (currentRole.value === null) {
        lastCheck.value = null;
        throw new Error("Unauthorized");
      }
      lastCheck.value = new Date().getTime();

      return currentRole.value;
    } catch {
      currentRole.value = null;
      lastCheck.value = null;
      return null;
    }
  };

  return { getRole };
}
