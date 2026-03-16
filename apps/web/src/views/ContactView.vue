<script setup lang="ts">
import { ref } from 'vue'
import { useI18n } from 'vue-i18n'
import SiteLayout from '@/components/layout/SiteLayout.vue'
import { useSeo } from '@/composables/useSeo'
import { supabase } from '@/lib/supabase'

const { t } = useI18n()
useSeo({ title: t('nav.contact') })

// Config tokens — replaced by setup.js, available at runtime via VITE_* env vars
const CONTACT_EMAIL = import.meta.env.VITE_CONTACT_EMAIL || '{{CONTACT_EMAIL}}'
const COMPANY_ADDRESS = '{{COMPANY_ADDRESS}}'

const form = ref({ name: '', email: '', subject: '', message: '' })
const state = ref<'idle' | 'sending' | 'success' | 'error'>('idle')
const errorKey = ref('')

async function submit() {
  state.value = 'sending'
  errorKey.value = ''

  try {
    // Save to DB
    // Note: ip_hash is left null here — the client cannot safely hash the real IP.
    // To populate it, move form submission to a Supabase Edge Function that reads
    // the IP from req.headers.get('x-forwarded-for') and hashes it with SHA-256.
    const { error: dbError } = await supabase
      .from('contact_submissions')
      .insert({
        name: form.value.name,
        email: form.value.email,
        subject: form.value.subject,
        message: form.value.message,
      })

    if (dbError)
      throw dbError

    // DB save succeeded — capture form data before reset, then mark success
    const sentForm = { ...form.value }
    state.value = 'success'
    form.value = { name: '', email: '', subject: '', message: '' }

    // Fire-and-forget email notification — failure does NOT affect form submission
    supabase.functions.invoke('send-email', {
      body: {
        to: CONTACT_EMAIL,
        subject: `Nuovo contatto: ${sentForm.subject || sentForm.name}`,
        html: `
          <h2>Nuovo messaggio da ${sentForm.name}</h2>
          <p><strong>Email:</strong> ${sentForm.email}</p>
          <p><strong>Oggetto:</strong> ${sentForm.subject || '—'}</p>
          <hr>
          <p>${sentForm.message.replace(/\n/g, '<br>')}</p>
        `,
        replyTo: sentForm.email,
      },
    }).catch((emailErr: unknown) => {
      // Email errors are non-fatal — log for debugging only
      console.warn('[send-email] non-fatal error:', emailErr)
    })
  }
  catch {
    state.value = 'error'
    errorKey.value = 'contact.submitError'
  }
}
</script>

<template>
  <SiteLayout>
    <section class="contact-page">
      <div class="container">
        <div class="page-header">
          <h1>{{ t('nav.contact') }}</h1>
          <p>{{ t('contact.subtitle') }}</p>
        </div>

        <div class="contact-grid">
          <!-- Form -->
          <div class="contact-form-wrap">
            <div v-if="state === 'success'" class="success-message">
              <div class="success-icon">
                ✓
              </div>
              <h3>{{ t('contact.successTitle') }}</h3>
              <p>{{ t('contact.successText') }}</p>
              <button class="btn-secondary" @click="state = 'idle'">
                {{ t('contact.sendAnother') }}
              </button>
            </div>

            <div v-else>
              <div class="form-row">
                <div class="form-group">
                  <label>{{ t('contact.name') }} *</label>
                  <input
                    v-model="form.name"
                    type="text"
                    :placeholder="t('contact.namePlaceholder')"
                    required
                  >
                </div>
                <div class="form-group">
                  <label>{{ t('contact.email') }} *</label>
                  <input
                    v-model="form.email"
                    type="email"
                    :placeholder="t('contact.emailPlaceholder')"
                    required
                  >
                </div>
              </div>

              <div class="form-group">
                <label>{{ t('contact.subject') }}</label>
                <input
                  v-model="form.subject"
                  type="text"
                  :placeholder="t('contact.subjectPlaceholder')"
                >
              </div>

              <div class="form-group">
                <label>{{ t('contact.message') }} *</label>
                <textarea
                  v-model="form.message"
                  rows="6"
                  :placeholder="t('contact.messagePlaceholder')"
                  required
                />
              </div>

              <p v-if="state === 'error'" class="error-msg">
                {{ t(errorKey) }}
              </p>

              <button
                class="btn-primary"
                :disabled="state === 'sending' || !form.name || !form.email || !form.message"
                @click="submit"
              >
                {{ state === 'sending' ? t('common.loading') : t('contact.send') }}
              </button>

              <p class="privacy-note">
                {{ t('contact.privacyNote') }}
                <RouterLink to="/privacy">
                  {{ t('cookie.privacyPolicy') }}
                </RouterLink>
              </p>
            </div>
          </div>

          <!-- Info -->
          <div class="contact-info">
            <h3>{{ t('contact.infoTitle') }}</h3>
            <div class="info-item">
              <span>📧</span>
              <a :href="`mailto:${CONTACT_EMAIL}`">{{ CONTACT_EMAIL }}</a>
            </div>
            <div class="info-item">
              <span>📍</span>
              <span>{{ COMPANY_ADDRESS }}</span>
            </div>
            <div class="info-item">
              <span>🕐</span>
              <span>{{ t('contact.hours') }}</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  </SiteLayout>
