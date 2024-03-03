// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  devtools: { enabled: true },
  ssr: false,
  // serverMiddleware: ["~/server/middleware/oscServer"],

  // server: {
  //   requireMiddleware: ["esm"],
  // },
  modules: ["@pinia/nuxt"],
  // override: true,
});
