<script setup lang="ts">
const route = useRoute();
const { data } = await useFetch(`/api/qr/${route.params.id}`);
</script>

<template>
  <div class="">
    <h1>QR for {{ data?.id }}</h1>
    <QRCode v-if="data" :key="data.QRCodeHash" :data="data.QRCodeHash"></QRCode>
    <div v-else>QR not found</div>
  </div>
</template>
