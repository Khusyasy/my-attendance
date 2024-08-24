<template>
  <div ref="qrCode"></div>
</template>

<script setup lang="ts">
import type { DotType, DrawType, Options } from "qr-code-styling";
import QRCodeStyling from "qr-code-styling";

const props = defineProps<{ data: string; options?: Partial<Options> }>();

const qrCode = ref<HTMLElement | null>(null);

// https://github.com/kozakdenys/qr-code-styling-examples/blob/master/examples/vue/src/components/QRCodeStyling.vue

watchEffect(() => {
  if (qrCode.value) {
    const options: Options = {
      width: 300,
      height: 300,
      type: "svg" as DrawType,
      data: props.data,
      margin: 10,
      backgroundOptions: { color: "#fff" },
      imageOptions: {
        hideBackgroundDots: true,
        margin: 20,
        crossOrigin: "anonymous",
      },
      dotsOptions: {
        color: "#121212",
        type: "rounded" as DotType,
      },
      ...props.options,
    };

    const qrCodeStyling = new QRCodeStyling(options);

    qrCodeStyling.append(qrCode.value);
  }
});
</script>

<style scoped></style>
