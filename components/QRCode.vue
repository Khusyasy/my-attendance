<template>
  <div ref="qrCode"></div>
</template>

<script setup lang="ts">
const { $qrCodeStyling } = useNuxtApp();

const props = defineProps<{ data: string }>();

const qrCode = ref<HTMLElement | null>(null);

watchEffect(() => {
  if (qrCode.value) {
    const options = {
      width: 300,
      height: 300,
      data: props.data,
      backgroundOptions: { color: "#fff" },
      imageOptions: { crossOrigin: "anonymous", margin: 10 },
    };

    const qrCodeStyling = $qrCodeStyling(options);

    qrCode.value.innerHTML = "";
    qrCodeStyling.append(qrCode.value);
  }
});
</script>

<style scoped></style>
