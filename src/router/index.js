import { createRouter, createWebHistory } from 'vue-router';
// import HomeView from '../views/HomeView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: () => import('../components/AppIndex.vue')
    },
    {
      path: '/new-page',
      name: 'new-page',
      component: () => import('../views/Displayimage.vue')
    },
    {
      path: '/test',
      name: 'test',
      component: () => import('../views/Test.vue')
    },
  ]
})

export default router
