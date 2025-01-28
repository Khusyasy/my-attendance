<script setup lang="ts">
import type QrScanner from "qr-scanner";

const router = useRouter();

const currentQR = ref<string | null>(null);

async function onDecode(result: QrScanner.ScanResult) {
  if (result.data === currentQR.value) return;
  currentQR.value = result.data;

  try {
    const pos = await getGeolocation();
    const { data, error } = await useFetch("/api/attendance", {
      method: "POST",
      body: {
        QRCodeHash: result.data,
        lat: pos.coords.latitude,
        long: pos.coords.longitude,
        accuracy: pos.coords.accuracy,
      },
    });

    if (error.value) {
      alert(JSON.stringify(error.value));
      currentQR.value = null;
    } else {
      alert(JSON.stringify(data.value));
      currentQR.value = null;
      router.back();
    }
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
