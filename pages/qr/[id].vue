<script setup lang="ts">
const route = useRoute();
const { data } = await useFetch(`/api/qr/${route.params.id}`);
</script>

<template>
  <div class="">
    <h1>QR for {{ data?.id }}</h1>
    <ClientOnly>
      <QRCode v-if="data" :data="data.QRCodeHash"></QRCode>
      <div v-else>QR not found</div>
    </ClientOnly>
  </div>
</template>
