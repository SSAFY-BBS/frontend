import { createRouter, createWebHistory, type RouteRecordRaw } from 'vue-router';
import HomePage from '@/pages/HomePage.vue';
import FestivalPage from '@/pages/FestivalPage.vue';

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    name: 'Home',
    component: HomePage,
  },
  {
    path: '/festival',
    name: 'Festival',
    component: FestivalPage,
  },
  {
    path: '/board',
    name: 'BoardList',
    component: () => import('@/pages/BoardPage.vue'),
  },
];

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
});

export default router;