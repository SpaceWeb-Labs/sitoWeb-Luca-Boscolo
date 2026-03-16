<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useI18n } from 'vue-i18n'
import { supabase } from '@/lib/supabase'

const { t } = useI18n()

const visible = ref(false)
const showDetails = ref(false)

const preferences = ref({
  necessary: true,   // sempre true, non modificabile
  analytics: false,
  marketing: false,
})

type ConsentData = {
  necessary: boolean
  analytics: boolean
  marketing: boolean
  date: string
  version: string
}

const CONSENT_KEY = 'cookie_consent'
const SESSION_ID_KEY = 'cookie_session_id'
const CONSENT_VERSION = '1.0'

// Session ID persisted in localStorage — stable across page loads
function getOrCreateSessionId(): string {
  let id = localStorage.getItem(SESSION_ID_KEY)
  if (!id) {
    id = crypto.randomUUID()
    localStorage.setItem(SESSION_ID_KEY, id)
  }
  return id
}

onMounted(() => {
  const saved = localStorage.getItem(CONSENT_KEY)
  if (!saved) {
    visible.value = true
    return
  }
  const data: ConsentData = JSON.parse(saved)
  if (data.version !== CONSENT_VERSION) {
    visible.value = true
  }
})

function saveConsent(data: Omit<ConsentData, 'date' | 'version'>) {
  const consent: ConsentData = {
    ...data,
    date: new Date().toISOString(),
    version: CONSENT_VERSION,
  }
  localStorage.setItem(CONSENT_KEY, JSON.stringify(consent))
  visible.value = false

  // Fire-and-forget DB save for GDPR/LPD audit trail
  const sessionId = getOrCreateSessionId()
  supabase.from('cookie_consents').upsert({
    session_id: sessionId,
    necessary: data.necessary,
    analytics: data.analytics,
    marketing: data.marketing,
    user_agent: navigator.userAgent,
    version: CONSENT_VERSION,
  }, { onConflict: 'session_id' }).catch((err: unknown) => {
    console.warn('[cookie_consents] non-fatal save error:', err)
  })

  // Emit event per attivare/disattivare analytics
  window.dispatchEvent(new CustomEvent('cookie-consent', { detail: consent }))
}

function acceptAll() {
  saveConsent({ necessary: true, analytics: true, marketing: true })
}

function rejectAll() {
  saveConsent({ necessary: true, analytics: false, marketing: false })
}

function savePreferences() {
  saveConsent(preferences.value)
}
</script>

