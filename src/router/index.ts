import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '@/views/HomeView.vue'
import AuthLayout from '@/layouts/AuthLayout.vue'
import TeacherLayout from '@/layouts/TeacherLayout.vue'
import AdminLayout from '@/layouts/AdminLayout.vue'
import SellerLayout from '@/layouts/SellerLayout.vue'

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
      path: '/admin',
      component: AdminLayout,
      children: [
        {
          path: '',
          redirect: { name: 'admin-dashboard' },
        },
        {
          path: 'dashboard',
          name: 'admin-dashboard',
          component: () => import('@/views/admin/DashboardView.vue'),
        },
        {
          path: 'schedule',
          name: 'admin-schedule',
          component: () => import('@/views/admin/ScheduleView.vue'),
        },
        {
          path: 'students',
          name: 'admin-students',
          component: () => import('@/views/admin/StudentsView.vue'),
        },
        {
          path: 'classes',
          name: 'admin-classes',
          component: () => import('@/views/admin/ClassesView.vue'),
        },
        {
          path: 'teachers',
          name: 'admin-teachers',
          component: () => import('@/views/admin/TeachersView.vue'),
        },
        {
          path: 'staff',
          name: 'admin-staff',
          component: () => import('@/views/admin/StaffView.vue'),
        },
        {
          path: 'surveys',
          name: 'admin-surveys',
          component: () => import('@/views/admin/SurveysView.vue'),
        },
        {
          path: 'notifications',
          name: 'admin-notifications',
          component: () => import('@/views/admin/NotificationsView.vue'),
        },
        {
          path: 'ads',
          name: 'admin-ads',
          component: () => import('@/views/admin/AdsView.vue'),
        },
      ],
    },
    {
      path: '/teacher',
      component: TeacherLayout,
      children: [
        {
          path: '',
          redirect: { name: 'teacher-lessons' },
        },
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
    {
      path: '/seller',
      component: SellerLayout,
      children: [
        {
          path: '',
          redirect: { name: 'seller-sell' },
        },
        {
          path: 'sell',
          name: 'seller-sell',
          component: () => import('@/views/seller/SellProductView.vue'),
        },
      ],
    },
  ],
})

export default router
