import { defineStore, acceptHMRUpdate } from 'pinia'

export const useUserStore = defineStore('user', () => {
  const userId = ref<string>('')

  return {
    userId,
  }
})

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useUserStore, import.meta.hot))
}
