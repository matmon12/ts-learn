<template>
  <button class="logout-btn" @click="logOutUser">
    <component :is="MaterialSymbolsLogoutRounded" class="logout-icon" />
    <span class="logout-label">Выход</span>
  </button>
</template>

<script setup lang="ts">
import MaterialSymbolsLogoutRounded from '~icons/material-symbols/logout-rounded?width=20px&height=20px'
import { logOut } from '@/auth/services'
import router from '@/app/router'
import { useToast } from 'primevue'

const toast = useToast()

const logOutUser = async (): Promise<void> => {
  try {
    await logOut()

    toast.add({ severity: 'success', summary: 'Успешно', detail: 'Вы успешно выполнили выход', life: 5000 })
    router.push({ name: 'AuthView' })
  } catch (e: unknown) {
    if (e instanceof Error) {
      toast.add({ severity: 'error', summary: 'Ошибка', detail: e.message, life: 5000 })
    }
  }
}
</script>

<style scoped>
.logout-btn {
  display: flex;
  align-items: center;
  gap: 5px;
}
</style>
