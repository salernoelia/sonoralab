// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  devtools: { enabled: true },
  ssr: false,

  modules: ["@pinia/nuxt"],

  runtimeConfig: {
    url: process.env.SUPABASE_URL,
    key: process.env.SUPABASE_KEY,
  },

  css: ["assets/css/main.scss"],
});
