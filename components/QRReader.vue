<template>
  <video ref="videoContainer"></video>
</template>

<script setup lang="ts">
import QrScanner from "qr-scanner";

const videoContainer = ref<HTMLVideoElement | null>(null);
const qrScanner = ref<QrScanner | null>(null);

const { onDecode } = defineProps<{
  onDecode: (result: QrScanner.ScanResult) => void;
}>();

onMounted(async () => {
  if (videoContainer.value) {
    qrScanner.value = new QrScanner(videoContainer.value, onDecode, {
      preferredCamera: "environment",
      highlightScanRegion: true,
      highlightCodeOutline: true,
    });
    qrScanner.value.start();
  }
});

onUnmounted(() => {
  if (qrScanner.value) {
    qrScanner.value.stop();
    qrScanner.value.destroy();
    qrScanner.value = null;
  }
});
</script>

<style scoped>
video {
  width: 100%;
  aspect-ratio: 1;
}
</style>
