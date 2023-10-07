// https://nuxt.com/docs/api/configuration/nuxt-config
import vuetify, { transformAssetUrls } from 'vite-plugin-vuetify'

export default defineNuxtConfig({
  devtools: { enabled: true },
  modules: [
    (_options, nuxt) => {
      nuxt.hooks.hook('vite:extendConfig', (config) => {
        // @ts-expect-error
        config.plugins.push(vuetify({ autoImport: true }))
      })
    },
  ],
  plugins: ['~/plugins/vuetify.ts','~/plugins/vee-validate.ts'],
  vite: {
    vue: {
      template: {
        transformAssetUrls,
      },
    },
    // https://github.com/vuetifyjs/vuetify/issues/16121#issuecomment-1320867902
    ssr: {
      noExternal: ['vuetify'],
    },
  },
})
