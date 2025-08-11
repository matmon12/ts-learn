import { createApp } from 'vue'
import { createPinia } from 'pinia'
import PrimeVue from 'primevue/config'
import Aura from '@primeuix/themes/aura'
import { VueFire } from 'vuefire'

import App from '@/app/App.vue'
import router from '@/app/router/index'
import '@/index.scss'
import { firebaseApp } from '@/app/firebase/firebase.config'
import ToastService from 'primevue/toastservice'

const app = createApp(App)

app.use(createPinia())
app.use(router)
app.use(ToastService)
app.use(VueFire, {
  firebaseApp,
})
app.use(PrimeVue, {
  theme: {
    preset: Aura,
  },
})

app.mount('#app')
