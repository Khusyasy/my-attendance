<template>
  <div>
    <NuxtLink to="/"> Home </NuxtLink>
    <NuxtLink to="/admin"> Admin </NuxtLink>
    <NuxtLink to="/auth"> Auth </NuxtLink>
    {{ data }}
  </div>
</template>

<script setup lang="ts">
const { data } = await useFetch('/api/auth')
</script>

<style scoped>
</style>
