<template>
  <div ref="qrCode"></div>
</template>

<script setup lang="ts">
const { $qrCodeStyling } = useNuxtApp();
export type Props = { data: string };
const { data } = defineProps<Props>();
const qrCode = ref<HTMLElement | null>(null);

const options = {
  width: 300,
  height: 300,
  data: data,
  backgroundOptions: { color: "#fff" },
  imageOptions: { crossOrigin: "anonymous", margin: 10 },
};

const qrCodeStyling = $qrCodeStyling(options);

onMounted(() => {
  if (qrCode.value) {
    qrCodeStyling.append(qrCode.value);
  }
});
</script>

<style scoped>
svg {
  width: 100%;
  height: 100%;
}
</style>
