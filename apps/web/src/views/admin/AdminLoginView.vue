<script setup lang="ts">
import { ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/useAuthStore'
import { useSeo } from '@/composables/useSeo'

const { t } = useI18n()
useSeo({ title: 'Admin Login', noIndex: true })

const auth = useAuthStore()
const router = useRouter()
const email = ref('')
const password = ref('')
const errorKey = ref('')
const loading = ref(false)

async function login() {
  loading.value = true
  errorKey.value = ''
  try {
    await auth.signIn(email.value, password.value)
    router.push('/admin/posts')
  }
  catch {
    errorKey.value = 'auth.loginError'
  }
  finally {
    loading.value = false
  }
}
</script>

<template>
  <div style="min-height: 100vh; display: flex; align-items: center; justify-content: center; background: #f9fafb;">
    <div style="background: #fff; padding: 40px; border-radius: 16px; border: 1px solid #e5e7eb; width: 100%; max-width: 380px;">
      <h1 style="font-size: 22px; font-weight: 700; margin: 0 0 28px; text-align: center;">Admin</h1>
      <div style="margin-bottom: 16px;">
        <label style="display: block; font-size: 13px; font-weight: 500; margin-bottom: 6px;">{{ t('auth.email') }}</label>
        <input
          v-model="email"
          type="email"
          style="width: 100%; padding: 10px 14px; border: 1px solid #d1d5db; border-radius: 8px; font-size: 14px; box-sizing: border-box;"
          @keyup.enter="login"
        >
      </div>
      <div style="margin-bottom: 24px;">
        <label style="display: block; font-size: 13px; font-weight: 500; margin-bottom: 6px;">{{ t('auth.password') }}</label>
        <input
          v-model="password"
          type="password"
          style="width: 100%; padding: 10px 14px; border: 1px solid #d1d5db; border-radius: 8px; font-size: 14px; box-sizing: border-box;"
          @keyup.enter="login"
        >
      </div>
      <p v-if="errorKey" style="color: #ef4444; font-size: 13px; margin: -12px 0 16px;">{{ t(errorKey) }}</p>
      <button
        :disabled="loading || !email || !password"
        style="width: 100%; padding: 12px; background: #111; color: #fff; border: none; border-radius: 8px; font-size: 15px; font-weight: 600; cursor: pointer;"
        @click="login"
      >
        {{ loading ? t('common.loading') : t('auth.login') }}
      </button>
      <p style="text-align: center; margin-top: 20px;">
        <RouterLink to="/" style="font-size: 13px; color: #6b7280;">{{ t('auth.backToSite') }}</RouterLink>
      </p>
    </div>
  </div>
</template>
