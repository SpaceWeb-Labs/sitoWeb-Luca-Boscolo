<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { useHead } from '@unhead/vue'
import { supabase } from '@/lib/supabase'
import SiteLayout from '@/components/layout/SiteLayout.vue'
import DOMPurify from 'dompurify'

const route = useRoute()
const router = useRouter()
const { t, locale } = useI18n()

const APP_NAME = import.meta.env.VITE_APP_NAME || '{{APP_NAME}}'
const BASE_URL = import.meta.env.VITE_APP_URL || ''

interface Post {
  id: string
  title: string
  excerpt: string | null
  body: string
  cover_url: string | null
  published_at: string
  locale: string
}

const post = ref<Post | null>(null)
const loading = ref(true)

// Dynamic SEO — updates reactively when post loads
useHead(() => ({
  title: post.value ? `${post.value.title} — ${APP_NAME}` : APP_NAME,
  meta: [
    { name: 'description', content: post.value?.excerpt || '' },
    { property: 'og:title', content: post.value ? `${post.value.title} — ${APP_NAME}` : APP_NAME },
    { property: 'og:description', content: post.value?.excerpt || '' },
    { property: 'og:type', content: 'article' },
    { property: 'og:url', content: `${BASE_URL}/blog/${route.params.slug}` },
    ...(post.value?.cover_url
      ? [{ property: 'og:image', content: post.value.cover_url }]
      : []),
  ],
  link: [
    { rel: 'canonical', href: `${BASE_URL}/blog/${route.params.slug}` },
  ],
}))

onMounted(async () => {
  const { data, error } = await supabase
    .from('posts')
    .select('id, title, excerpt, body, cover_url, published_at, locale')
    .eq('slug', route.params.slug as string)
    .eq('published', true)
    .single()

  if (error || !data) {
    router.push('/blog')
    return
  }

  post.value = data
  loading.value = false
})

// Sanitize HTML body before rendering — prevent XSS
const safeBody = computed(() =>
  post.value ? DOMPurify.sanitize(post.value.body) : ''
)

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString(locale.value, {
    year: 'numeric', month: 'long', day: 'numeric',
  })
}
</script>

<template>
  <SiteLayout>
    <div v-if="loading" class="loading-wrap">
      <p>{{ t('blog.loading') }}</p>
    </div>

    <article v-else-if="post" class="post-page">
      <div
        v-if="post.cover_url"
        class="post-hero"
        :style="`background-image: url(${post.cover_url})`"
      />
      <div class="container">
        <div class="post-header">
          <time>{{ formatDate(post.published_at) }}</time>
          <h1>{{ post.title }}</h1>
          <p v-if="post.excerpt" class="excerpt">{{ post.excerpt }}</p>
        </div>
        <!-- body is sanitized with DOMPurify before rendering -->
        <div class="post-body" v-html="safeBody" />
        <div class="post-footer">
          <RouterLink to="/blog" class="back-link">{{ t('blog.back') }}</RouterLink>
        </div>
      </div>
    </article>
  </SiteLayout>
</template>

<style scoped>
.loading-wrap { padding: 120px; text-align: center; color: #9ca3af; }
.post-page { padding-bottom: 80px; }
.post-hero {
  height: 400px;
  background: #f3f4f6 center/cover;
  margin-bottom: 0;
}
.container { max-width: 760px; margin: 0 auto; padding: 0 24px; }
.post-header { padding: 48px 0 32px; border-bottom: 1px solid #e5e7eb; margin-bottom: 40px; }
.post-header time { font-size: 13px; color: #9ca3af; }
.post-header h1 { font-size: clamp(28px, 4vw, 42px); font-weight: 700; margin: 8px 0 16px; line-height: 1.2; }
.excerpt { font-size: 18px; color: #6b7280; line-height: 1.6; margin: 0; }
.post-body { font-size: 16px; line-height: 1.8; color: #374151; }
.post-body :deep(h2) { font-size: 24px; font-weight: 700; margin: 40px 0 16px; }
.post-body :deep(h3) { font-size: 20px; font-weight: 600; margin: 32px 0 12px; }
.post-body :deep(p) { margin: 0 0 20px; }
.post-body :deep(img) { width: 100%; border-radius: 8px; margin: 24px 0; }
.post-body :deep(a) { color: #111; }
.post-footer { margin-top: 48px; padding-top: 32px; border-top: 1px solid #e5e7eb; }
.back-link { color: #6b7280; text-decoration: none; font-size: 14px; }
.back-link:hover { color: #111; }
</style>
