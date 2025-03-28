import { httpClient } from '@/composables/HttpClient';
import { useAuthStore } from '@/stores/auth'
import { createRouter, createWebHistory } from 'vue-router'
// import HomeView from '../views/HomeView.vue'
// import UserRegisterView from '../views/UserRegisterView.vue'


const router = createRouter({
  history: createWebHistory(import.meta.env.VITE_BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: () => import('../views/HomeView.vue'),
    },
    {
      path: '/register',
      name: 'register',
      component: import('../views/UserRegisterView.vue'),
    },
    {
      path: '/user-info',
      name: 'user-info',
      component: import('../views/UserInfo.vue'),
    },
  ],
})

router.beforeEach((to, from, next) => {
  const { isRegistered } = useAuthStore();
  if (to.name != "home") {
    if (httpClient.accessToken == null)
      window.location.href = `${import.meta.env.VITE_API_BASE_URL}/api/auth/login?redirect_uri=${encodeURIComponent(`${window.location.protocol}//${window.location.host}${import.meta.env.VITE_BASE_URL}${to.path}`)}`;
    else if (to.name != "register" && isRegistered != true)
      next({ name: 'register' });
    else if (to.name == "register" && isRegistered == true)
      next({ name: 'user-info' });
    else
      next();
  }
  else
    next();
})

export default router
