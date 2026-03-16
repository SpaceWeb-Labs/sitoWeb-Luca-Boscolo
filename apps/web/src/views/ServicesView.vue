<script setup lang="ts">
import { onMounted } from 'vue'
import { useI18n } from 'vue-i18n'
import { useSeo } from '@/composables/useSeo'
import SiteLayout from '@/components/layout/SiteLayout.vue'

const { t } = useI18n()
useSeo({
  title: t('services.title'),
  description: t('home.servicesSubtitle'),
  url: '/servizi',
})

// ─── Service areas with sub-items ──────────────────────
const serviceAreas = [
  {
    key: 'auto',
    icon: 'car',
    color: '#3b82f6',
    items: ['rcAuto', 'furtoIncendio', 'kasko', 'moto', 'veicoliCommerciali', 'flotte'],
  },
  {
    key: 'casa',
    icon: 'home',
    color: '#10b981',
    items: ['incendio', 'furto', 'catastrofi', 'rc', 'condominio', 'tutelaLegale'],
  },
  {
    key: 'salute',
    icon: 'heart',
    color: '#ef4444',
    items: ['speseMediche', 'infortuni', 'malattieGravi', 'protezioneReddito', 'vita', 'animali'],
  },
  {
    key: 'previdenza',
    icon: 'piggy',
    color: '#f59e0b',
    items: ['pensioneIntegrativa', 'pip', 'pac', 'investimentoAssicurativo', 'tfr'],
  },
  {
    key: 'impresa',
    icon: 'briefcase',
    color: '#8b5cf6',
    items: ['rcProfessionale', 'rcImpresa', 'multirischio', 'cyber', 'tutelaLegale', 'dAndO'],
  },
] as const

// ─── IntersectionObserver ─────────────────────────────
onMounted(() => {
  const observer = new IntersectionObserver(
    (entries) => entries.forEach((e) => { if (e.isIntersecting) e.target.classList.add('visible') }),
    { threshold: 0.05, rootMargin: '0px 0px -20px 0px' },
  )
  document.querySelectorAll('.fade-in, .fade-in-stagger').forEach((el) => observer.observe(el))
})
</script>