</template>

<style scoped>
.contact-page { padding: 80px 0; }
.container { max-width: 1200px; margin: 0 auto; padding: 0 24px; }
.page-header { text-align: center; margin-bottom: 64px; }
.page-header h1 { font-size: 42px; font-weight: 700; margin: 0 0 12px; }
.page-header p { color: #6b7280; font-size: 16px; }

.contact-grid {
  display: grid;
  grid-template-columns: 2fr 1fr;
  gap: 64px;
  align-items: start;
}

.form-row { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; }
.form-group { margin-bottom: 20px; }
.form-group label { display: block; font-size: 14px; font-weight: 500; margin-bottom: 6px; color: #374151; }
.form-group input,
.form-group textarea {
  width: 100%;
  padding: 10px 14px;
  border: 1px solid #d1d5db;
  border-radius: 8px;
  font-size: 14px;
  outline: none;
  transition: border-color 0.15s;
  box-sizing: border-box;
  font-family: inherit;
}
.form-group input:focus,
.form-group textarea:focus { border-color: #111; }

.btn-primary {
  width: 100%;
  padding: 12px;
  background: #111;
  color: #fff;
  border: none;
  border-radius: 8px;
  font-size: 15px;
  font-weight: 600;
  cursor: pointer;
  transition: opacity 0.15s;
}
.btn-primary:disabled { opacity: 0.5; cursor: not-allowed; }
.btn-secondary {
  padding: 10px 20px;
  background: #f3f4f6;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-size: 14px;
  font-weight: 500;
}
.error-msg { color: #ef4444; font-size: 14px; margin-bottom: 12px; }
.privacy-note { font-size: 12px; color: #9ca3af; margin-top: 12px; }
.privacy-note a { color: #6b7280; }

.success-message { text-align: center; padding: 48px 0; }
.success-icon { font-size: 40px; width: 72px; height: 72px; background: #f0fdf4; border-radius: 50%; display: flex; align-items: center; justify-content: center; margin: 0 auto 20px; color: #22c55e; }
.success-message h3 { margin: 0 0 8px; font-size: 22px; }
.success-message p { color: #6b7280; margin: 0 0 24px; }

.contact-info h3 { margin: 0 0 24px; font-size: 18px; }
.info-item { display: flex; gap: 12px; align-items: flex-start; margin-bottom: 16px; font-size: 14px; color: #374151; }
.info-item a { color: #111; }

@media (max-width: 768px) {
  .contact-grid { grid-template-columns: 1fr; }
  .form-row { grid-template-columns: 1fr; }
}
</style>
