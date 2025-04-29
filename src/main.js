import { createApp } from "vue";
import App from "./App.vue";
import { router } from "./routes";
import { store } from "./store";
import { app as firebaseApp } from './firebase'

const app = createApp(App);



app.use(store);
app.use(router);

app.mount("#app");
