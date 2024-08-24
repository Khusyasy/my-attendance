<script setup lang="ts">
import type QrScanner from "qr-scanner";

const currentQR = ref<string | null>(null);
const debug = ref<string | null>(null);

async function onDecode(result: QrScanner.ScanResult) {
  if (result.data === currentQR.value) return;

  currentQR.value = result.data;
  const { data } = await useFetch("/api/attendance", {
    method: "POST",
    body: { QRCodeHash: result.data },
  });

  debug.value = JSON.stringify(data);
  alert("Success create attendance for session " + data.value?.session.id);
  currentQR.value = null;
}
</script>

<template>
  <div>
    <h1>SCAN QR</h1>
    <QRReader :on-decode="onDecode"> </QRReader>
    {{ currentQR }}
    {{ debug }}
  </div>
</template>
