import { createI18n } from 'vue-i18n'
import it from './locales/it'
import en from './locales/en'
import de from './locales/de'
import fr from './locales/fr'

export type SupportedLocale = 'it' | 'en' | 'de' | 'fr'

export const SUPPORTED_LOCALES: SupportedLocale[] = ['it', 'en', 'de', 'fr']
export const DEFAULT_LOCALE: SupportedLocale = 'it'

// Detect browser locale, fallback to default
function detectLocale(): SupportedLocale {
  const saved = localStorage.getItem('locale') as SupportedLocale
  if (saved && SUPPORTED_LOCALES.includes(saved)) return saved

  const browser = navigator.language.split('-')[0] as SupportedLocale
  if (SUPPORTED_LOCALES.includes(browser)) return browser

  return DEFAULT_LOCALE
}

export const i18n = createI18n({
  legacy: false,
  locale: detectLocale(),
  fallbackLocale: DEFAULT_LOCALE,
  messages: { it, en, de, fr },
})

export function setLocale(locale: SupportedLocale) {
  i18n.global.locale.value = locale
  localStorage.setItem('locale', locale)
  document.documentElement.lang = locale
}

export function useLocale() {
  return {
    locale: i18n.global.locale,
    supportedLocales: SUPPORTED_LOCALES,
    setLocale,
  }
}
