<template>
  <div class="new-interview">
    <Card :pt="getClasses('new-interview').card">
      <template #title>Новое собеседование</template>
      <template #content>
        <InputText v-model="company" placeholder="Компания" />
        <InputText v-model="vacancyLink" placeholder="Описание вакансии (ссылка)" />
        <InputText v-model="hrName" placeholder="Контакт (имя)" />
        <InputText v-model="contactTelegram" placeholder="Telegram username HR" />
        <InputText v-model="contactWhatsapp" placeholder="Whatsapp телефон HR" />
        <InputText v-model="contactPhone" placeholder="Телефон HR" />
        <Button :disabled="disableSaveButton || isLoading" class="new-interview-btn" @click="addNewInterview"
          ><i-svg-spinners-270-ring v-if="isLoading" />
          <span>Создать собеседование</span>
        </Button>
      </template>
    </Card>
  </div>
</template>

<script setup lang="ts">
import type { IInterview } from '@/interview/types/interfaces'
import { v4 as uuidv4 } from 'uuid'
import { useUserStore } from '@/auth/stores/user'
import { writeToDB } from '@/interview/services'
import { useToast } from 'primevue'
import router from '@/app/router'

const userStore = useUserStore()
const toast = useToast()

const company = ref<string>('')
const vacancyLink = ref<string>('')
const hrName = ref<string>('')
const contactTelegram = ref<string>('')
const contactWhatsapp = ref<string>('')
const contactPhone = ref<string>('')

const isLoading = ref<boolean>(false)

const disableSaveButton = computed<boolean>(() => {
  return !(company.value && vacancyLink.value && hrName.value)
})

const addNewInterview = async (): Promise<void> => {
  const payload: IInterview = {
    id: uuidv4(),
    company: company.value,
    vacancyLink: vacancyLink.value,
    hrName: hrName.value,
    contactTelegram: contactTelegram.value,
    contactWhatsapp: contactWhatsapp.value,
    contactPhone: contactPhone.value,
    createdAt: new Date().getTime(),
  }

  const userId = userStore.userId
  if (userId) {
    isLoading.value = true
    try {
      await writeToDB(userId, payload)

      toast.add({
        severity: 'success',
        summary: 'Успешно',
        detail: 'Вы успешно создали новое собеседование',
        life: 5000,
      })
      router.push({ name: 'ListView' })
    } catch (e: unknown) {
      if (e instanceof Error) {
        toast.add({ severity: 'error', summary: 'Ошибка', detail: e.message, life: 5000 })
      }
    } finally {
      isLoading.value = false
    }
  }
}
</script>

<style lang="scss" scoped>
:deep() {
  .new-interview {
    &-card {
      max-width: 600px;
      margin: auto;
      &-title {
        margin-bottom: 20px;
      }
      &-content {
        display: flex;
        flex-direction: column;
        gap: 10px;
      }
    }
    &-btn {
      margin-top: 20px;
    }
  }
}
</style>
