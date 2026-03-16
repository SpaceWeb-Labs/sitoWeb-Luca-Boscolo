<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import { useI18n } from 'vue-i18n'
import { useRoute } from 'vue-router'
import { siteConfig } from '@/site.config'

const { t } = useI18n()
const route = useRoute()
const mobileOpen = ref(false)
const scrolled = ref(false)

const isHome = () => route.path === '/'

function onScroll() {
  scrolled.value = window.scrollY > 20
}

onMounted(() => window.addEventListener('scroll', onScroll, { passive: true }))
onUnmounted(() => window.removeEventListener('scroll', onScroll))

function scrollTo(id: string) {
  mobileOpen.value = false
  const el = document.getElementById(id)
  if (el) el.scrollIntoView({ behavior: 'smooth' })
}

function scrollToContatti() {
  scrollTo('contatti')
}
</script>

<template>
  <div class="site-layout">
    <!-- Header -->
    <header :class="['site-header', { scrolled }]">
      <div class="header-container">
        <!-- Logo -->
        <RouterLink to="/" class="logo">
          <div class="logo-icon">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10"/></svg>
          </div>
          <div class="logo-text">
            <span class="logo-name">{{ siteConfig.name }}</span>
            <span class="logo-title">{{ siteConfig.title }}</span>
          </div>
        </RouterLink>

        <!-- Desktop nav -->
        <nav class="nav-desktop">
          <template v-if="isHome()">
            <a
              v-for="section in siteConfig.sections"
              :key="section.id"
              :href="`#${section.id}`"
              class="nav-link"
              @click.prevent="scrollTo(section.id)"
            >
              {{ t(section.label) }}
            </a>
          </template>
          <template v-else>
            <RouterLink to="/" class="nav-link">{{ t('nav.home') }}</RouterLink>
            <RouterLink to="/servizi" class="nav-link">{{ t('nav.services') }}</RouterLink>
          </template>
        </nav>

        <!-- CTA -->
        <a
          v-if="isHome()"
          href="#contatti"
          class="header-cta"
          @click.prevent="scrollToContatti"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/></svg>
          {{ t('nav.cta') }}
        </a>
        <RouterLink v-else to="/#contatti" class="header-cta">
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/></svg>
          {{ t('nav.cta') }}
        </RouterLink>

        <!-- Mobile menu button -->
        <button
          :class="['mobile-menu-btn', { open: mobileOpen }]"
          :aria-label="mobileOpen ? t('common.close') : 'Menu'"
          @click="mobileOpen = !mobileOpen"
        >
          <span /><span /><span />
        </button>
      </div>

      <!-- Mobile nav -->
      <Transition name="slide">
        <nav v-if="mobileOpen" class="nav-mobile">
          <template v-if="isHome()">
            <a
              v-for="section in siteConfig.sections"
              :key="section.id"
              :href="`#${section.id}`"
              class="nav-link"
              @click.prevent="scrollTo(section.id)"
            >
              {{ t(section.label) }}
            </a>
          </template>
          <template v-else>
            <RouterLink to="/" class="nav-link" @click="mobileOpen = false">{{ t('nav.home') }}</RouterLink>
            <RouterLink to="/servizi" class="nav-link" @click="mobileOpen = false">{{ t('nav.services') }}</RouterLink>
          </template>
          <a
            v-if="isHome()"
            href="#contatti"
            class="mobile-cta"
            @click.prevent="scrollToContatti"
          >
            {{ t('nav.cta') }}
          </a>
          <RouterLink v-else to="/#contatti" class="mobile-cta" @click="mobileOpen = false">
            {{ t('nav.cta') }}
          </RouterLink>
        </nav>
      </Transition>
    </header>

    <!-- Main content -->
    <main id="top" class="site-main">
      <slot />
    </main>

    <!-- Footer -->
    <!-- LEGAL: verificare con agente principale prima della pubblicazione -->
    <footer class="site-footer">
      <div class="footer-container">
        <!-- Top section -->
        <div class="footer-top">
          <div class="footer-brand">
            <div class="footer-logo">
              <div class="footer-logo-icon">
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10"/></svg>
              </div>
              <div>
                <strong>{{ siteConfig.name }}</strong>
                <span>{{ siteConfig.title }}</span>
              </div>
            </div>
            <p class="footer-tagline">Consulenza assicurativa personalizzata in provincia di Varese</p>
          </div>

          <div class="footer-links-grid">
            <!-- Quick links -->
            <div class="footer-col">
              <h4>Navigazione</h4>
              <RouterLink to="/">Home</RouterLink>
              <RouterLink to="/servizi">Servizi</RouterLink>
              <RouterLink to="/#chi-sono">Chi Sono</RouterLink>
              <RouterLink to="/#contatti">Contatti</RouterLink>
            </div>

            <!-- Services -->
            <div class="footer-col">
              <h4>Servizi</h4>
              <RouterLink to="/servizi#auto">Auto e Mobilità</RouterLink>
              <RouterLink to="/servizi#casa">Casa e Patrimonio</RouterLink>
              <RouterLink to="/servizi#salute">Salute e Famiglia</RouterLink>
              <RouterLink to="/servizi#previdenza">Previdenza e Risparmio</RouterLink>
              <RouterLink to="/servizi#impresa">Impresa e Professionisti</RouterLink>
            </div>

            <!-- Contact -->
            <div class="footer-col">
              <h4>Contatti</h4>
              <a :href="`mailto:${siteConfig.email}`" class="footer-contact-link">
                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="20" height="16" x="2" y="4" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/></svg>
                {{ siteConfig.email }}
              </a>
              <a :href="`tel:${siteConfig.phone.replace(/\s/g, '')}`" class="footer-contact-link">
                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/></svg>
                {{ siteConfig.phone }}
              </a>
              <span class="footer-contact-link">
                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0z"/><circle cx="12" cy="10" r="3"/></svg>
                {{ siteConfig.area }}
              </span>
            </div>
          </div>
        </div>

        <!-- Legal / IVASS -->
        <!-- LEGAL: verificare con agente principale se è possibile menzionare le compagnie distribuite -->
        <div class="footer-legal">
          <p>{{ t('footer.ruiLabel') }}, n. {{ siteConfig.ruiNumber }}</p>
          <p>{{ t('footer.agencyLabel') }} {{ siteConfig.agencyName }} di {{ siteConfig.agencyCity }}</p>
          <p>
            {{ t('footer.ivassNote') }} —
            <a :href="siteConfig.ivassRegistryUrl" target="_blank" rel="noopener">{{ t('footer.ivassRegistry') }}</a>
          </p>
        </div>

        <!-- Bottom bar -->
        <div class="footer-bottom">
          <p>© {{ new Date().getFullYear() }} {{ siteConfig.name }} — P.IVA {{ siteConfig.piva }}</p>
          <div class="footer-bottom-links">
            <RouterLink to="/privacy">{{ t('footer.privacy') }}</RouterLink>
            <span>·</span>
            <a href="#">{{ t('footer.cookies') }}</a>
          </div>
        </div>
      </div>
    </footer>
  </div>