<template>
  <Transition name="cookie-slide">
    <div
      v-if="visible"
      role="dialog"
      aria-modal="true"
      :aria-label="t('cookie.title')"
      style="
        position: fixed;
        bottom: 0;
        left: 0;
        right: 0;
        z-index: 9999;
        background: #fff;
        border-top: 1px solid #e5e7eb;
        box-shadow: 0 -4px 24px rgba(0,0,0,0.08);
        padding: 20px 24px;
        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
      "
    >
      <div style="max-width: 1200px; margin: 0 auto;">
        <!-- Main banner -->
        <div v-if="!showDetails" style="display: flex; align-items: flex-start; gap: 24px; flex-wrap: wrap;">
          <div style="flex: 1; min-width: 280px;">
            <p style="font-weight: 600; margin: 0 0 6px; font-size: 15px; color: #111;">
              {{ t('cookie.title') }}
            </p>
            <p style="margin: 0; font-size: 13px; color: #6b7280; line-height: 1.5;">
              {{ t('cookie.description') }}
              <a href="/privacy" style="color: #6366f1; text-decoration: underline;">
                {{ t('cookie.privacyPolicy') }}
              </a>
            </p>
          </div>
          <div style="display: flex; gap: 8px; align-items: center; flex-wrap: wrap; flex-shrink: 0;">
            <button
              style="padding: 8px 12px; border: 1px solid #d1d5db; background: #fff; color: #374151; border-radius: 6px; cursor: pointer; font-size: 13px;"
              @click="showDetails = true"
            >
              {{ t('cookie.preferences') }}
            </button>
            <button
              style="padding: 8px 16px; border: 1px solid #d1d5db; background: #fff; color: #374151; border-radius: 6px; cursor: pointer; font-size: 13px;"
              @click="rejectAll"
            >
              {{ t('cookie.reject') }}
            </button>
            <button
              style="padding: 8px 20px; background: #111; color: #fff; border: none; border-radius: 6px; cursor: pointer; font-size: 13px; font-weight: 600;"
              @click="acceptAll"
            >
              {{ t('cookie.accept') }}
            </button>
          </div>
        </div>

        <!-- Detailed preferences -->
        <div v-else>
          <p style="font-weight: 600; margin: 0 0 16px; font-size: 15px; color: #111;">
            {{ t('cookie.preferences') }}
          </p>

          <!-- Necessary -->
          <div style="display: flex; justify-content: space-between; align-items: center; padding: 12px 0; border-bottom: 1px solid #f3f4f6;">
            <div>
              <p style="margin: 0; font-weight: 500; font-size: 13px; color: #111;">{{ t('cookie.necessaryTitle') }}</p>
              <p style="margin: 4px 0 0; font-size: 12px; color: #6b7280;">{{ t('cookie.necessaryDesc') }}</p>
            </div>
            <span style="font-size: 12px; color: #6b7280; font-style: italic;">{{ t('cookie.alwaysActive') }}</span>
          </div>

          <!-- Analytics -->
          <div style="display: flex; justify-content: space-between; align-items: center; padding: 12px 0; border-bottom: 1px solid #f3f4f6;">
            <div>
              <p style="margin: 0; font-weight: 500; font-size: 13px; color: #111;">{{ t('cookie.analyticsTitle') }}</p>
              <p style="margin: 4px 0 0; font-size: 12px; color: #6b7280;">{{ t('cookie.analyticsDesc') }}</p>
            </div>
            <label style="position: relative; display: inline-block; width: 40px; height: 22px; cursor: pointer;">
              <input v-model="preferences.analytics" type="checkbox" style="opacity: 0; width: 0; height: 0;">
              <span :style="{
                position: 'absolute', inset: 0, borderRadius: '11px', transition: '0.2s',
                background: preferences.analytics ? '#111' : '#d1d5db',
              }">
                <span :style="{
                  position: 'absolute', top: '3px', width: '16px', height: '16px',
                  background: '#fff', borderRadius: '50%', transition: '0.2s',
                  left: preferences.analytics ? '21px' : '3px',
                }" />
              </span>
            </label>
          </div>

          <!-- Marketing -->
          <div style="display: flex; justify-content: space-between; align-items: center; padding: 12px 0;">
            <div>
              <p style="margin: 0; font-weight: 500; font-size: 13px; color: #111;">{{ t('cookie.marketingTitle') }}</p>
              <p style="margin: 4px 0 0; font-size: 12px; color: #6b7280;">{{ t('cookie.marketingDesc') }}</p>
            </div>
            <label style="position: relative; display: inline-block; width: 40px; height: 22px; cursor: pointer;">
              <input v-model="preferences.marketing" type="checkbox" style="opacity: 0; width: 0; height: 0;">
              <span :style="{
                position: 'absolute', inset: 0, borderRadius: '11px', transition: '0.2s',
                background: preferences.marketing ? '#111' : '#d1d5db',
              }">
                <span :style="{
                  position: 'absolute', top: '3px', width: '16px', height: '16px',
                  background: '#fff', borderRadius: '50%', transition: '0.2s',
                  left: preferences.marketing ? '21px' : '3px',
                }" />
              </span>
            </label>
          </div>

          <div style="display: flex; gap: 8px; margin-top: 16px; justify-content: flex-end;">
            <button
              style="padding: 8px 12px; border: 1px solid #d1d5db; background: #fff; color: #374151; border-radius: 6px; cursor: pointer; font-size: 13px;"
              @click="showDetails = false"
            >
              {{ t('common.back') }}
            </button>
            <button
              style="padding: 8px 20px; background: #111; color: #fff; border: none; border-radius: 6px; cursor: pointer; font-size: 13px; font-weight: 600;"
              @click="savePreferences"
            >
              {{ t('common.save') }}
            </button>
          </div>
        </div>
      </div>
    </div>
  </Transition>
</template>

<style scoped>
.cookie-slide-enter-active,
.cookie-slide-leave-active {
  transition: transform 0.3s ease, opacity 0.3s ease;
}
.cookie-slide-enter-from,
.cookie-slide-leave-to {
  transform: translateY(100%);
  opacity: 0;
}
</style>
