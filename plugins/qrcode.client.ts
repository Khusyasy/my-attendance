import type { Options } from "qr-code-styling";
import QRCodeStyling from "qr-code-styling";

export default defineNuxtPlugin(() => {
  let qrCodeStyling: QRCodeStyling;
  return {
    provide: {
      qrCodeStyling: (options: Partial<Options>): QRCodeStyling => {
        if (qrCodeStyling) return qrCodeStyling;
        qrCodeStyling = new QRCodeStyling(options);
        return qrCodeStyling;
      },
    },
  };
});
