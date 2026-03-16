<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import { useRouter } from 'vue-router'
import SiteLayout from '@/components/layout/SiteLayout.vue'
import { useSeo } from '@/composables/useSeo'

const { t } = useI18n()
useSeo({ title: t('errors.notFound'), noIndex: true })
const router = useRouter()
</script>

<template>
  <SiteLayout>
    <div style="min-height: 60vh; display: flex; flex-direction: column; align-items: center; justify-content: center; text-align: center; padding: 48px;">
      <div style="font-size: 80px; font-weight: 800; color: #111; letter-spacing: -4px; line-height: 1;">
        404
      </div>
      <h1 style="font-size: 24px; font-weight: 600; margin: 16px 0 8px;">
        {{ t('errors.notFound') }}
      </h1>
      <p style="color: #6b7280; margin: 0 0 32px;">
        {{ t('errors.notFoundDesc') }}
      </p>
      <button
        style="padding: 10px 24px; background: #111; color: #fff; border: none; border-radius: 8px; cursor: pointer; font-size: 14px; font-weight: 600;"
        @click="router.push('/')"
      >
        {{ t('errors.goHome') }}
      </button>
    </div>
  </SiteLayout>
</template>
