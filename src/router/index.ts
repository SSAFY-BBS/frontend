import { createRouter, createWebHistory, type RouteRecordRaw } from 'vue-router';
import HomePage from '@/pages/HomePage.vue';
import FestivalPage from '@/pages/FestivalPage.vue';
import BoardWritePage from '@/pages/BoardWritePage.vue'
import BoardEditPage from '@/pages/BoardEditPage.vue'
import MealFriendPage from '@/pages/MealFriendPage.vue'

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
  {
    path: '/board/write',
    name: 'BoardWrite',
    component: BoardWritePage,
  },
  {
    path: '/board/edit',
    name: 'BoardEdit',
    component: BoardEditPage,
  },
  {
    path: '/meal-friend',
    name: 'MealFriend',
    component: MealFriendPage,
  }
];

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
});

export default router;