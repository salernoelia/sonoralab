// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  devtools: { enabled: true },
  ssr: false,
  // serverMiddleware: [{ path: "/api/osc", handler: "~/server/api/osc.js" }],
  // server: {
  //   requireMiddleware: ["esm"],
  // },
  modules: ["@pinia/nuxt"],
});
