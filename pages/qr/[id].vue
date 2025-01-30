<script setup lang="ts">
const route = useRoute();
const { data } = await useFetch(`/api/qr/${route.params.id}`);
</script>

<template>
  <div v-if="data && data.status === 'success'">
    <h1>QR for {{ data.data.id }}</h1>
    <QRCode :key="data.data.QRCodeHash" :data="data.data.QRCodeHash"></QRCode>
  </div>
  <div v-else>QR not found</div>
</template>
