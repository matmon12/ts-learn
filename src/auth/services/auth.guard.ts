import { getAuth, onAuthStateChanged } from 'firebase/auth'
import type { NavigationGuardNext, RouteLocationNormalized } from 'vue-router'

export const checkAuth = (
  to: RouteLocationNormalized,
  from: RouteLocationNormalized,
  next: NavigationGuardNext,
): void => {
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
