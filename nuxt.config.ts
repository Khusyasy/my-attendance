// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  devtools: { enabled: true },
  compatibilityDate: "2024-08-22",
  typescript: {
    typeCheck: false,
  },
  imports: {
    dirs: ["schemas"],
  },
  nitro: {
    imports: {
      dirs: ["schemas"],
    },
  },
  modules: ["@nuxt/eslint", "@nuxt/ui", "@nuxtjs/leaflet", "@nuxtjs/ngrok"],
  ngrok: {
    authtoken: process.env.NGROK_AUTHTOKEN,
    domain: process.env.NGROK_DOMAIN,
  },
});
