import {
  createRouter,
  createWebHistory,
  type RouteRecordRaw,
  type RouteComponent,
  type RouteLocationNormalized,
  type NavigationGuardNext,
} from 'vue-router'
import { getAuth, onAuthStateChanged } from 'firebase/auth'

const MainLayout = (): RouteComponent => import('@/app/layouts/MainLayout.vue')
const ViewHome = (): RouteComponent => import('@/app/views/ViewHome.vue')
const ViewAuth = (): RouteComponent => import('@/auth/views/ViewAuth.vue')
const ViewList = (): RouteComponent => import('@/app/views/ViewList.vue')
const ViewStatistic = (): RouteComponent => import('@/app/views/ViewStatistic.vue')

const checkAuth = (to: RouteLocationNormalized, from: RouteLocationNormalized, next: NavigationGuardNext) => {
  let isAuth = false // флаг для предотвращения многократных проверок статуса авторизации
  onAuthStateChanged(getAuth(), (user) => {
    if (user && !isAuth) {
      isAuth = true
      next()
    } else if (!user && !isAuth) {
      isAuth = true
      next({ name: 'AuthView' })
    }
  })
}

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    name: 'MainLayout',
    component: MainLayout,
    children: [
      { path: '', name: 'HomeView', component: ViewHome, beforeEnter: checkAuth },
      { path: 'auth', name: 'AuthView', component: ViewAuth },
      { path: 'list', name: 'ListView', component: ViewList, beforeEnter: checkAuth },
      {
        path: 'statistic',
        name: 'StatisticView',
        component: ViewStatistic,
        beforeEnter: checkAuth,
      },
    ],
  },
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
})

export default router
