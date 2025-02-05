<template>
  <div class="flex h-screen flex-col items-center justify-center">
    <h1 class="text-3xl font-bold">Manage Courses</h1>
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  middleware: ["auth"],
});
</script>

<style scoped></style>
