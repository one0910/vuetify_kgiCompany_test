import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/FrontHome.vue'

const routes = [
  {
    path: '/',
    component: () => import('@/views/FrontHome.vue')
  },
  {
    path: '/login',
    component: () => import('@/views/Front-stage/LoginView.vue')
  },
  {
    path: '/vlist',
    component: () => import('@/views/Front-stage/VlistView.vue')
  },
  {
    path: '/vbuttonlist',
    component: () => import('@/views/Front-stage/VButtonList.vue')
  },
  {
    path: '/vbuttonlist2',
    component: () => import('@/views/Front-stage/VButtonList2.vue')
  },
  {
    path: '/vradio',
    component: () => import('@/views/Front-stage/VRadio.vue')
  },
  {
    path: '/vradio2',
    component: () => import('@/views/Front-stage/VRadio2.vue')
  },
];

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  linkActiveClass: 'active',
  routes: routes,
})

export default router
