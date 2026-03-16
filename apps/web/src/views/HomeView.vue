<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useI18n } from 'vue-i18n'
import { useHead } from '@unhead/vue'
import { useSeo } from '@/composables/useSeo'
import { siteConfig } from '@/site.config'
import SiteLayout from '@/components/layout/SiteLayout.vue'

const { t } = useI18n()
useSeo({
  title: t('home.title'),
  description: siteConfig.description,
  image: siteConfig.ogImage,
  url: '/',
})

// JSON-LD InsuranceAgency
useHead({
  script: [
    {
      type: 'application/ld+json',
      innerHTML: JSON.stringify({
        '@context': 'https://schema.org',
        '@type': 'InsuranceAgency',
        name: siteConfig.name,
        description: siteConfig.description,
        url: siteConfig.siteUrl,
        email: siteConfig.email,
        telephone: siteConfig.phone,
        areaServed: { '@type': 'AdministrativeArea', name: 'Provincia di Varese' },
        address: { '@type': 'PostalAddress', addressRegion: 'Lombardia', addressLocality: 'Varese', addressCountry: 'IT' },
      }),
    },
  ],
})

// ─── Service cards data ────────────────────────────────
const serviceCards = [
  { key: 'auto', icon: 'car', color: '#3b82f6' },
  { key: 'casa', icon: 'home', color: '#10b981' },
  { key: 'salute', icon: 'heart', color: '#ef4444' },
  { key: 'previdenza', icon: 'piggy', color: '#f59e0b' },
  { key: 'impresa', icon: 'briefcase', color: '#8b5cf6' },
] as const

// ─── Why choose me ────────────────────────────────────
const whyKeys = ['consulenza', 'territorio', 'trasparenza', 'assistenza'] as const

// ─── Contact form ─────────────────────────────────────
const form = ref({ name: '', email: '', phone: '', subject: '', message: '' })
const formState = ref<'idle' | 'sending' | 'success' | 'error'>('idle')

async function submitForm() {
  formState.value = 'sending'
  try {
    const res = await fetch(siteConfig.formspreeEndpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
      body: JSON.stringify(form.value),
    })
    if (!res.ok) throw new Error('Failed')
    formState.value = 'success'
    form.value = { name: '', email: '', phone: '', subject: '', message: '' }
  } catch {
    formState.value = 'error'
  }
}

// ─── Scroll utilities ──────────────────────────────────
function scrollToSection(id: string) {
  document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' })
}

function scrollToContatti(preselect?: string) {
  if (preselect) form.value.subject = preselect
  scrollToSection('contatti')
}

// ─── IntersectionObserver for fade-in ─────────────────
onMounted(() => {
  const observer = new IntersectionObserver(
    (entries) => entries.forEach((e) => { if (e.isIntersecting) e.target.classList.add('visible') }),
    { threshold: 0.08, rootMargin: '0px 0px -30px 0px' },
  )
  document.querySelectorAll('.fade-in, .fade-in-stagger').forEach((el) => observer.observe(el))
})
</script>

