import { createApp } from "vue";
import App from "./App.vue";
import router from './router';

// DevExtreme CSS
import "devextreme/dist/css/dx.light.css";
import "devextreme/dist/css/dx.common.css";
import '@mdi/font/css/materialdesignicons.min.css';

// PrimeVue & Dialog
import PrimeVue from "primevue/config";
import Dialog from "primevue/dialog";
import Button from "primevue/button";

// Vuetify
import vuetify from "./plugins/vuetify";

// Toast
import Vue3Toastify from "vue3-toastify";
import "vue3-toastify/dist/index.css";

// Create Vue app
const app = createApp(App);

// Register components globally
import DataGrid from "devextreme-vue/data-grid";
import TextBox from "devextreme-vue/text-box";

app.component("DxDataGrid", DataGrid);
app.component("DxTextBox", TextBox);
app.component("Dialog", Dialog);
app.component("Button", Button);

// Use plugins
app.use(PrimeVue);
app.use(Vue3Toastify, {
  multiple: true,
  autoClose: 5000,
  position: "top-center",
  style: {
    opacity: "1",
    userSelect: "initial",
  },
});
app.use(vuetify);
app.use(router);

// Mount app
app.mount("#app");
