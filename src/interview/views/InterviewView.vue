<template>
  <div v-if="isLoading" class="spinner-mask">
    <ProgressSpinner class="spinner" />
  </div>
  <div v-else-if="interview?.id && !isLoading" class="interview">
    <Card :pt="getClasses('interview').card">
      <template #title>Собеседование в компанию {{ interview.company }}</template>
      <template #content>
        <div class="interview__field">
          <label for="company" class="interview-label">Компания</label>
          <InputText id="company" v-model="interview.company" />
        </div>
        <div class="interview__field">
          <label for="vacancyLink" class="interview-label">Описание вакансии (ссылка)</label>
          <InputText id="vacancyLink" v-model="interview.vacancyLink" />
        </div>
        <div class="interview__field">
          <label for="hrName" class="interview-label">Контакт (имя)</label>
          <InputText id="hrName" v-model="interview.hrName" />
        </div>
        <div class="interview__field">
          <label for="contactTelegram" class="interview-label">Telegram username HR</label>
          <InputText id="contactTelegram" v-model="interview.contactTelegram" />
        </div>
        <div class="interview__field">
          <label for="contactWhatsapp" class="interview-label">Whatsapp HR</label>
          <InputText id="contactWhatsapp" v-model="interview.contactWhatsapp" />
        </div>
        <div class="interview__field">
          <label for="contactPhone" class="interview-label">Телефон HR</label>
          <InputText id="contactPhone" v-model="interview.contactPhone" />
        </div>
        <div class="interview__field">
          <label for="salaryFrom" class="interview-label">Зарплатная вилка</label>
          <div class="interview__salary">
            <InputNumber v-model="interview.salaryFrom" input-id="salaryFrom" placeholder="от" />
            <InputNumber v-model="interview.salaryTo" input-id="salaryTo" placeholder="до" />
          </div>
        </div>
        <Button class="interview-btn" severity="info" @click="addStage">
          <i-majesticons-plus-line />
          <span>Добавить этап</span>
        </Button>
        <template v-if="interview.stages">
          <div v-for="(stage, index) in interview.stages" :key="index" class="interview__stage">
            <div class="interview__field">
              <label :for="`stage-name-${index}`" class="interview-label">Название этапа</label>
              <InputText :id="`stage-name-${index}`" v-model="stage.name" />
            </div>
            <div class="interview__field">
              <label :for="`stage-date-${index}`" class="interview-label">Дата прохождения этапа</label>
              <DatePicker :id="`stage-date-${index}`" v-model="stage.date" date-format="dd.mm.yy" />
            </div>
            <div class="interview__field">
              <label :for="`stage-description-${index}`" class="interview-label">Комментарий</label>
              <Textarea :id="`stage-description-${index}`" v-model="stage.description" rows="5" />
            </div>
            <Button severity="danger" @click="removeStage(index)">Удалить этап</Button>
          </div>
        </template>
        <div class="results">
          <div class="results__radio">
            <RadioButton v-model="interview.result" input-id="interviewResult1" name="result" value="Refusal" />
            <label for="interviewResult1" class="results__radio-label">Отказ</label>
          </div>
          <div class="results__radio">
            <RadioButton v-model="interview.result" input-id="interviewResult2" name="result" value="Offer" />
            <label for="interviewResult2" class="results__radio-label">Оффер</label>
          </div>
        </div>
        <Button severity="info" class="interview-btn" @click="saveInterview">Сохранить</Button>
      </template>
    </Card>
  </div>
</template>

<script setup lang="ts">
import DatePicker from 'primevue/datepicker'
import type { IInterview } from '@/interview/types/interfaces'
import { getDocFromDB, updateToDB } from '@/interview/services'
import { useUserStore } from '@/auth/stores/user'
import { useRoute } from 'vue-router'
import { useToast } from 'primevue'
import { NotFoundError } from '@/app/utils/errors'
import router from '@/app/router'

const userStore = useUserStore()
const route = useRoute()
const toast = useToast()

const interview = ref<IInterview>()
const isLoading = ref<boolean>(false)

const getInterview = async (): Promise<void> => {
  isLoading.value = true
  try {
    interview.value = await getDocFromDB(userStore.userId, route.params.interviewId as string)
  } catch (e) {
    if (e instanceof NotFoundError) {
      router.push({
        name: 'NotFound',
        params: {
          pathMatch: route.path.substring(1).split('/'),
        },
        query: route.query,
        hash: route.hash,
      })
    } else if (e instanceof Error) {
      toast.add({ severity: 'error', summary: 'Ошибка', detail: e.message, life: 5000 })
    }
  } finally {
    isLoading.value = false
  }
}

const addStage = (): void => {
  if (interview.value) {
    if (!interview.value.stages) {
      interview.value.stages = []
    }
    interview.value.stages.push({ name: '', date: null, description: '' })
  }
}

const removeStage = (index: number): void => {
  if (interview.value) {
    if (interview.value.stages) {
      interview.value.stages.splice(index, 1)
    }
  }
}

const saveInterview = async (): Promise<void> => {
  if (!interview.value) return
  isLoading.value = true
  try {
    await updateToDB(userStore.userId, route.params.interviewId as string, interview.value)
    toast.add({ severity: 'success', summary: 'Успешно', detail: 'Изменения сохранены', life: 5000 })
  } catch (e) {
    if (e instanceof Error) {
      toast.add({ severity: 'error', summary: 'Ошибка', detail: e.message, life: 5000 })
    }
  } finally {
    isLoading.value = false
  }
}

onMounted(() => getInterview())
</script>

<style scoped lang="scss">
:deep() {
  .interview {
    &-card {
      max-width: 500px;
      margin: auto;
      &-title {
        font-size: 24px;
        margin-bottom: 10px;
      }
      &-content {
        display: flex;
        flex-direction: column;
        gap: 10px;
      }
    }
  }
}
.interview {
  padding-bottom: 10px;
  &__field {
    display: flex;
    flex-direction: column;
  }

  &__salary {
    display: flex;
    gap: 10px;
  }

  &__stage {
    border: 1px solid #404040;
    border-radius: 10px;
    padding: 10px;
    display: flex;
    margin-top: 10px;
    flex-direction: column;
    gap: 10px;
  }
}
.interview-label {
  margin-bottom: 5px;
}
.interview-btn {
  margin-top: 10px;
}
.results {
  display: flex;
  gap: 20px;
  margin-top: 10px;

  &__radio {
    display: flex;
    gap: 5px;
    align-items: center;
  }

  &__radio-label {
  }
}

.spinner {
  margin: auto;
  &-mask {
    width: 100%;
    height: 100%;
    display: flex;
  }
}
</style>
