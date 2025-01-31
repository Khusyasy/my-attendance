export default function () {
  // TODO: i really dont understand composables so f
  const { data, error, execute } = useFetch("/api/auth/role", {
    method: "POST",
    immediate: false,
  });

  const getRole = async () => {
    await execute();

    if (error.value) {
      return null;
    } else if (!data.value || data.value.status === "fail") {
      return null;
    }
    return data.value.data;
  };

  return { getRole };
}
