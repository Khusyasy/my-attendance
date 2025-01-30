<script setup lang="ts">
definePageMeta({
  middleware: ["auth"],
});

const colorMode = useColorMode();
const isDark = computed({
  get() {
    return colorMode.value === "dark";
  },
  set() {
    colorMode.preference = colorMode.value === "dark" ? "light" : "dark";
  },
});

const router = useRouter();
const logout = async () => {
  await useFetch("/api/auth/logout", {
    method: "POST",
  });

  router.push("/login");
};
</script>

<template>
  <div>
    <h1>Index page</h1>
    <div>
      <p @click="logout()">Logout</p>
    </div>
    <div>
      <NuxtLink to="create"> Go to Create </NuxtLink>
    </div>
    <div>
      <NuxtLink to="scan"> Go to Scan </NuxtLink>
    </div>
    <ClientOnly>
      <UButton
        :icon="
          isDark ? 'i-heroicons-moon-20-solid' : 'i-heroicons-sun-20-solid'
        "
        :label="isDark ? 'Dark' : 'Light'"
        color="primary"
        variant="solid"
        aria-label="Theme"
        @click="isDark = !isDark"
      />
      <template #fallback>
        <div class="h-8 w-8" />
      </template>
    </ClientOnly>
  </div>
</template>
