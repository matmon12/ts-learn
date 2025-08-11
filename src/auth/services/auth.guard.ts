import { getAuth, onAuthStateChanged } from 'firebase/auth'
import type { NavigationGuardNext, RouteLocationNormalized } from 'vue-router'

export const checkAuth = (
  to: RouteLocationNormalized,
  from: RouteLocationNormalized,
  next: NavigationGuardNext,
): void => {
  let isAuth = false // флаг для предотвращения многократных проверок статуса авторизации
  onAuthStateChanged(getAuth(), (user) => {
    if (user && to.name === 'AuthView' && !isAuth) {
      isAuth = true
      next({ name: 'HomeView' })
    } else if (!user && to.name !== 'AuthView' && !isAuth) {
      isAuth = true
      next({ name: 'AuthView' })
    } else if (!isAuth) {
      isAuth = true
      next()
    }
  })
}
