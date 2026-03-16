<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import SiteLayout from '@/components/layout/SiteLayout.vue'
import { useSeo } from '@/composables/useSeo'

const { t } = useI18n()
useSeo({ title: t('nav.about') })
</script>

<template>
  <SiteLayout>
    <section style="padding: 80px 0; max-width: 800px; margin: 0 auto; padding-left: 24px; padding-right: 24px;">
      <h1 style="font-size: 42px; font-weight: 700; margin: 0 0 24px;">
        {{ t('about.title') }}
      </h1>
      <p style="font-size: 16px; color: #6b7280; line-height: 1.8;">
        <!-- Personalizza con la storia e il team dell'azienda cliente -->
        {{ t('about.placeholder') }}
      </p>
    </section>
  </SiteLayout>
</template>
