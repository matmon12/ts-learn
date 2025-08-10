<template>
  <div v-if="isLoading" class="app-spinner-mask">
    <ProgressSpinner class="app-spinner" />
  </div>
  <div v-else class="app">
    <RouterView />
  </div>
  <Toast />
</template>

<script setup lang="ts">
import Toast from 'primevue/toast'
import { getAuth, onAuthStateChanged } from 'firebase/auth'
import { useUserStore } from '@/app/stores/user'

const userStore = useUserStore()
const isLoading = ref<boolean>(true)

onMounted(() => {
  onAuthStateChanged(getAuth(), (user) => {
    if (user) {
      userStore.userId = user.uid
    } else {
      userStore.userId = ''
    }
    isLoading.value = false
  })
})
</script>

<style scoped lang="scss">
.app-spinner-mask {
  width: 100vw;
  height: 100vh;
  display: flex;
}
.app-spinner {
  margin: auto;
}
</style>
