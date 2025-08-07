import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '@/views/HomeView.vue'
import AuthLayout from '@/layouts/AuthLayout.vue'
import TeacherLayout from '@/layouts/TeacherLayout.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView,
    },
    {
      path: '/auth',
      name: 'auth',
      component: AuthLayout,
      children: [
        {
          path: 'login',
          name: 'login',
          component: () => import('@/views/auth/LoginView.vue'),
        },
      ],
    },
    {
      path: '/teacher',
      component: TeacherLayout,
      children: [
        {
          path: 'lessons',
          name: 'teacher-lessons',
          component: () => import('@/views/teacher/MyLessonsView.vue'),
        },
        {
          path: '',
          redirect: { name: 'teacher-lessons' },
        },
      ],
    },
  ],
})

export default router
