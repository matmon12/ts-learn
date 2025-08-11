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
import { useAuthState } from '@/auth/composables/useAuthState'

const { isLoading } = useAuthState()
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
