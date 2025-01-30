<script setup lang="ts">
definePageMeta({
  middleware: ["auth"],
});

const router = useRouter();
const logout = async () => {
  await $fetch("/api/auth/logout", {
    method: "POST",
  });

  router.push("/login");
};
</script>

<template>
  <div>
    <h1>Index page</h1>
    <div>
      <UButton @click="logout">Logout</UButton>
    </div>
    <div>
      <NuxtLink to="create"> Go to Create </NuxtLink>
    </div>
    <div>
      <NuxtLink to="scan"> Go to Scan </NuxtLink>
    </div>
  </div>
</template>
