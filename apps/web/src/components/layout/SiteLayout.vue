<script setup lang="ts">
import { ref } from 'vue'
import { RouterLink, useRoute } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { useLocale } from '@/i18n'

const { t } = useI18n()
const { locale, supportedLocales, setLocale } = useLocale()
const route = useRoute()
const mobileOpen = ref(false)

// Config tokens — available at runtime via VITE_* env vars (set by setup.js)
const appName = import.meta.env.VITE_APP_NAME || '{{APP_NAME}}'
const appTagline = import.meta.env.VITE_APP_TAGLINE || '{{APP_TAGLINE}}'
const contactEmail = import.meta.env.VITE_CONTACT_EMAIL || '{{CONTACT_EMAIL}}'
// Content token — replaced by setup.js as a static string
const companyAddress = '{{COMPANY_ADDRESS}}'

const navLinks = [
  { to: '/', label: 'nav.home' },
  { to: '/chi-siamo', label: 'nav.about' },
  { to: '/servizi', label: 'nav.services' },
  { to: '/blog', label: 'nav.blog' },
  { to: '/contatti', label: 'nav.contact' },
]

function isActive(path: string) {
  if (path === '/') return route.path === '/'
  return route.path.startsWith(path)
}
</script>

<template>
  <div class="site-layout">
    <!-- Header -->
    <header class="site-header">
      <div class="container">
        <RouterLink to="/" class="logo">
          <!-- Replace with your logo -->
          <strong>{{ appName }}</strong>
        </RouterLink>

        <!-- Desktop nav -->
        <nav class="nav-desktop">
          <RouterLink
            v-for="link in navLinks"
            :key="link.to"
            :to="link.to"
            :class="['nav-link', { active: isActive(link.to) }]"
          >
            {{ t(link.label) }}
          </RouterLink>
        </nav>

        <!-- Locale switcher -->
        <div class="locale-switcher">
          <button
            v-for="loc in supportedLocales"
            :key="loc"
            :class="['locale-btn', { active: locale === loc }]"
            @click="setLocale(loc)"
          >
            {{ loc.toUpperCase() }}
          </button>
        </div>

        <!-- Mobile menu button -->
        <button class="mobile-menu-btn" @click="mobileOpen = !mobileOpen">
          <span />
          <span />
          <span />
        </button>
      </div>

      <!-- Mobile nav -->
      <nav v-if="mobileOpen" class="nav-mobile">
        <RouterLink
          v-for="link in navLinks"
          :key="link.to"
          :to="link.to"
          class="nav-link"
          @click="mobileOpen = false"
        >
          {{ t(link.label) }}
        </RouterLink>
      </nav>
    </header>

    <!-- Main content -->
    <main class="site-main">
      <slot />
    </main>

    <!-- Footer -->
    <footer class="site-footer">
      <div class="container">
        <div class="footer-grid">
          <div>
            <strong>{{ appName }}</strong>
            <p>{{ appTagline }}</p>
          </div>
          <div>
            <h4>{{ t('nav.services') }}</h4>
            <RouterLink to="/servizi">{{ t('nav.services') }}</RouterLink>
          </div>
          <div>
            <h4>{{ t('nav.contact') }}</h4>
            <RouterLink to="/contatti">{{ t('nav.contact') }}</RouterLink>
            <a :href="`mailto:${contactEmail}`">{{ contactEmail }}</a>
          </div>
        </div>
        <div class="footer-bottom">
          <p>© {{ new Date().getFullYear() }} {{ appName }}. {{ companyAddress }}</p>
          <RouterLink to="/privacy">{{ t('cookie.privacyPolicy') }}</RouterLink>
        </div>
      </div>
    </footer>
  </div>
</template>

<style scoped>
.site-layout {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}
.site-header {
  position: sticky;
  top: 0;
  z-index: 100;
  background: #fff;
  border-bottom: 1px solid #e5e7eb;
}
.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 24px;
  display: flex;
  align-items: center;
  gap: 32px;
  height: 64px;
}
.logo {
  text-decoration: none;
  color: #111;
  font-size: 18px;
}
.nav-desktop {
  display: flex;
  gap: 4px;
  flex: 1;
}
.nav-link {
  padding: 6px 12px;
  border-radius: 6px;
  text-decoration: none;
  color: #6b7280;
  font-size: 14px;
  transition: color 0.15s, background 0.15s;
}
.nav-link:hover, .nav-link.active {
  color: #111;
  background: #f3f4f6;
}
.locale-switcher {
  display: flex;
  gap: 2px;
}
.locale-btn {
  padding: 4px 8px;
  border: none;
  background: none;
  color: #9ca3af;
  font-size: 12px;
  cursor: pointer;
  border-radius: 4px;
}
.locale-btn.active {
  color: #111;
  background: #f3f4f6;
  font-weight: 600;
}
.mobile-menu-btn {
  display: none;
  flex-direction: column;
  gap: 5px;
  background: none;
  border: none;
  cursor: pointer;
  padding: 4px;
}
.mobile-menu-btn span {
  display: block;
  width: 22px;
  height: 2px;
  background: #111;
  border-radius: 2px;
}
.nav-mobile {
  display: flex;
  flex-direction: column;
  padding: 12px 24px;
  background: #fff;
  border-top: 1px solid #f3f4f6;
}
.site-main {
  flex: 1;
}
.site-footer {
  background: #111;
  color: #9ca3af;
  padding: 48px 0 24px;
}
.site-footer .container {
  flex-direction: column;
  height: auto;
  gap: 48px;
  padding: 0 24px;
}
.footer-grid {
  display: grid;
  grid-template-columns: 2fr 1fr 1fr;
  gap: 32px;
  width: 100%;
}
.site-footer h4 {
  color: #fff;
  font-size: 13px;
  margin: 0 0 12px;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}
.site-footer a {
  display: block;
  color: #9ca3af;
  text-decoration: none;
  font-size: 14px;
  margin-bottom: 6px;
}
.site-footer a:hover { color: #fff; }
.site-footer p { font-size: 14px; margin: 8px 0 0; line-height: 1.5; }
.footer-bottom {
  border-top: 1px solid #1f2937;
  padding-top: 24px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  font-size: 13px;
}

@media (max-width: 768px) {
  .nav-desktop { display: none; }
  .mobile-menu-btn { display: flex; }
  .footer-grid { grid-template-columns: 1fr; gap: 24px; }
  .footer-bottom { flex-direction: column; gap: 8px; text-align: center; }
}
</style>
