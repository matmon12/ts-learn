<template>
  <ConfirmDialog />

  <div class="interview-list">
    <h1 class="interview-title">Собеседования</h1>
    <div class="interview__filters">
      <div class="results__radio">
        <RadioButton v-model="selectedFilterResult" input-id="interviewResult1" name="result" value="Refusal" />
        <label for="interviewResult1" class="results__radio-label">Отказ</label>
      </div>
      <div class="results__radio">
        <RadioButton v-model="selectedFilterResult" input-id="interviewResult2" name="result" value="Offer" />
        <label for="interviewResult2" class="results__radio-label">Оффер</label>
      </div>
      <div class="interview__filters-btns">
        <Button :disabled="!selectedFilterResult" @click="submitFilter">Применить</Button>
        <Button severity="danger" :disabled="!selectedFilterResult" @click="resetFilter">Сбросить</Button>
      </div>
    </div>
    <DataTable :value="interviews" :loading="isLoading" table-style="min-width: 50rem">
      <Column field="company" header="Компания"></Column>
      <Column header="Вакансия">
        <template #body="{ data }">
          <a :href="data.vacancyLink" target="_blank" class="vacancy-link">Ссылка на вакансию</a>
        </template>
      </Column>
      <Column field="hrName" header="Имя HR"></Column>
      <Column header="Контакты">
        <template #body="{ data }">
          <a
            v-if="data.contactTelegram"
            :href="`https://t.me/${data.contactTelegram}`"
            target="_blank"
            class="contacts__telegram"
            ><i-jam-telegram
          /></a>
          <a
            v-if="data.contactWhatsapp"
            :href="`https://wa.me/${data.contactWhatsapp}`"
            target="_blank"
            class="contacts__whatsapp"
            ><i-bi-whatsapp
          /></a>
          <a v-if="data.contactPhone" :href="`tel:${data.contactPhone}`" class="contacts__phone"
            ><i-ic-baseline-phone
          /></a>
        </template>
      </Column>
      <Column header="Пройденные этапы">
        <template #body="{ data }">
          <div v-if="data.stages" class="interview-stages">
            <Badge v-for="(stage, i) in data.stages" :key="i" v-tooltip.top="stage.name" :value="i + 1" rounded />
          </div>
          <span v-else>—</span>
        </template>
      </Column>
      <Column header="Зарплата">
        <template #body="{ data }">
          <span v-if="data.salaryFrom">{{ data.salaryFrom }} - {{ data.salaryTo }}</span>
          <span v-else>—</span>
        </template>
      </Column>
      <Column header="Результат">
        <template #body="{ data }">
          <template v-if="data.result">
            <Badge
              :severity="data.result === 'Offer' ? 'success' : 'danger'"
              :value="data.result === 'Offer' ? 'Оффер' : 'Отказ'"
            ></Badge>
          </template>
          <span v-else>—</span>
        </template>
      </Column>
      <Column header="Действия">
        <template #body="{ data }">
          <div class="actions__btns">
            <router-link :to="{ name: 'InterviewView', params: { interviewId: data.id } }">
              <Button severity="info" class="action-btn"><i-majesticons-edit-pen-2-line /></Button>
            </router-link>
            <Button severity="danger" class="action-btn" @click="confirmRemoveInterview(data.id)"
              ><i-material-symbols-delete-outline-rounded
            /></Button>
          </div>
        </template>
      </Column>
      <template #empty>
        <div class="empty">
          <img src="@/interview/assets/empty.svg" alt="empty" class="empty-img" />
          <p class="empty-text">Собеседования не найдены</p>
        </div>
      </template>
    </DataTable>
  </div>
</template>

<script setup lang="ts">
import { IInterview } from '@/interview/types/interfaces'
import { query, orderBy, collection, Query, where } from 'firebase/firestore'
import { db } from '@/app/firebase/firebase.config'
import { useUserStore } from '@/auth/stores/user'
import { readToDB, deleteFromDB } from '@/interview/services'
import { useToast } from 'primevue'
import DataTable from 'primevue/datatable'
import Column from 'primevue/column'
import { useConfirm } from 'primevue/useconfirm'
import ConfirmDialog from 'primevue/confirmdialog'

const userStore = useUserStore()
const toast = useToast()
const confirm = useConfirm()

const interviews = ref<IInterview[]>([])
const isLoading = ref<boolean>(true)
const selectedFilterResult = ref<'' | 'Offer' | 'Refusal'>('')
const activeFilterResult = ref<'' | 'Offer' | 'Refusal'>('')

const interviewsQuery = computed<Query | null>(() => {
  if (!userStore.userId) return null

  if (activeFilterResult.value) {
    return query(
      collection(db, `users/${userStore.userId}/interviews`),
      where('result', '==', activeFilterResult.value),
      orderBy('createdAt', 'desc'),
    )
  } else {
    return query(collection(db, `users/${userStore.userId}/interviews`), orderBy('createdAt', 'desc'))
  }
})