</template>

<style scoped>
/* ─── Layout ────────────────────────────────────────────── */
.site-layout {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}
.site-main {
  flex: 1;
  margin-top: 72px;
}

/* ─── Header ────────────────────────────────────────────── */
.site-header {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 100;
  background: rgba(255, 255, 255, 0.8);
  backdrop-filter: blur(16px);
  -webkit-backdrop-filter: blur(16px);
  border-bottom: 1px solid transparent;
  transition: background var(--transition-fast), border-color var(--transition-fast), box-shadow var(--transition-fast);
}
.site-header.scrolled {
  background: rgba(255, 255, 255, 0.95);
  border-bottom-color: var(--color-border);
  box-shadow: var(--shadow-sm);
}

.header-container {
  max-width: var(--container-max);
  margin: 0 auto;
  padding: 0 var(--container-padding);
  display: flex;
  align-items: center;
  gap: 32px;
  height: 72px;
}

/* Logo */
.logo {
  display: flex;
  align-items: center;
  gap: 10px;
  text-decoration: none;
}
.logo-icon {
  width: 36px;
  height: 36px;
  background: var(--color-primary);
  border-radius: var(--radius-sm);
  display: flex;
  align-items: center;
  justify-content: center;
  color: #fff;
}
.logo-text {
  display: flex;
  flex-direction: column;
  line-height: 1.2;
}
.logo-name {
  font-family: var(--font-display);
  font-size: 18px;
  color: var(--color-secondary);
}
.logo-title {
  font-size: 11px;
  color: var(--color-text-muted);
  letter-spacing: 0.02em;
}

/* Nav */
.nav-desktop {
  display: flex;
  gap: 4px;
  flex: 1;
  justify-content: center;
}
.nav-link {
  padding: 8px 16px;
  border-radius: var(--radius-full);
  text-decoration: none;
  color: var(--color-text-secondary);
  font-size: 14px;
  font-weight: 500;
  transition: color var(--transition-fast), background var(--transition-fast);
}
.nav-link:hover {
  color: var(--color-primary);
  background: var(--color-primary-50);
}

/* Header CTA */
.header-cta {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 10px 20px;
  background: var(--color-primary);
  color: #fff;
  border-radius: var(--radius-full);
  font-size: 13px;
  font-weight: 600;
  text-decoration: none;
  white-space: nowrap;
  transition: background var(--transition-fast), transform var(--transition-fast), box-shadow var(--transition-fast);
}
.header-cta:hover {
  background: var(--color-primary-dark);
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(37, 99, 235, 0.3);
}

