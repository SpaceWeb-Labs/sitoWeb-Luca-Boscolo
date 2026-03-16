import { useHead } from '@unhead/vue'

interface SeoOptions {
  title: string
  description?: string
  image?: string
  url?: string
  type?: 'website' | 'article'
  noIndex?: boolean
}

const APP_NAME = import.meta.env.VITE_APP_NAME || '{{APP_NAME}}'
const BASE_URL = import.meta.env.VITE_APP_URL || ''

/**
 * Composable SEO — imposta title, meta description, Open Graph
 *
 * @example
 * useSeo({
 *   title: 'Chi siamo',
 *   description: 'La nostra storia e il nostro team'
 * })
 */
export function useSeo(options: SeoOptions) {
  const fullTitle = options.title ? `${options.title} — ${APP_NAME}` : APP_NAME
  const fullUrl = options.url ? `${BASE_URL}${options.url}` : BASE_URL

  useHead({
    title: fullTitle,
    meta: [
      // Base
      { name: 'description', content: options.description || '' },
      // Open Graph
      { property: 'og:title', content: fullTitle },
      { property: 'og:description', content: options.description || '' },
      { property: 'og:type', content: options.type || 'website' },
      { property: 'og:url', content: fullUrl },
      ...(options.image ? [{ property: 'og:image', content: options.image }] : []),
      // Twitter
      { name: 'twitter:card', content: 'summary_large_image' },
      { name: 'twitter:title', content: fullTitle },
      { name: 'twitter:description', content: options.description || '' },
      ...(options.image ? [{ name: 'twitter:image', content: options.image }] : []),
      // Robots
      ...(options.noIndex ? [{ name: 'robots', content: 'noindex, nofollow' }] : []),
    ],
    link: [
      { rel: 'canonical', href: fullUrl },
    ],
  })
}
