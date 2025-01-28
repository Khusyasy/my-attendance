// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  devtools: { enabled: true },
  compatibilityDate: "2024-08-22",
  typescript: {
    typeCheck: true,
  },
  modules: [
    "@nuxtjs/tailwindcss",
    "@nuxt/eslint",
    "@nuxtjs/leaflet",
    "@nuxtjs/ngrok",
  ],
  ngrok: {
    authtoken: process.env.NGROK_AUTHTOKEN,
    domain: process.env.NGROK_DOMAIN,
  },
});
