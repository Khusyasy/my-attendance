<script setup lang="ts">
import type QrScanner from "qr-scanner";

const router = useRouter();

const currentQR = ref<string | null>(null);

async function onDecode(result: QrScanner.ScanResult) {
  if (result.data === currentQR.value) return;
  currentQR.value = result.data;

  try {
    const pos = await getGeolocation();
    // TODO: handle error
    const data = await $fetch("/api/attendance", {
      method: "POST",
      body: {
        QRCodeHash: result.data,
        lat: pos.coords.latitude,
        long: pos.coords.longitude,
        accuracy: pos.coords.accuracy,
      },
    });

    alert(JSON.stringify(data));
    currentQR.value = null;
    router.back();
  } catch {
    alert("Please enable location services");
  }
}
</script>

<template>
  <div>
    <h1>SCAN QR</h1>
    <QRReader :on-decode="onDecode"> </QRReader>
    {{ currentQR }}
  </div>
</template>
