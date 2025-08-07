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
          path: 'rate-lesson',
          name: 'teacher-rate-lesson',
          component: () => import('@/views/teacher/RateLessonView.vue'),
        },
        {
          path: 'rate-lesson-details',
          name: 'teacher-rate-lesson-details',
          component: () => import('@/views/teacher/RateLessonDetailsView.vue'),
        },
        {
          path: 'rating-category',
          name: 'teacher-rating-category',
          component: () => import('@/views/teacher/RatingCategoryView.vue'),
        },
        {
          path: 'profile',
          name: 'teacher-profile',
          component: () => import('@/views/teacher/ProfileView.vue'),
        },
        {
          path: 'profile/edit',
          name: 'teacher-profile-edit',
          component: () => import('@/views/teacher/EditProfileView.vue'),
        },
      ],
    },
  ],
})

export default router