<template>
  <SiteLayout>
    <!-- Hero header -->
    <section class="services-hero">
      <div class="container">
        <div class="services-hero-content fade-in">
          <span class="section-label">Servizi</span>
          <h1>{{ t('services.title') }}</h1>
          <p>{{ t('services.subtitle') }}</p>
        </div>
        <!-- Quick nav pills -->
        <div class="service-pills fade-in">
          <a
            v-for="area in serviceAreas"
            :key="area.key"
            :href="`#${area.key}`"
            class="pill"
            :style="{ '--pill-color': area.color }"
          >
            <svg v-if="area.icon === 'car'" xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M19 17h2c.6 0 1-.4 1-1v-3c0-.9-.7-1.7-1.5-1.9C18.7 10.6 16 10 16 10s-1.3-1.4-2.2-2.3c-.5-.4-1.1-.7-1.8-.7H5c-.6 0-1.1.4-1.4.9l-1.4 2.9A3.5 3.5 0 0 0 2 12v4c0 .6.4 1 1 1h2"/><circle cx="7" cy="17" r="2"/><circle cx="17" cy="17" r="2"/></svg>
            <svg v-if="area.icon === 'home'" xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>
            <svg v-if="area.icon === 'heart'" xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"/></svg>
            <svg v-if="area.icon === 'piggy'" xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M19 5c-1.5 0-2.8 1.4-3 2-3.5-1.5-11-.3-11 5 0 1.8 0 3 2 4.5V20h4v-2h3v2h4v-4c1-.5 1.7-1 2-2h2v-4h-2c0-1-.5-1.5-1-2"/></svg>
            <svg v-if="area.icon === 'briefcase'" xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="20" height="14" x="2" y="7" rx="2" ry="2"/><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/></svg>
            {{ t(`services.${area.key}.title`) }}
          </a>
        </div>
      </div>
    </section>

    <!-- Service sections -->
    <section
      v-for="(area, areaIndex) in serviceAreas"
      :id="area.key"
      :key="area.key"
      :class="['service-section', { alt: areaIndex % 2 === 1 }]"
    >
      <div class="container">
        <div class="service-section-header fade-in">
          <div class="service-section-icon" :style="{ background: area.color + '12', color: area.color }">
            <svg v-if="area.icon === 'car'" xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M19 17h2c.6 0 1-.4 1-1v-3c0-.9-.7-1.7-1.5-1.9C18.7 10.6 16 10 16 10s-1.3-1.4-2.2-2.3c-.5-.4-1.1-.7-1.8-.7H5c-.6 0-1.1.4-1.4.9l-1.4 2.9A3.5 3.5 0 0 0 2 12v4c0 .6.4 1 1 1h2"/><circle cx="7" cy="17" r="2"/><circle cx="17" cy="17" r="2"/></svg>
            <svg v-if="area.icon === 'home'" xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>
            <svg v-if="area.icon === 'heart'" xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"/></svg>
            <svg v-if="area.icon === 'piggy'" xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M19 5c-1.5 0-2.8 1.4-3 2-3.5-1.5-11-.3-11 5 0 1.8 0 3 2 4.5V20h4v-2h3v2h4v-4c1-.5 1.7-1 2-2h2v-4h-2c0-1-.5-1.5-1-2"/></svg>
            <svg v-if="area.icon === 'briefcase'" xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><rect width="20" height="14" x="2" y="7" rx="2" ry="2"/><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/></svg>
          </div>
          <div>
            <h2>{{ t(`services.${area.key}.title`) }}</h2>
            <p class="service-section-subtitle">{{ t(`services.${area.key}.subtitle`) }}</p>
          </div>
        </div>

        <!-- Description + image -->
        <div class="service-intro fade-in">
          <p class="service-intro-text">{{ t(`services.${area.key}.desc`) }}</p>
          <div class="service-intro-image">
            <div class="image-placeholder">
              <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><rect width="18" height="18" x="3" y="3" rx="2" ry="2"/><circle cx="9" cy="9" r="2"/><path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21"/></svg>
            </div>
          </div>
        </div>

        <!-- Sub-service cards -->
        <div class="sub-services-grid fade-in-stagger">
          <div v-for="item in area.items" :key="item" class="sub-service-card">
            <div class="sub-service-dot" :style="{ background: area.color }" />
            <div>
              <h3>{{ t(`services.${area.key}.items.${item}.title`) }}</h3>
              <p>{{ t(`services.${area.key}.items.${item}.desc`) }}</p>
            </div>
          </div>
        </div>

        <!-- CTA -->
        <div class="service-cta-row fade-in">
          <RouterLink to="/#contatti" class="btn-primary">
            {{ t('common.requestInfo') }}
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>
          </RouterLink>
        </div>
      </div>
    </section>

    <!-- Final CTA -->
    <section class="final-cta fade-in">
      <div class="container">
        <div class="final-cta-inner">
          <h2>Non sai da dove iniziare?</h2>
          <p>Contattami per una consulenza gratuita. Insieme analizzeremo le tue esigenze e troveremo le soluzioni più adatte.</p>
          <RouterLink to="/#contatti" class="btn-primary btn-lg btn-white">
            {{ t('common.freeConsultation') }}
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>
          </RouterLink>
        </div>
      </div>
    </section>
  </SiteLayout>
</template>

<style scoped>
/* ─── Hero ──────────────────────────────────────────────── */
.services-hero {
  padding: 56px 0 40px;
  background: var(--color-bg-soft);
  text-align: center;
}
.services-hero-content { margin-bottom: 32px; }
.services-hero-content h1 { font-size: clamp(32px, 5vw, 48px); margin: 0 0 12px; }
.services-hero-content p { font-size: 17px; color: var(--color-text-secondary); max-width: 520px; margin: 0 auto; }
.section-label {
  display: inline-block; font-size: 13px; font-weight: 600;
  color: var(--color-primary); text-transform: uppercase;
  letter-spacing: 0.08em; margin-bottom: 8px;
}

/* Pills */
.service-pills { display: flex; gap: 8px; justify-content: center; flex-wrap: wrap; }
.pill {
  display: inline-flex; align-items: center; gap: 6px;
  padding: 10px 18px; background: var(--color-bg-card);
  border: 1px solid var(--color-border-light); border-radius: var(--radius-full);
  font-size: 13px; font-weight: 500; color: var(--color-text-secondary);
  text-decoration: none;
  transition: border-color var(--transition-fast), color var(--transition-fast), box-shadow var(--transition-fast);
}
.pill:hover { border-color: var(--pill-color, var(--color-primary)); color: var(--pill-color, var(--color-primary)); box-shadow: var(--shadow-sm); }
.pill svg { color: var(--pill-color, var(--color-primary)); }

