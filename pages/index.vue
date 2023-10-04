<template>
  <div>
    <NuxtLink to="/"> Home </NuxtLink>
    <NuxtLink to="/admin"> Admin </NuxtLink>
    <NuxtLink to="/auth"> Auth </NuxtLink>
    {{ res?.data }}
  </div>
</template>

<script setup lang="ts">
const { data: res } = await useFetch('/api/auth')

console.log(res.value?.data)
</script>

<style scoped>
</style>
