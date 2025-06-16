import { createApp } from "vue";
import App from "./App.vue";
import router from './router';
// DevExtreme CSS
import "devextreme/dist/css/dx.light.css";
import "devextreme/dist/css/dx.common.css";

// PrimeVue & Dialog
import PrimeVue from "primevue/config";
import Dialog from "primevue/dialog";
import vuetify from "./plugins/vuetify";

const app = createApp(App);

// Register components globally
import DataGrid from "devextreme-vue/data-grid";
import TextBox from "devextreme-vue/text-box";
import Button from "primevue/button";
app.component("DxDataGrid", DataGrid);
app.component("DxTextBox", TextBox);
app.component("Dialog", Dialog);
app.component("Button", Button);
app.use(PrimeVue);
app.use(vuetify);
app.use(router);
app.mount("#app");
