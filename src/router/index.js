import { createRouter, createWebHistory } from 'vue-router';
// import HomeView from '../views/HomeView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/draw',
      name: 'draw',
      component: () => import('../components/AppIndex.vue')
    },
    {
      path: '/new-page',
      name: 'new-page',
      component: () => import('../views/Displayimage.vue')
    },
    // {
    //   path: '/test',
    //   name: 'test',
    //   component: () => import('../views/Test.vue')
    // },
    {
      path: '/',
      name: 'homeIndex',
      component: () => import('../views/HomeView.vue')
    },
  ]
})

export default router
