// nuxt.config.js or main.js

import { createPinia } from "pinia";
import { createNuxtApp } from "./app";

(async () => {
  const pinia = createPinia();
  await pinia.enableRouting(true).install();
  const app = await createNuxtApp(pinia);

  await app.listen(process.env.PORT || 3000, "0.0.0.0");
})();
