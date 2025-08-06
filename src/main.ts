import "./assets/main.css";

import { createApp } from "vue";
import PrimeVue from "primevue/config";
import Aura from "@primeuix/themes/aura";
import App from "./App.vue";
import router from "./router";
import { ToastService } from "primevue";

const app = createApp(App);

app
  // .use(router)
  .use(ToastService)
  .use(PrimeVue, {
    theme: {
      preset: Aura
    }
  });

app.mount("#app");
