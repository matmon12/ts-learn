<template>
  <div class="auth">
    <div class="auth__content">
      <h1 class="auth-title">Приветствую!</h1>
      <div class="auth__redirect">
        <span class="auth__redirect-text">{{ subtitleText }}</span>
        <a class="auth__redirect-link" @click="toggleAuth">{{ linkAccountText }}</a>
      </div>

      <form @submit.prevent="submitForm" class="auth__form">
        <label class="auth__form-label">
          <InputGroup>
            <InputGroupAddon><i-material-symbols-alternate-email-rounded /></InputGroupAddon>
            <InputText v-model.trim="email" type="email" placeholder="Введите почту" autofocus />
            <Button v-if="email" severity="secondary" @click="email = ''"><i-material-symbols-close-rounded /></Button>
          </InputGroup>
        </label>
        <label class="auth__form-label">
          <InputGroup>
            <InputGroupAddon>
              <i-carbon-password />
            </InputGroupAddon>
            <Password
              v-model="password"
              placeholder="Введите пароль"
              toggle-mask
              :feedback="false"
              :pt="getClasses('auth').password"
            />
            <Button v-if="password" severity="secondary" @click="password = ''"
              ><i-material-symbols-close-rounded
            /></Button>
          </InputGroup>
        </label>
        <Button class="auth__form-button" variant="outlined" type="submit" :disabled="isLoading"
          ><i-svg-spinners-270-ring v-if="isLoading" /> <i-material-symbols-person v-else /><span>{{
            submitButtonText
          }}</span></Button
        >
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { signUp, signIn } from '@/auth/services'
import router from '@/app/router'
import { useToast } from 'primevue/usetoast'

const toast = useToast()

const email = ref<string>('')
const password = ref<string>('')
const isLogin = ref<boolean>(true)
const isLoading = ref<boolean>(false)

const subtitleText = computed<string>(() => (isLogin.value ? 'Аккаунта еще нет?' : 'Уже есть аккаунт?'))
const linkAccountText = computed<string>(() => (isLogin.value ? 'Создайте сейчас' : 'Войдите в него'))
const submitButtonText = computed<string>(() => (isLogin.value ? 'Войти' : 'Зарегистрироваться'))

/**
 * Переключает форму между режимами входа и регистрации
 */
const toggleAuth = (): void => {
  isLogin.value = !isLogin.value
}

const signupUser = async (): Promise<void> => {
  isLoading.value = true
  try {
    await signUp(email.value, password.value)

    toast.add({ severity: 'success', summary: 'Успешно', detail: 'Вы успешно зарегистрировались', life: 5000 })
    router.push({ name: 'NewInterviewView' })
  } catch (e: unknown) {
    if (e instanceof Error) {
      toast.add({ severity: 'error', summary: 'Ошибка', detail: e.message, life: 5000 })
    }
  } finally {
    isLoading.value = false
  }
}

const signinUser = async (): Promise<void> => {
  isLoading.value = true
  try {
    await signIn(email.value, password.value)

    toast.add({ severity: 'success', summary: 'Успешно', detail: 'Вы успешно выполнили вход', life: 5000 })
    router.push({ name: 'NewInterviewView' })
  } catch (e: unknown) {
    if (e instanceof Error) {
      toast.add({ severity: 'error', summary: 'Ошибка', detail: e.message, life: 5000 })
    }
  } finally {
    isLoading.value = false
  }
}

const submitForm = (): void => {
  if (isLogin.value) {
    signinUser()
  } else {
    signupUser()
  }
}

</script>

<style scoped lang="scss">
.auth {
  &__content {
    border: 1px solid #404040;
    border-radius: 10px;
    padding: 20px;
    max-width: 500px;
    margin: auto;
  }

  &__redirect {
    display: flex;
    justify-content: center;
    gap: 10px;
    margin-bottom: 20px;
  }

  &__redirect-text {
    color: var(--secondary-color);
  }

  &__redirect-link {
    color: var(--primary-color);
    cursor: pointer;
  }

  &__form {
    display: flex;
    flex-direction: column;
    align-items: center;
  }

  &__form-label {
    margin-bottom: 10px;
    width: 100%;
  }

  &__form-button {
    width: 100%;
  }
}
.auth-title {
  font-size: 26px;
  font-weight: 700;
  text-align: center;
  margin-bottom: 10px;
}

:deep() {
  .auth-password {
    &-unmask-icon {
      z-index: 2;
    }
    &-mask-icon {
      z-index: 2;
    }
  }
}
</style>
