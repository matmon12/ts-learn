import { getAuth, onAuthStateChanged } from 'firebase/auth'
import { useUserStore } from '@/auth/stores/user'

export const useAuthState = () => {
  const userStore = useUserStore()
  const isLoading = ref<boolean>(true)

  const initAuthTracking = () => {
    onAuthStateChanged(getAuth(), (user) => {
      userStore.userId = user?.uid || ''
      isLoading.value = false
    })
  }

  onMounted(initAuthTracking)

  return { isLoading, initAuthTracking }
}