/* Mobile menu */
.mobile-menu-btn {
  display: none;
  flex-direction: column;
  gap: 5px;
  background: none;
  border: none;
  cursor: pointer;
  padding: 8px;
  z-index: 101;
}
.mobile-menu-btn span {
  display: block;
  width: 22px;
  height: 2px;
  background: var(--color-secondary);
  border-radius: 2px;
  transition: transform var(--transition-fast), opacity var(--transition-fast);
}
.mobile-menu-btn.open span:nth-child(1) { transform: translateY(7px) rotate(45deg); }
.mobile-menu-btn.open span:nth-child(2) { opacity: 0; }
.mobile-menu-btn.open span:nth-child(3) { transform: translateY(-7px) rotate(-45deg); }

.nav-mobile {
  display: flex;
  flex-direction: column;
  padding: 12px var(--container-padding) 20px;
  background: #fff;
  border-top: 1px solid var(--color-border-light);
}
.nav-mobile .nav-link {
  padding: 14px 0;
  font-size: 16px;
  border-radius: 0;
  border-bottom: 1px solid var(--color-border-light);
}
.mobile-cta {
  display: block;
  margin-top: 16px;
  padding: 14px;
  background: var(--color-primary);
  color: #fff;
  border-radius: var(--radius-md);
  font-size: 15px;
  font-weight: 600;
  text-decoration: none;
  text-align: center;
}

.slide-enter-active, .slide-leave-active {
  transition: max-height var(--transition-normal), opacity var(--transition-normal);
  overflow: hidden;
}
.slide-enter-from, .slide-leave-to { max-height: 0; opacity: 0; }
.slide-enter-to, .slide-leave-from { max-height: 500px; opacity: 1; }

/* ─── Footer ────────────────────────────────────────────── */
.site-footer {
  background: var(--color-secondary);
  color: var(--color-text-muted);
  padding: 64px 0 0;
}
.footer-container {
  max-width: var(--container-max);
  margin: 0 auto;
  padding: 0 var(--container-padding);
}

.footer-top {
  display: grid;
  grid-template-columns: 1.2fr 2fr;
  gap: 48px;
  padding-bottom: 40px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.08);
}

/* Footer brand */
.footer-logo {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 12px;
}
.footer-logo-icon {
  width: 36px;
  height: 36px;
  background: var(--color-primary);
  border-radius: var(--radius-sm);
  display: flex;
  align-items: center;
  justify-content: center;
  color: #fff;
  flex-shrink: 0;
}
.footer-logo strong {
  display: block;
  color: #fff;
  font-family: var(--font-display);
  font-size: 17px;
  font-weight: 400;
}
.footer-logo span {
  font-size: 12px;
  color: var(--color-text-muted);
}
.footer-tagline {
  font-size: 14px;
  line-height: 1.6;
  margin: 0;
  max-width: 280px;
}

/* Footer links grid */
.footer-links-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 32px;
}
.footer-col h4 {
  color: #fff;
  font-family: var(--font-body);
  font-size: 13px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.06em;
  margin: 0 0 16px;
}
.footer-col a, .footer-col span {
  display: block;
  color: var(--color-text-muted);
  text-decoration: none;
  font-size: 14px;
  padding: 4px 0;
  transition: color var(--transition-fast);
}
.footer-col a:hover { color: #fff; }

.footer-contact-link {
  display: flex !important;
  align-items: center;
  gap: 8px;
}
.footer-contact-link svg { flex-shrink: 0; color: var(--color-primary-light); }

/* Legal */
.footer-legal {
  padding: 24px 0;
  border-bottom: 1px solid rgba(255, 255, 255, 0.08);
}
.footer-legal p {
  font-size: 12px;
  line-height: 1.6;
  margin: 0 0 4px;
}
.footer-legal a {
  color: var(--color-primary-light);
  text-decoration: underline;
  text-underline-offset: 2px;
}
.footer-legal a:hover { color: #fff; }

/* Bottom */
.footer-bottom {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px 0;
  font-size: 12px;
}
.footer-bottom p { margin: 0; }
.footer-bottom-links {
  display: flex;
  align-items: center;
  gap: 8px;
}
.footer-bottom-links a {
  color: var(--color-text-muted);
  text-decoration: none;
}
.footer-bottom-links a:hover { color: #fff; }
.footer-bottom-links span { color: rgba(255, 255, 255, 0.15); }

/* ─── Responsive ────────────────────────────────────────── */
@media (max-width: 768px) {
  .nav-desktop, .header-cta { display: none; }
  .mobile-menu-btn { display: flex; margin-left: auto; }
  .header-container { height: 64px; }
  .site-main { margin-top: 64px; }
  .footer-top { grid-template-columns: 1fr; gap: 32px; }
  .footer-links-grid { grid-template-columns: 1fr 1fr; gap: 24px; }
  .footer-bottom { flex-direction: column; gap: 8px; text-align: center; }
}

@media (max-width: 480px) {
  .footer-links-grid { grid-template-columns: 1fr; }
}
</style>
