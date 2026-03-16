<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import SiteLayout from '@/components/layout/SiteLayout.vue'
import { useSeo } from '@/composables/useSeo'
import { supabase } from '@/lib/supabase'

const { t, locale } = useI18n()
useSeo({ title: t('blog.title'), description: t('blog.subtitle') })

interface Post {
  id: string
  slug: string
  title: string
  excerpt: string | null
  cover_url: string | null
  published_at: string | null
  locale: string
}

const posts = ref<Post[]>([])
const loading = ref(true)

onMounted(async () => {
  const { data } = await supabase
    .from('posts')
    .select('id, slug, title, excerpt, cover_url, published_at, locale')
    .eq('published', true)
    .order('published_at', { ascending: false })

  posts.value = (data as Post[]) || []
  loading.value = false
})

// Filter strictly by current locale — only show posts in the selected language
const visiblePosts = computed(() =>
  posts.value.filter(p => p.locale === locale.value),
)

function formatDate(dateStr: string | null) {
  if (!dateStr)
    return ''
  return new Date(dateStr).toLocaleDateString(locale.value, {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
}
</script>

<template>
  <SiteLayout>
    <section class="blog-page">
      <div class="container">
        <div class="page-header">
          <h1>{{ t('blog.title') }}</h1>
          <p>{{ t('blog.subtitle') }}</p>
        </div>

        <div v-if="loading" class="loading">
          {{ t('common.loading') }}
        </div>

        <div v-else-if="visiblePosts.length === 0" class="empty">
          <p>{{ t('blog.empty') }}</p>
        </div>

        <div v-else class="posts-grid">
          <RouterLink
            v-for="post in visiblePosts"
            :key="post.id"
            :to="`/blog/${post.slug}`"
            class="post-card"
          >
            <div
              class="post-cover"
              :style="post.cover_url ? `background-image: url(${post.cover_url})` : ''"
            />
            <div class="post-body">
              <time class="post-date">{{ formatDate(post.published_at) }}</time>
              <h2>{{ post.title }}</h2>
              <p v-if="post.excerpt">
                {{ post.excerpt }}
              </p>
              <span class="read-more">{{ t('blog.readMore') }} →</span>
            </div>
          </RouterLink>
        </div>
      </div>
    </section>
  </SiteLayout>
</template>

<style scoped>
.blog-page { padding: 80px 0; }
.container { max-width: 1200px; margin: 0 auto; padding: 0 24px; }
.page-header { text-align: center; margin-bottom: 64px; }
.page-header h1 { font-size: 42px; font-weight: 700; margin: 0 0 12px; }
.page-header p { color: #6b7280; font-size: 16px; }
.loading, .empty { text-align: center; padding: 64px; color: #9ca3af; }

.posts-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 32px;
}
.post-card {
  text-decoration: none;
  color: inherit;
  border-radius: 12px;
  overflow: hidden;
  border: 1px solid #e5e7eb;
  transition: box-shadow 0.2s;
}
.post-card:hover { box-shadow: 0 8px 24px rgba(0,0,0,0.08); }
.post-cover {
  aspect-ratio: 16/9;
  background: #f3f4f6 center/cover;
}
.post-body { padding: 24px; }
.post-date { font-size: 12px; color: #9ca3af; }
.post-body h2 { font-size: 18px; font-weight: 600; margin: 8px 0; line-height: 1.3; }
.post-body p { font-size: 14px; color: #6b7280; line-height: 1.6; margin: 0 0 16px; }
.read-more { font-size: 13px; font-weight: 600; color: #111; }

@media (max-width: 1024px) { .posts-grid { grid-template-columns: repeat(2, 1fr); } }
@media (max-width: 640px) { .posts-grid { grid-template-columns: 1fr; } }
</style>
