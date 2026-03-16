<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import { useHead } from '@unhead/vue'
import { useSeo } from '@/composables/useSeo'
import SiteLayout from '@/components/layout/SiteLayout.vue'

const { t } = useI18n()
useSeo({ title: t('home.title'), description: t('home.description') })

// JSON-LD Organization — structured data for search engines
const APP_NAME = import.meta.env.VITE_APP_NAME || '{{APP_NAME}}'
const BASE_URL = import.meta.env.VITE_APP_URL || ''
const CONTACT_EMAIL = import.meta.env.VITE_CONTACT_EMAIL || '{{CONTACT_EMAIL}}'
const COMPANY_ADDRESS = '{{COMPANY_ADDRESS}}'

useHead({
  script: [
    {
      type: 'application/ld+json',
      innerHTML: JSON.stringify({
        '@context': 'https://schema.org',
        '@type': 'Organization',
        name: APP_NAME,
        url: BASE_URL,
        email: CONTACT_EMAIL,
        address: {
          '@type': 'PostalAddress',
          streetAddress: COMPANY_ADDRESS,
        },
      }),
    },
  ],
})
</script>

<template>
  <SiteLayout>
    <!-- Hero -->
    <section class="hero">
      <div class="container">
        <h1>{{ t('home.heroTitle') }}</h1>
        <p>{{ t('home.heroSubtitle') }}</p>
        <div class="hero-cta">
          <RouterLink to="/contatti" class="btn-primary">{{ t('home.ctaPrimary') }}</RouterLink>
          <RouterLink to="/servizi" class="btn-secondary">{{ t('home.ctaSecondary') }}</RouterLink>
        </div>
      </div>
    </section>

    <!-- Services preview -->
    <section class="services-preview">
      <div class="container">
        <h2>{{ t('services.title') }}</h2>
        <div class="services-grid">
          <div v-for="i in 3" :key="i" class="service-card">
            <div class="service-icon">◆</div>
            <h3>{{ t(`services.item${i}.title`) }}</h3>
            <p>{{ t(`services.item${i}.desc`) }}</p>
          </div>
        </div>
      </div>
    </section>

    <!-- About teaser -->
    <section class="about-teaser">
      <div class="container">
        <div class="about-content">
          <div>
            <h2>{{ t('about.teaserTitle') }}</h2>
            <p>{{ t('about.teaserText') }}</p>
            <RouterLink to="/chi-siamo" class="btn-secondary">{{ t('about.learnMore') }}</RouterLink>
          </div>
          <div class="about-visual">
            <!-- Replace with image or illustration -->
            <div class="placeholder-image" />
          </div>
        </div>
      </div>
    </section>

    <!-- CTA contact -->
    <section class="cta-section">
      <div class="container">
        <h2>{{ t('home.ctaTitle') }}</h2>
        <p>{{ t('home.ctaText') }}</p>
        <RouterLink to="/contatti" class="btn-primary">{{ t('nav.contact') }}</RouterLink>
      </div>
    </section>
  </SiteLayout>
</template>

<style scoped>
.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 24px;
}

/* Hero */
.hero {
  padding: 96px 0;
  text-align: center;
  background: linear-gradient(180deg, #fafafa 0%, #fff 100%);
}
.hero h1 {
  font-size: clamp(36px, 5vw, 64px);
  font-weight: 800;
  color: #111;
  letter-spacing: -2px;
  line-height: 1.1;
  margin: 0 0 20px;
}
.hero p {
  font-size: 18px;
  color: #6b7280;
  max-width: 540px;
  margin: 0 auto 40px;
  line-height: 1.6;
}
.hero-cta {
  display: flex;
  gap: 12px;
  justify-content: center;
  flex-wrap: wrap;
}

/* Buttons */
.btn-primary {
  padding: 12px 28px;
  background: #111;
  color: #fff;
  border-radius: 8px;
  text-decoration: none;
  font-weight: 600;
  font-size: 15px;
  transition: opacity 0.15s;
}
.btn-primary:hover { opacity: 0.85; }
.btn-secondary {
  padding: 12px 28px;
  background: #f3f4f6;
  color: #111;
  border-radius: 8px;
  text-decoration: none;
  font-weight: 600;
  font-size: 15px;
  transition: background 0.15s;
}
.btn-secondary:hover { background: #e5e7eb; }

/* Services */
.services-preview {
  padding: 80px 0;
}
.services-preview h2 {
  font-size: 32px;
  font-weight: 700;
  text-align: center;
  margin: 0 0 48px;
}
.services-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 24px;
}
.service-card {
  padding: 32px;
  border: 1px solid #e5e7eb;
  border-radius: 12px;
  transition: border-color 0.15s, box-shadow 0.15s;
}
.service-card:hover {
  border-color: #d1d5db;
  box-shadow: 0 4px 16px rgba(0,0,0,0.06);
}
.service-icon {
  font-size: 24px;
  margin-bottom: 16px;
}
.service-card h3 {
  font-size: 18px;
  font-weight: 600;
  margin: 0 0 8px;
}
.service-card p {
  font-size: 14px;
  color: #6b7280;
  line-height: 1.6;
  margin: 0;
}

/* About teaser */
.about-teaser {
  padding: 80px 0;
  background: #fafafa;
}
.about-content {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 64px;
  align-items: center;
}
.about-content h2 {
  font-size: 32px;
  font-weight: 700;
  margin: 0 0 16px;
}
.about-content p {
  color: #6b7280;
  line-height: 1.7;
  margin: 0 0 24px;
}
.placeholder-image {
  aspect-ratio: 4/3;
  background: #e5e7eb;
  border-radius: 16px;
}

/* CTA */
.cta-section {
  padding: 96px 0;
  text-align: center;
}
.cta-section h2 {
  font-size: 36px;
  font-weight: 700;
  margin: 0 0 16px;
}
.cta-section p {
  color: #6b7280;
  margin: 0 0 32px;
  font-size: 16px;
}

@media (max-width: 768px) {
  .services-grid { grid-template-columns: 1fr; }
  .about-content { grid-template-columns: 1fr; }
}
</style>
