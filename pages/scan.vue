<script setup lang="ts">
const currentQR = ref<string | null>(null);
</script>

<template>
  <div>
    <h1>SCAN QR</h1>
    {{ currentQR }}
  </div>
</template>