<template>
  <SiteLayout>
    <!-- ═══════════ HERO ═══════════ -->
    <section class="hero">
      <div class="container hero-inner">
        <div class="hero-content">
          <div class="hero-badge">
            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10"/></svg>
            Consulente assicurativo in Provincia di Varese
          </div>
          <h1 class="hero-title">
            {{ t('home.heroTitle') }}<br />
            <span class="hero-accent">{{ t('home.heroTitleAccent') }}</span>
          </h1>
          <p class="hero-subtitle">{{ t('home.heroSubtitle') }}</p>
          <div class="hero-cta">
            <a href="#contatti" class="btn-primary btn-lg" @click.prevent="scrollToContatti()">
              {{ t('home.ctaPrimary') }}
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>
            </a>
            <RouterLink to="/servizi" class="btn-outline-hero">
              {{ t('home.ctaSecondary') }}
            </RouterLink>
          </div>
          <!-- Trust signals -->
          <div class="hero-trust">
            <div class="trust-item">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 6 9 17l-5-5"/></svg>
              Iscritto RUI Sez. E
            </div>
            <div class="trust-item">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 6 9 17l-5-5"/></svg>
              Consulenza gratuita
            </div>
            <div class="trust-item">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 6 9 17l-5-5"/></svg>
              Provincia di Varese
            </div>
          </div>
        </div>
        <div class="hero-visual">
          <!-- Replace with actual photo -->
          <div class="hero-image-wrapper">
            <div class="hero-image-placeholder">
              <svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1" stroke-linecap="round" stroke-linejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
              <span>Foto di Luca</span>
            </div>
            <!-- Decorative elements -->
            <div class="hero-decoration hero-dec-1" />
            <div class="hero-decoration hero-dec-2" />
          </div>
        </div>
      </div>
    </section>

    <!-- ═══════════ SERVIZI PREVIEW ═══════════ -->
    <section id="servizi" class="section">
      <div class="container">
        <div class="section-header fade-in">
          <span class="section-label">Servizi</span>
          <h2>{{ t('home.servicesTitle') }}</h2>
          <p class="section-subtitle">{{ t('home.servicesSubtitle') }}</p>
        </div>
        <div class="services-grid fade-in-stagger">
          <RouterLink
            v-for="service in serviceCards"
            :key="service.key"
            :to="`/servizi#${service.key}`"
            class="service-card"
          >
            <div class="service-card-icon" :style="{ background: service.color + '12', color: service.color }">
              <!-- Car -->
              <svg v-if="service.icon === 'car'" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M19 17h2c.6 0 1-.4 1-1v-3c0-.9-.7-1.7-1.5-1.9C18.7 10.6 16 10 16 10s-1.3-1.4-2.2-2.3c-.5-.4-1.1-.7-1.8-.7H5c-.6 0-1.1.4-1.4.9l-1.4 2.9A3.5 3.5 0 0 0 2 12v4c0 .6.4 1 1 1h2"/><circle cx="7" cy="17" r="2"/><circle cx="17" cy="17" r="2"/></svg>
              <!-- Home -->
              <svg v-if="service.icon === 'home'" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>
              <!-- Heart -->
              <svg v-if="service.icon === 'heart'" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"/></svg>
              <!-- Piggy -->
              <svg v-if="service.icon === 'piggy'" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M19 5c-1.5 0-2.8 1.4-3 2-3.5-1.5-11-.3-11 5 0 1.8 0 3 2 4.5V20h4v-2h3v2h4v-4c1-.5 1.7-1 2-2h2v-4h-2c0-1-.5-1.5-1-2"/><path d="M2 9.5a.5.5 0 1 1 1 0"/></svg>
              <!-- Briefcase -->
              <svg v-if="service.icon === 'briefcase'" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><rect width="20" height="14" x="2" y="7" rx="2" ry="2"/><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/></svg>
            </div>
            <h3>{{ t(`services.${service.key}.title`) }}</h3>
            <p>{{ t(`services.${service.key}.desc`) }}</p>
            <span class="service-card-link">
              {{ t('common.learnMore') }}
              <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>
            </span>
          </RouterLink>
        </div>
      </div>
    </section>

    <!-- ═══════════ CHI SONO ═══════════ -->
    <!-- LEGAL: verificare con agente principale prima della pubblicazione -->
    <section id="chi-sono" class="section section-soft">
      <div class="container">
        <div class="about-layout fade-in">
          <div class="about-image-col">
            <div class="about-image-card">
              <div class="about-image-placeholder">
                <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
                <span>Foto professionale</span>
              </div>
            </div>
          </div>
          <div class="about-text-col">
            <span class="section-label">Chi Sono</span>
            <h2>{{ t('about.subtitle') }}</h2>
            <p class="about-bio">{{ t('about.teaserText') }}</p>
            <div class="about-stats">
              <div v-for="(_, key) in { experience: 1, territory: 1, approach: 1, rui: 1 }" :key="key" class="stat-item">
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M20 6 9 17l-5-5"/></svg>
                <span>{{ t(`about.points.${key}`) }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- ═══════════ PERCHÉ SCEGLIERMI ═══════════ -->
    <section id="perche" class="section">
      <div class="container">
        <div class="section-header fade-in">
          <span class="section-label">I miei valori</span>
          <h2>{{ t('why.title') }}</h2>
          <p class="section-subtitle">{{ t('why.subtitle') }}</p>
        </div>
        <div class="why-grid fade-in-stagger">
          <div v-for="key in whyKeys" :key="key" class="why-card">
            <div class="why-number">{{ whyKeys.indexOf(key) + 1 }}</div>
            <h3>{{ t(`why.${key}.title`) }}</h3>
            <p>{{ t(`why.${key}.desc`) }}</p>
          </div>
        </div>
      </div>
    </section>

    <!-- ═══════════ COME FUNZIONA ═══════════ -->
    <section class="section section-soft">
      <div class="container">
        <div class="section-header fade-in">
          <span class="section-label">Il processo</span>
          <h2>{{ t('process.title') }}</h2>
          <p class="section-subtitle">{{ t('process.subtitle') }}</p>
        </div>
        <div class="process-grid fade-in-stagger">
          <div v-for="i in 4" :key="i" class="process-card">
            <div class="process-number">{{ i }}</div>
            <h3>{{ t(`process.step${i}.title`) }}</h3>
            <p>{{ t(`process.step${i}.desc`) }}</p>
          </div>
        </div>
      </div>
    </section>

    <!-- ═══════════ CTA BANNER ═══════════ -->
    <section class="cta-banner fade-in">
      <div class="container">
        <div class="cta-banner-inner">
          <div class="cta-banner-content">
            <h2>{{ t('home.ctaTitle') }}</h2>
            <p>{{ t('home.ctaText') }}</p>
          </div>
          <a href="#contatti" class="btn-primary btn-lg btn-white" @click.prevent="scrollToContatti()">
            {{ t('home.ctaButton') }}
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>
          </a>
        </div>
      </div>
    </section>

    <!-- ═══════════ CONTATTI ═══════════ -->
    <section id="contatti" class="section">
      <div class="container">
        <div class="section-header fade-in">
          <span class="section-label">Scrivimi</span>
          <h2>{{ t('contact.title') }}</h2>
          <p class="section-subtitle">{{ t('contact.subtitle') }}</p>
        </div>
        <div class="contact-layout fade-in">
          <!-- Form -->
          <div class="contact-form-card">
            <div v-if="formState === 'success'" class="success-state">
              <div class="success-icon-wrap">
                <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 6 9 17l-5-5"/></svg>
              </div>
              <h3>{{ t('contact.successTitle') }}</h3>
              <p>{{ t('contact.successText') }}</p>
              <button class="btn-outline" @click="formState = 'idle'">{{ t('contact.sendAnother') }}</button>
            </div>

            <form v-else @submit.prevent="submitForm">
              <div class="form-row">
                <div class="form-group">
                  <label for="c-name">{{ t('contact.name') }} *</label>
                  <input id="c-name" v-model="form.name" type="text" :placeholder="t('contact.namePlaceholder')" autocomplete="name" required />
                </div>
                <div class="form-group">
                  <label for="c-email">{{ t('contact.email') }} *</label>
                  <input id="c-email" v-model="form.email" type="email" :placeholder="t('contact.emailPlaceholder')" autocomplete="email" required />
                </div>
              </div>
              <div class="form-row">
                <div class="form-group">
                  <label for="c-phone">{{ t('contact.phone') }}</label>
                  <input id="c-phone" v-model="form.phone" type="tel" :placeholder="t('contact.phonePlaceholder')" autocomplete="tel" />
                </div>
                <div class="form-group">
                  <label for="c-subject">{{ t('contact.subject') }}</label>
                  <select id="c-subject" v-model="form.subject">
                    <option value="" disabled>{{ t('contact.subjectPlaceholder') }}</option>
                    <option v-for="(label, key) in { auto: t('contact.subjectOptions.auto'), casa: t('contact.subjectOptions.casa'), salute: t('contact.subjectOptions.salute'), previdenza: t('contact.subjectOptions.previdenza'), impresa: t('contact.subjectOptions.impresa'), altro: t('contact.subjectOptions.altro') }" :key="key" :value="label">{{ label }}</option>
                  </select>
                </div>
              </div>
              <div class="form-group">
                <label for="c-message">{{ t('contact.message') }} *</label>
                <textarea id="c-message" v-model="form.message" rows="5" :placeholder="t('contact.messagePlaceholder')" required />
              </div>
              <p v-if="formState === 'error'" class="error-msg">{{ t('contact.submitError') }}</p>
              <button type="submit" class="btn-primary btn-full" :disabled="formState === 'sending' || !form.name || !form.email || !form.message">
                {{ formState === 'sending' ? t('common.loading') : t('contact.send') }}
              </button>
              <p class="privacy-note">{{ t('contact.privacyNote') }} <RouterLink to="/privacy">{{ t('cookie.privacyPolicy') }}</RouterLink></p>
            </form>
          </div>

          <!-- Info cards -->
          <div class="contact-info-col">
            <div class="info-card">
              <div class="info-card-icon"><svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="20" height="16" x="2" y="4" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/></svg></div>
              <div>
                <span class="info-card-label">Email</span>
                <a :href="`mailto:${siteConfig.email}`">{{ siteConfig.email }}</a>
              </div>
            </div>
            <div class="info-card">
              <div class="info-card-icon"><svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/></svg></div>
              <div>
                <span class="info-card-label">Telefono</span>
                <a :href="`tel:${siteConfig.phone.replace(/\s/g, '')}`">{{ siteConfig.phone }}</a>
              </div>
            </div>
            <div class="info-card">
              <div class="info-card-icon"><svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0z"/><circle cx="12" cy="10" r="3"/></svg></div>
              <div>
                <span class="info-card-label">Zona</span>
                <span>{{ siteConfig.area }}</span>
              </div>
            </div>
            <div class="info-card">
              <div class="info-card-icon"><svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg></div>
              <div>
                <span class="info-card-label">Orari</span>
                <span>{{ siteConfig.hours }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  </SiteLayout>
</template>

<style scoped>
/* ─── Shared ────────────────────────────────────────────── */
.section { padding: var(--section-padding) 0; }
.section-soft { background: var(--color-bg-soft); }

.section-header { text-align: center; margin-bottom: 56px; }
.section-header h2 { font-size: clamp(28px, 4vw, 40px); margin: 0 0 12px; }
.section-subtitle { font-size: 17px; color: var(--color-text-secondary); max-width: 520px; margin: 0 auto; }
.section-label {
  display: inline-block;
  font-size: 13px;
  font-weight: 600;
  color: var(--color-primary);
  text-transform: uppercase;
  letter-spacing: 0.08em;
  margin-bottom: 8px;
}

/* ─── Buttons ───────────────────────────────────────────── */
.btn-primary {
  display: inline-flex; align-items: center; justify-content: center; gap: 8px;
  padding: 14px 28px; background: var(--color-primary); color: #fff;
  border: none; border-radius: var(--radius-full);
  font-size: 15px; font-weight: 600; font-family: var(--font-body);
  cursor: pointer; text-decoration: none;
  transition: background var(--transition-fast), transform var(--transition-fast), box-shadow var(--transition-fast);
}
.btn-primary:hover { background: var(--color-primary-dark); transform: translateY(-1px); box-shadow: 0 4px 16px rgba(37, 99, 235, 0.3); }
.btn-primary:disabled { opacity: 0.5; cursor: not-allowed; transform: none; box-shadow: none; }
.btn-lg { padding: 16px 32px; font-size: 16px; }
.btn-full { width: 100%; }
.btn-white { background: #fff; color: var(--color-primary); }
.btn-white:hover { background: #fff; box-shadow: 0 4px 16px rgba(255, 255, 255, 0.3); }

.btn-outline-hero {
  display: inline-flex; align-items: center; padding: 16px 32px;
  background: transparent; color: var(--color-text-secondary);
  border: 1px solid var(--color-border); border-radius: var(--radius-full);
  font-size: 16px; font-weight: 500; text-decoration: none;
  transition: border-color var(--transition-fast), color var(--transition-fast);
}
.btn-outline-hero:hover { border-color: var(--color-primary); color: var(--color-primary); }

.btn-outline {
  padding: 12px 24px; background: transparent; color: var(--color-primary);
  border: 1px solid var(--color-border); border-radius: var(--radius-full);
  font-size: 14px; font-weight: 500; font-family: var(--font-body); cursor: pointer;
  transition: border-color var(--transition-fast);
}
.btn-outline:hover { border-color: var(--color-primary); }

/* ─── HERO ──────────────────────────────────────────────── */
.hero {
  padding: 60px 0 80px;
  background: var(--color-bg-soft);
  overflow: hidden;
}
.hero-inner {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 64px;
  align-items: center;
}
.hero-badge {
  display: inline-flex; align-items: center; gap: 8px;
  padding: 8px 16px; background: var(--color-primary-50);
  border: 1px solid var(--color-primary-100); border-radius: var(--radius-full);
  font-size: 13px; font-weight: 500; color: var(--color-primary);
  margin-bottom: 24px;
}
.hero-title {
  font-size: clamp(36px, 5vw, 56px);
  color: var(--color-secondary);
  margin: 0 0 20px;
  letter-spacing: -0.5px;
  line-height: 1.15;
}
.hero-accent { color: var(--color-primary); }
.hero-subtitle {
  font-size: 17px; color: var(--color-text-secondary);
  max-width: 480px; margin: 0 0 32px; line-height: 1.7;
}
.hero-cta { display: flex; gap: 12px; flex-wrap: wrap; margin-bottom: 32px; }
.hero-trust { display: flex; gap: 20px; flex-wrap: wrap; }
.trust-item {
  display: flex; align-items: center; gap: 6px;
  font-size: 13px; color: var(--color-text-secondary);
}
.trust-item svg { color: var(--color-success); }

/* Hero visual */
.hero-visual { position: relative; display: flex; justify-content: center; }
.hero-image-wrapper { position: relative; }
.hero-image-placeholder {
  width: 380px; height: 440px;
  background: var(--color-bg-muted);
  border-radius: var(--radius-2xl);
  display: flex; flex-direction: column;
  align-items: center; justify-content: center;
  gap: 12px; color: var(--color-text-muted);
  position: relative; z-index: 1;
}
.hero-image-placeholder span { font-size: 14px; }
.hero-decoration {
  position: absolute; border-radius: var(--radius-2xl);
}
.hero-dec-1 {
  width: 300px; height: 300px;
  background: var(--color-primary-100);
  top: -20px; right: -30px; z-index: 0;
  opacity: 0.6;
}
.hero-dec-2 {
  width: 120px; height: 120px;
  background: var(--color-accent-light);
  bottom: -15px; left: -20px; z-index: 0;
  border-radius: var(--radius-xl);
  opacity: 0.4;
}

/* ─── SERVICES GRID ─────────────────────────────────────── */
.services-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 20px;
}
.service-card {
  display: flex; flex-direction: column;
  padding: 28px;
  background: var(--color-bg-card);
  border: 1px solid var(--color-border-light);
  border-radius: var(--radius-lg);
  text-decoration: none;
  transition: transform var(--transition-fast), box-shadow var(--transition-fast), border-color var(--transition-fast);
}
.service-card:hover {
  transform: translateY(-4px);
  box-shadow: var(--shadow-card-hover);
  border-color: var(--color-border);
}
.service-card-icon {
  width: 48px; height: 48px;
  border-radius: var(--radius-md);
  display: flex; align-items: center; justify-content: center;
  margin-bottom: 18px;
}
.service-card h3 {
  font-family: var(--font-body);
  font-size: 17px; font-weight: 600;
  color: var(--color-secondary);
  margin: 0 0 8px;
}
.service-card p {
  font-size: 14px; color: var(--color-text-secondary);
  line-height: 1.6; margin: 0 0 16px; flex: 1;
}
.service-card-link {
  display: inline-flex; align-items: center; gap: 4px;
  font-size: 13px; font-weight: 600;
  color: var(--color-primary);
  transition: gap var(--transition-fast);
}
.service-card:hover .service-card-link { gap: 8px; }

/* Last row: 2 cards centered */
.services-grid .service-card:nth-child(4) { grid-column: 1 / 2; }
.services-grid .service-card:nth-child(5) { grid-column: 2 / 3; }

/* ─── ABOUT ─────────────────────────────────────────────── */
.about-layout {
  display: grid;
  grid-template-columns: 0.9fr 1.1fr;
  gap: 64px;
  align-items: center;
}
.about-image-card {
  border-radius: var(--radius-2xl);
  overflow: hidden;
}
.about-image-placeholder {
  width: 100%; aspect-ratio: 3/4;
  background: var(--color-bg-muted);
  display: flex; flex-direction: column;
  align-items: center; justify-content: center;
  gap: 8px; color: var(--color-text-muted);
}
.about-image-placeholder span { font-size: 13px; }
.about-text-col h2 {
  font-size: clamp(26px, 3.5vw, 36px);
  margin: 0 0 20px;
}
.about-bio {
  font-size: 16px; line-height: 1.8;
  color: var(--color-text-secondary);
  margin: 0 0 28px;
}
.about-stats { display: flex; flex-direction: column; gap: 12px; }
.stat-item {
  display: flex; align-items: center; gap: 10px;
  font-size: 15px; color: var(--color-text);
}
.stat-item svg { color: var(--color-primary); flex-shrink: 0; }

/* ─── WHY GRID ──────────────────────────────────────────── */
.why-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 20px;
}
.why-card {
  padding: 28px 24px;
  background: var(--color-bg-soft);
  border-radius: var(--radius-lg);
  transition: box-shadow var(--transition-fast), transform var(--transition-fast);
}
.why-card:hover {
  box-shadow: var(--shadow-md);
  transform: translateY(-2px);
}
.why-number {
  width: 36px; height: 36px;
  background: var(--color-primary);
  color: #fff;
  border-radius: var(--radius-sm);
  display: flex; align-items: center; justify-content: center;
  font-weight: 700; font-size: 15px;
  margin-bottom: 16px;
}
.why-card h3 {
  font-family: var(--font-body);
  font-size: 16px; font-weight: 600;
  color: var(--color-secondary);
  margin: 0 0 8px;
}
.why-card p {
  font-size: 14px; color: var(--color-text-secondary);
  line-height: 1.6; margin: 0;
}

/* ─── PROCESS ───────────────────────────────────────────── */
.process-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 20px;
}
.process-card {
  text-align: center;
  padding: 32px 20px;
  background: var(--color-bg-card);
  border-radius: var(--radius-lg);
  border: 1px solid var(--color-border-light);
}
.process-number {
  width: 48px; height: 48px;
  background: var(--color-primary-50);
  color: var(--color-primary);
  border-radius: 50%;
  display: flex; align-items: center; justify-content: center;
  font-family: var(--font-display);
  font-size: 20px;
  margin: 0 auto 16px;
}
.process-card h3 {
  font-family: var(--font-body);
  font-size: 16px; font-weight: 600;
  color: var(--color-secondary);
  margin: 0 0 8px;
}
.process-card p {
  font-size: 14px; color: var(--color-text-secondary);
  line-height: 1.6; margin: 0;
}

/* ─── CTA BANNER ────────────────────────────────────────── */
.cta-banner {
  padding: 24px 0;
}
.cta-banner-inner {
  background: var(--color-primary);
  border-radius: var(--radius-2xl);
  padding: 56px 48px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 32px;
}
.cta-banner-content h2 {
  color: #fff;
  font-size: clamp(24px, 3vw, 32px);
  margin: 0 0 8px;
}
.cta-banner-content p {
  color: rgba(255, 255, 255, 0.8);
  font-size: 16px;
  margin: 0;
  max-width: 480px;
}

/* ─── CONTACT ───────────────────────────────────────────── */
.contact-layout {
  display: grid;
  grid-template-columns: 1.4fr 1fr;
  gap: 40px;
  align-items: start;
}
.contact-form-card {
  background: var(--color-bg-card);
  border: 1px solid var(--color-border-light);
  border-radius: var(--radius-xl);
  padding: 40px;
}

.form-row { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; }
.form-group { margin-bottom: 18px; }
.form-group label {
  display: block; font-size: 13px; font-weight: 500;
  margin-bottom: 6px; color: var(--color-text);
}
.form-group input,
.form-group textarea,
.form-group select {
  width: 100%; padding: 12px 14px;
  border: 1px solid var(--color-border); border-radius: var(--radius-md);
  font-size: 14px; font-family: var(--font-body);
  outline: none; background: var(--color-bg);
  color: var(--color-text);
  transition: border-color var(--transition-fast), box-shadow var(--transition-fast);
}
.form-group input:focus,
.form-group textarea:focus,
.form-group select:focus {
  border-color: var(--color-primary);
  box-shadow: 0 0 0 3px var(--color-primary-50);
}
.form-group select {
  appearance: none;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%2394a3b8' stroke-width='2'%3E%3Cpath d='m6 9 6 6 6-6'/%3E%3C/svg%3E");
  background-repeat: no-repeat;
  background-position: right 14px center;
  padding-right: 36px;
}

.error-msg { color: var(--color-error); font-size: 14px; margin-bottom: 12px; }
.privacy-note { font-size: 12px; color: var(--color-text-muted); margin-top: 12px; }
.privacy-note a { color: var(--color-text-secondary); text-decoration: underline; text-underline-offset: 2px; }

.success-state { text-align: center; padding: 40px 0; }
.success-icon-wrap {
  width: 64px; height: 64px;
  background: #ecfdf5; border-radius: 50%;
  display: flex; align-items: center; justify-content: center;
  margin: 0 auto 20px; color: var(--color-success);
}
.success-state h3 { font-family: var(--font-body); font-size: 20px; font-weight: 600; margin: 0 0 8px; }
.success-state p { color: var(--color-text-secondary); margin: 0 0 24px; }

/* Info cards */
.contact-info-col { display: flex; flex-direction: column; gap: 12px; }
.info-card {
  display: flex; align-items: center; gap: 14px;
  padding: 20px;
  background: var(--color-bg-soft);
  border-radius: var(--radius-lg);
  transition: box-shadow var(--transition-fast);
}
.info-card:hover { box-shadow: var(--shadow-sm); }
.info-card-icon {
  width: 44px; height: 44px;
  background: var(--color-primary-50);
  border-radius: var(--radius-md);
  display: flex; align-items: center; justify-content: center;
  color: var(--color-primary);
  flex-shrink: 0;
}
.info-card-label {
  display: block; font-size: 12px; font-weight: 500;
  color: var(--color-text-muted); margin-bottom: 2px;
}
.info-card a {
  color: var(--color-text); text-decoration: none;
  font-size: 14px; font-weight: 500;
}
.info-card span:not(.info-card-label) {
  font-size: 14px; color: var(--color-text);
}

/* ─── Responsive ────────────────────────────────────────── */
@media (max-width: 1024px) {
  .services-grid { grid-template-columns: repeat(2, 1fr); }
  .services-grid .service-card:nth-child(4),
  .services-grid .service-card:nth-child(5) { grid-column: auto; }
  .services-grid .service-card:nth-child(5) { grid-column: 1 / -1; max-width: 400px; margin: 0 auto; }
  .why-grid, .process-grid { grid-template-columns: repeat(2, 1fr); }
  .cta-banner-inner { flex-direction: column; text-align: center; }
}

@media (max-width: 768px) {
  .hero { padding: 40px 0 60px; }
  .hero-inner { grid-template-columns: 1fr; gap: 40px; text-align: center; }
  .hero-content { order: 1; }
  .hero-visual { order: 0; }
  .hero-image-placeholder { width: 240px; height: 280px; margin: 0 auto; }
  .hero-dec-1 { width: 180px; height: 180px; }
  .hero-dec-2 { width: 80px; height: 80px; }
  .hero-subtitle { margin: 0 auto 32px; }
  .hero-cta { justify-content: center; }
  .hero-trust { justify-content: center; }

  .about-layout { grid-template-columns: 1fr; gap: 40px; }
  .about-image-col { order: -1; max-width: 300px; margin: 0 auto; }
  .about-image-placeholder { aspect-ratio: 1; }

  .services-grid { grid-template-columns: 1fr; }
  .services-grid .service-card:nth-child(5) { max-width: none; }
  .why-grid { grid-template-columns: 1fr; }
  .process-grid { grid-template-columns: 1fr; }

  .contact-layout { grid-template-columns: 1fr; }
  .contact-form-card { padding: 24px; }
  .form-row { grid-template-columns: 1fr; }

  .cta-banner-inner { padding: 40px 24px; border-radius: var(--radius-xl); }
}
</style>
