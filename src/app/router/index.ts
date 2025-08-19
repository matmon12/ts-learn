import { createRouter, createWebHistory, type RouteRecordRaw, type RouteComponent } from 'vue-router'
import { checkAuth } from '@/auth/services/index'

const MainLayout = (): RouteComponent => import('@/app/layouts/MainLayout.vue')
const NewInterviewView = (): RouteComponent => import('@/interview/views/NewInterviewView.vue')
const AuthView = (): RouteComponent => import('@/auth/views/AuthView.vue')
const ListView = (): RouteComponent => import('@/interview/views/ListView.vue')
const StatisticView = (): RouteComponent => import('@/interview/views/StatisticView.vue')
const InterviewView = (): RouteComponent => import('@/interview/views/InterviewView.vue')
const NotFoundView = (): RouteComponent => import('@/app/views/NotFoundView.vue')

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    name: 'MainLayout',
    component: MainLayout,
    children: [
      { path: '', name: 'NewInterviewView', component: NewInterviewView, beforeEnter: checkAuth },
      { path: 'auth', name: 'AuthView', component: AuthView, beforeEnter: checkAuth },
      { path: 'list', name: 'ListView', component: ListView, beforeEnter: checkAuth },
      {
        path: 'statistic',
        name: 'StatisticView',
        component: StatisticView,
        beforeEnter: checkAuth,
      },
      {
        path: 'interview/:interviewId',
        name: 'InterviewView',
        component: InterviewView,
        beforeEnter: checkAuth,
      },
      {
        path: '/:pathMatch(.*)*',
        name: 'NotFound',
        component: NotFoundView,
      },
    ],
  },
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
})

export default router
