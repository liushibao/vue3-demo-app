import './assets/main.css'
import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import { httpClient } from './composables/HttpClient'

const app = createApp(App)

app.config.errorHandler = (err, instance, info) => {
  // report error to tracking services
  console.log(err);
}

app.use(createPinia());


const code = new URL(window.location.href).searchParams.get("code");
if (code != null && window.location.hash == "#wechat_redirect") {
  const res: any = await httpClient.get("/api/auth/login/token", { code });
  httpClient.accessToken = res.token;
  const authStore = useAuthStore();
  authStore.$patch({ user: res.user, isRegistered: res.user.name != null });
}

import router from './router'
import { useAuthStore } from './stores/auth'
app.use(router)

app.mount('#app')
