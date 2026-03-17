<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import SiteLayout from '@/components/layout/SiteLayout.vue'
import { useSeo } from '@/composables/useSeo'

const { t } = useI18n()
useSeo({ title: 'Privacy Policy', noIndex: true })

// Content tokens — replaced as static strings by setup.js
const privacyDate = '2024-01-01'
const companyName = 'Boscolo Luca'
const companyAddress = 'Provincia di Varese (VA)'
const contactEmail = import.meta.env.VITE_CONTACT_EMAIL || 'info@example.com'
</script>

<template>
  <SiteLayout>
    <article style="padding: 80px 0; max-width: 760px; margin: 0 auto; padding-left: 24px; padding-right: 24px; line-height: 1.8; color: #374151;">
      <RouterLink
        to="/"
        style="display: inline-block; margin-bottom: 32px; color: #6b7280; text-decoration: none; font-size: 14px;"
      >
        ← {{ t('errors.goHome') }}
      </RouterLink>
      <h1 style="font-size: 36px; font-weight: 700; margin: 0 0 32px;">
        Privacy Policy
      </h1>
      <p><em>Aggiornata il {{ privacyDate }}</em></p>
      <h2>1. Titolare del trattamento</h2>
      <p>{{ companyName }}, {{ companyAddress }}. Email: {{ contactEmail }}</p>
      <h2>2. Dati raccolti</h2>
      <p>Raccogliamo solo i dati che ci fornisci volontariamente tramite il form di contatto (nome, email, messaggio) e i dati di navigazione anonimi tramite cookie analitici (solo con il tuo consenso).</p>
      <h2>3. Finalità e base giuridica</h2>
      <p>I dati del form contatti sono trattati per rispondere alle tue richieste (legittimo interesse). I cookie analitici richiedono il tuo consenso.</p>
      <h2>4. Conservazione</h2>
      <p>I dati di contatto sono conservati per 2 anni. I log dei consensi cookie per 2 anni (conformità LPD/GDPR).</p>
      <h2>5. Diritti dell'interessato</h2>
      <p>Hai diritto di accesso, rettifica, cancellazione, portabilità e opposizione al trattamento. Per esercitarli scrivi a {{ contactEmail }}.</p>
      <h2>6. Normativa applicabile</h2>
      <p>Il trattamento è conforme al Regolamento UE 2016/679 (GDPR) e alla Legge federale svizzera sulla protezione dei dati (LPD, revisione 2023).</p>
    </article>
  </SiteLayout>
</template>
