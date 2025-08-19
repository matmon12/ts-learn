<template>
  <div class="statistic">
    <h1 class="statistic-title">Статистика</h1>
    <div class="statistic-chart">
      <Chart type="doughnut" :data="chartData" :options="chartOptions" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ChartData, ChartOptions } from 'chart.js'
import { IInterview } from '@/interview/types/interfaces'
import { readToDB } from '@/interview/services'
import { collection, orderBy, query } from 'firebase/firestore'
import { db } from '@/app/firebase/firebase.config'
import { useUserStore } from '@/auth/stores/user'
import { useToast } from 'primevue'

const userStore = useUserStore()
const toast = useToast()

const chartData = ref<ChartData>()
const chartOptions = ref<ChartOptions>({})
const isLoading = ref<boolean>(false)
const interviews = ref<IInterview[]>([])

const getInterviews = async (): Promise<void> => {
  isLoading.value = true
  try {
    interviews.value = await readToDB(
      query(collection(db, `users/${userStore.userId}/interviews`), orderBy('createdAt', 'desc')),
    )
  } catch (e) {
    if (e instanceof Error) {
      toast.add({ severity: 'error', summary: 'Ошибка', detail: e.message, life: 5000 })
    }
  } finally {
    isLoading.value = false
  }
}

const setChartData = (): ChartData<'doughnut'> => {
  const data: number[] = [0, 0, 0]

  interviews.value.forEach((interview: IInterview) => {
    if (interview.result === 'Offer') {
      data[0]++
    } else if (interview.result === 'Refusal') {
      data[1]++
    } else {
      data[2]++
    }
  })

  return {
    labels: ['Оффер', 'Отказ', 'В процессе'],
    datasets: [
      {
        data,
        backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56'],
        hoverBackgroundColor: ['#FF6384', '#36A2EB', '#FFCE56'],
        borderRadius: 10,
        borderColor: '#000',
        offset: 10,
      },
    ],
  }
}

const setChartOptions = (): ChartOptions<'doughnut'> => {
  return {
    responsive: true,
    cutout: '50%',
    plugins: {
      legend: {
        labels: {
          color: '#fff',
          borderRadius: 10,
          boxHeight: 15,
        },
      },
    },
  }
}

onMounted(async () => {
  await getInterviews()
  chartData.value = setChartData()
  chartOptions.value = setChartOptions()
})
</script>

<style scoped lang="scss">
.statistic {
  &-title {
    font-size: 30px;
    margin-bottom: 20px;
    font-weight: 500;
  }
  &-chart {
    max-width: 600px;
    margin: auto;
  }
}
</style>