const getInterviews = async (query: Query): Promise<void> => {
  isLoading.value = true
  try {
    interviews.value = await readToDB(query)

    // return [
    //   {
    //     id: '1',
    //     company: 'Яндекс',
    //     vacancyLink: 'https://yandex.ru/jobs/vacancies/dev_ops',
    //     hrName: 'Катя',
    //     contactTelegram: '@katya_yandex',
    //     contactWhatsapp: '+79991234567',
    //     contactPhone: '+7 (999) 123-45-67',
    //     createdAt: 1643723400,
    //   },
    //   {
    //     id: '2',
    //     company: 'Google',
    //     vacancyLink: 'https://careers.google.com/jobs/results/?q=devops',
    //     hrName: 'Дима',
    //     contactTelegram: '@dima_google',
    //     contactWhatsapp: '+79998765432',
    //     contactPhone: '+7 (999) 876-54-32',
    //     createdAt: 1643723500,
    //   },
    //   {
    //     id: '3',
    //     company: 'Microsoft',
    //     vacancyLink: 'https://careers.microsoft.com/us/en/job/123456/DevOps-Engineer',
    //     hrName: 'Марина',
    //     contactTelegram: '@marina_microsoft',
    //     contactWhatsapp: '+79991239876',
    //     contactPhone: '+7 (999) 123-98-76',
    //     createdAt: 1643723600,
    //   },
    // ]
  } catch (e) {
    if (e instanceof Error) {
      toast.add({ severity: 'error', summary: 'Ошибка', detail: e.message, life: 5000 })
    }
  } finally {
    isLoading.value = false
  }
}

watch(
  () => interviewsQuery.value,
  async (newQuery) => {
    if (!newQuery) return
    await getInterviews(newQuery)
  },
  { immediate: true },
)

const confirmRemoveInterview = (id: string): void => {
  confirm.require({
    message: 'Ты уверен что хочешь удалить собеседование?',
    header: 'Подтвердите действие',
    rejectProps: {
      label: 'Отмена',
      severity: 'secondary',
      outlined: true,
    },
    acceptProps: {
      label: 'Удалить',
    },
    accept: () => removeInterview(id),
  })
}

const removeInterview = async (id: string): Promise<void> => {
  try {
    isLoading.value = true

    await deleteFromDB(userStore.userId, id)
    localyRemoveInterview(id)

    toast.add({ severity: 'success', summary: 'Успешно', detail: 'Собеседование удалено', life: 5000 })
  } catch (e) {
    if (e instanceof Error) {
      toast.add({ severity: 'error', summary: 'Ошибка', detail: e.message, life: 5000 })
    }
  } finally {
    isLoading.value = false
  }
}

const localyRemoveInterview = (id: string): void => {
  const indexRemovedInterview = interviews.value.findIndex((item) => item.id === id)
  interviews.value.splice(indexRemovedInterview, 1)
}

const submitFilter = (): void => {
  if (selectedFilterResult.value) {
    activeFilterResult.value = selectedFilterResult.value
  }
}

const resetFilter = (): void => {
  activeFilterResult.value = ''
  selectedFilterResult.value = ''
}
</script>

<style scoped lang="scss">
.spinner-mask {
  width: 100%;
  height: 100%;
  display: flex;
}
.spinner {
  margin: auto;
}

.interview-title {
  margin-bottom: 10px;
  font-size: 24px;
}

.interview__filters {
  display: flex;
  align-items: center;
  gap: 20px;
  margin-bottom: 10px;

  &-btns {
    margin-left: 10px;
    display: flex;
    gap: 10px;
  }
}

.results__radio {
  display: flex;
  align-items: center;
  gap: 5px;
}

.interview-list {
  border-radius: 10px;
  overflow: hidden;
}

.vacancy-link {
  &:hover {
    text-decoration: underline;
  }
}

.contacts {
  &__telegram {
    color: #41c0ff;
  }
  &__whatsapp {
    color: #1da01d;
  }
  &__phone {
    color: #9c66ff;
  }
  &__telegram,
  &__whatsapp,
  &__phone {
    font-size: 20px;
    transition: filter 0.3s;
    & + & {
      margin-left: 10px;
    }
    &:hover {
      filter: brightness(1.5);
    }
  }
}

.actions {
  &__btns {
    display: flex;
    gap: 10px;
  }
}
:deep(.action-btn) {
  padding: 7px;
  font-size: 16px;
}

.empty {
  display: flex;
  flex-direction: column;
  align-items: center;
  &-img {
    width: 300px;
  }
  &-text {
    margin: 20px 0 10px;
    font-size: 24px;
  }
}

.interview-stages {
  display: flex;
  gap: 4px;
}
</style>