/* ─── Service sections ──────────────────────────────────── */
.service-section { padding: 80px 0; border-bottom: 1px solid var(--color-border-light); }
.service-section.alt { background: var(--color-bg-soft); }
.service-section:last-of-type { border-bottom: none; }

.service-section-header { display: flex; align-items: center; gap: 16px; margin-bottom: 32px; }
.service-section-icon {
  width: 56px; height: 56px; border-radius: var(--radius-md);
  display: flex; align-items: center; justify-content: center; flex-shrink: 0;
}
.service-section-header h2 { font-size: clamp(24px, 3vw, 32px); margin: 0; }
.service-section-subtitle { font-size: 15px; color: var(--color-text-secondary); margin: 4px 0 0; }

/* Intro */
.service-intro { display: grid; grid-template-columns: 1fr 1fr; gap: 40px; align-items: center; margin-bottom: 40px; }
.service-intro-text { font-size: 16px; color: var(--color-text-secondary); line-height: 1.8; margin: 0; }
.image-placeholder {
  width: 100%; aspect-ratio: 16/10; background: var(--color-bg-muted);
  border-radius: var(--radius-xl); display: flex; align-items: center;
  justify-content: center; color: var(--color-text-muted);
}

/* Sub-services */
.sub-services-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 16px; margin-bottom: 32px; }
.sub-service-card {
  display: flex; gap: 14px; padding: 20px;
  background: var(--color-bg-card); border: 1px solid var(--color-border-light);
  border-radius: var(--radius-md);
  transition: box-shadow var(--transition-fast), transform var(--transition-fast);
}
.sub-service-card:hover { box-shadow: var(--shadow-md); transform: translateY(-2px); }
.sub-service-dot { width: 8px; height: 8px; border-radius: 50%; flex-shrink: 0; margin-top: 6px; }
.sub-service-card h3 { font-family: var(--font-body); font-size: 15px; font-weight: 600; color: var(--color-secondary); margin: 0 0 4px; }
.sub-service-card p { font-size: 13px; color: var(--color-text-secondary); line-height: 1.6; margin: 0; }
.service-cta-row { text-align: center; }

/* ─── Buttons ───────────────────────────────────────────── */
.btn-primary {
  display: inline-flex; align-items: center; gap: 8px;
  padding: 14px 28px; background: var(--color-primary); color: #fff;
  border: none; border-radius: var(--radius-full);
  font-size: 15px; font-weight: 600; font-family: var(--font-body);
  cursor: pointer; text-decoration: none;
  transition: background var(--transition-fast), transform var(--transition-fast), box-shadow var(--transition-fast);
}
.btn-primary:hover { background: var(--color-primary-dark); transform: translateY(-1px); box-shadow: 0 4px 16px rgba(37, 99, 235, 0.3); }
.btn-lg { padding: 16px 32px; font-size: 16px; }
.btn-white { background: #fff; color: var(--color-primary); }
.btn-white:hover { background: #fff; box-shadow: 0 4px 16px rgba(255, 255, 255, 0.3); }

/* ─── Final CTA ─────────────────────────────────────────── */
.final-cta { padding: 24px 0 80px; }
.final-cta-inner {
  background: var(--color-primary); border-radius: var(--radius-2xl);
  padding: 56px 48px; text-align: center;
}
.final-cta-inner h2 { color: #fff; font-size: clamp(24px, 3vw, 32px); margin: 0 0 12px; }
.final-cta-inner p { color: rgba(255, 255, 255, 0.8); font-size: 16px; max-width: 520px; margin: 0 auto 28px; }

/* ─── Responsive ────────────────────────────────────────── */
@media (max-width: 1024px) { .sub-services-grid { grid-template-columns: repeat(2, 1fr); } }
@media (max-width: 768px) {
  .service-intro { grid-template-columns: 1fr; }
  .sub-services-grid { grid-template-columns: 1fr; }
  .service-section { padding: 56px 0; }
  .final-cta-inner { padding: 40px 24px; border-radius: var(--radius-xl); }
}
</style>
