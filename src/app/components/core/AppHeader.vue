<template>
  <div class="header">
    <div class="container">
      <Menubar :model="items">
        <template #item="{ item, props }">
          <template v-if="item.show">
            <router-link :to="{ name: item.path }" v-bind="props.action" class="menubar-link">
              <component :is="item.component" class="menubar-icon" />
              <span class="menubar-label">{{ item.label }}</span>
            </router-link>
          </template>
        </template>
        <template #end>
          <button v-if="userStore.userId" class="menubar-exit" @click="logOutUser">
            <component :is="MaterialSymbolsLogoutRounded" class="menubar-icon" />
            <span class="menubar-label">Выход</span>
          </button>
        </template>
      </Menubar>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { ComputedRef } from 'vue'
import { useUserStore } from '@/app/stores/user'
import { logOut } from '@/app/server/auth'
import router from '@/app/router'
import { useToast } from 'primevue'
import MaterialSymbolsLoginRounded from '~icons/material-symbols/login-rounded?width=20px&height=20px'
import MaterialSymbolsLogoutRounded from '~icons/material-symbols/logout-rounded?width=20px&height=20px'
import MajesticonsPlus from '~icons/majesticons/plus?width=20px&height=20px'
import IconParkOutlineList from '~icons/icon-park-outline/list?width=20px&height=20px'
import AkarIconsStatisticUp from '~icons/akar-icons/statistic-up?width=20px&height=20px'

const userStore = useUserStore()
const toast = useToast()

interface IMenuItem {
  label?: string
  component: Component
  path: string
  show: ComputedRef<boolean>
}

const items = ref<IMenuItem[]>([
  {
    label: 'Авторизация',
    component: MaterialSymbolsLoginRounded,
    path: 'AuthView',
    show: computed<boolean>(() => !userStore.userId),
  },
  {
    label: 'Добавить',
    component: MajesticonsPlus,
    path: 'HomeView',
    show: computed<boolean>(() => !!userStore.userId),
  },
  {
    label: 'Список собеседований',
    component: IconParkOutlineList,
    path: 'ListView',
    show: computed<boolean>(() => !!userStore.userId),
  },
  {
    label: 'Статистика',
    component: AkarIconsStatisticUp,
    path: 'StatisticView',
    show: computed<boolean>(() => !!userStore.userId),
  },
])

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

<style scoped lang="scss">
.header {
  padding: 15px 0;
}

.menubar-exit {
  display: flex;
  align-items: center;
  gap: 5px;
}
</style>
