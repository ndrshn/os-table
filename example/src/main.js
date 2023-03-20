import { createApp } from "vue/dist/vue.esm-bundler";
import App from "./App.vue";
import OsTable from "../../dist/index";
import "../../dist/style.css"

const app = createApp(App);
app.use(OsTable);
app.mount("#app");
