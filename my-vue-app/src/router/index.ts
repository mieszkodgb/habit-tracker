// src/router/index.ts
import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '@/features/auth/stores/authStore'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/',
      component: () => import('@/pages/HomePage.vue')
    },
    {
      path: '/login',
      component: () => import('@/pages/LoginPage.vue')
    },
    {
      path: '/register',
      component: () => import('@/pages/RegisterPage.vue')
    },
    {
      path: '/habits',
      component: () => import('@/pages/HabitDashboard.vue'),
      meta: { requiresAuth: true }
    }

  ]
})

router.beforeEach((to, _, next) => {
  const authStore = useAuthStore()
  
  if (to.meta.requiresAuth && !authStore.isAuthenticated) {
    next('/login')
  } else {
    next()
  }
})

export default router