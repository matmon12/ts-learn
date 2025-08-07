<template>
  <div class="header">
    <div class="container">
      <Menubar :model="items">
        <template #item="{ item, props }">
          <router-link :to="item.path" v-bind="props.action">
            <Icon v-if="item.icon" :icon="item.icon" class="menubar__link-icon" />
            <span class="menubar__link-label">{{ item.label }}</span>
          </router-link>
        </template>
      </Menubar>
    </div>
  </div>
</template>

<script setup lang="ts">
const items = ref([
  { label: 'Авторизация', icon: 'material-symbols:login-rounded', path: '/ts-learn/auth' },
  { label: 'Добавить', icon: 'majesticons:plus', path: '/ts-learn/' },
  { label: 'Список собеседований', icon: 'icon-park-outline:list', path: '/ts-learn/list' },
  { label: 'Статистика', icon: 'akar-icons:statistic-up', path: '/ts-learn/statistic' },
])
</script>

<style scoped lang="scss">
.header {
  padding: 15px 0;
}
</style>
