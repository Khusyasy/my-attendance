export default function () {
  // const currentRole = ref<"admin" | "teacher" | "student" | null>(null);
  // const lastCheck = ref<number | null>(null);
  const currentRole = useState<"admin" | "teacher" | "student" | null>(
    "currentRole",
    () => null,
  );
  const lastCheck = useState<number | null>("lastCheck", () => null);

  const getRole = async () => {
    const now = new Date().getTime();
    if (
      currentRole.value !== null &&
      lastCheck.value !== null &&
      now - lastCheck.value < 1000 * 60 * 5 // 5 minutes
    ) {
      return currentRole.value;
    }

    const res = await $fetch("/api/auth/role", {
      method: "POST",
    });

    if (res.status === "fail") {
      currentRole.value = null;
      lastCheck.value = null;
      return null;
    }
    currentRole.value = res.data;
    lastCheck.value = new Date().getTime();
    return currentRole.value;
  };

  return { getRole };
}
