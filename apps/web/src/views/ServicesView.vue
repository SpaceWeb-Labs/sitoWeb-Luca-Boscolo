<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import SiteLayout from '@/components/layout/SiteLayout.vue'
import { useSeo } from '@/composables/useSeo'

const { t } = useI18n()
useSeo({ title: t('nav.services') })
</script>

<template>
  <SiteLayout>
    <section style="padding: 80px 0; max-width: 1200px; margin: 0 auto; padding-left: 24px; padding-right: 24px;">
      <h1 style="font-size: 42px; font-weight: 700; margin: 0 0 48px; text-align: center;">{{ t('services.title') }}</h1>
      <p style="color: #9ca3af; text-align: center;">{{ t('services.placeholder') }}</p>
    </section>
  </SiteLayout>
</template>
