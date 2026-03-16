<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useI18n } from 'vue-i18n'
import { supabase } from '@/lib/supabase'

const { t } = useI18n()

interface Post { id: string; title: string; published: boolean; locale: string; published_at: string | null; created_at: string }
const posts = ref<Post[]>([])
const loading = ref(true)

async function load() {
  loading.value = true
  const { data } = await supabase
    .from('posts')
    .select('id, title, published, locale, published_at, created_at')
    .order('created_at', { ascending: false })
  posts.value = (data as Post[]) || []
  loading.value = false
}

async function togglePublish(post: Post) {
  await supabase.from('posts').update({ published: !post.published }).eq('id', post.id)
  post.published = !post.published
}

async function deletePost(id: string) {
  if (!confirm(t('admin.confirmDelete'))) return
  await supabase.from('posts').delete().eq('id', id)
  posts.value = posts.value.filter(p => p.id !== id)
}

onMounted(load)
</script>

<template>
  <div class="posts-view">
    <div class="view-header">
      <h1>{{ t('admin.posts') }}</h1>
      <RouterLink to="/admin/posts/new" class="btn-primary">+ {{ t('admin.newPost') }}</RouterLink>
    </div>

    <div v-if="loading" class="loading">{{ t('common.loading') }}</div>

    <div v-else class="table-wrap">
      <table class="table">
        <thead>
          <tr>
            <th>{{ t('admin.colTitle') }}</th>
            <th>{{ t('admin.colLanguage') }}</th>
            <th>{{ t('admin.colStatus') }}</th>
            <th>{{ t('admin.colDate') }}</th>
            <th>{{ t('admin.colActions') }}</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="post in posts" :key="post.id">
            <td>{{ post.title }}</td>
            <td><span class="locale-badge">{{ post.locale.toUpperCase() }}</span></td>
            <td>
              <span :class="['status-badge', post.published ? 'published' : 'draft']">
                {{ post.published ? t('admin.published') : t('admin.draft') }}
              </span>
            </td>
            <td>{{ post.published_at ? new Date(post.published_at).toLocaleDateString() : '—' }}</td>
            <td class="actions">
              <RouterLink :to="`/admin/posts/${post.id}/edit`" class="action-btn">{{ t('common.edit') }}</RouterLink>
              <button class="action-btn" @click="togglePublish(post)">
                {{ post.published ? t('admin.unpublish') : t('admin.publish') }}
              </button>
              <button class="action-btn danger" @click="deletePost(post.id)">{{ t('common.delete') }}</button>
            </td>
          </tr>
        </tbody>
      </table>
      <p v-if="posts.length === 0" class="empty">{{ t('admin.noPosts') }}</p>
    </div>
  </div>
</template>

<style scoped>
.posts-view { max-width: 1000px; }
.view-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 24px; }
.view-header h1 { font-size: 24px; font-weight: 700; margin: 0; }
.btn-primary { padding: 10px 20px; background: #111; color: #fff; text-decoration: none; border-radius: 8px; font-size: 14px; font-weight: 600; }
.loading, .empty { color: #9ca3af; padding: 32px; text-align: center; }
.table-wrap { background: #fff; border-radius: 12px; border: 1px solid #e5e7eb; overflow: hidden; }
.table { width: 100%; border-collapse: collapse; font-size: 14px; }
.table th { background: #f9fafb; padding: 12px 16px; text-align: left; font-size: 12px; color: #6b7280; text-transform: uppercase; font-weight: 600; border-bottom: 1px solid #e5e7eb; }
.table td { padding: 12px 16px; border-bottom: 1px solid #f3f4f6; }
.table tr:last-child td { border-bottom: none; }
.locale-badge { background: #f3f4f6; padding: 2px 8px; border-radius: 4px; font-size: 11px; font-weight: 700; }
.status-badge { padding: 3px 10px; border-radius: 100px; font-size: 12px; font-weight: 600; }
.status-badge.published { background: #dcfce7; color: #16a34a; }
.status-badge.draft { background: #f3f4f6; color: #6b7280; }
.actions { display: flex; gap: 8px; }
.action-btn { padding: 4px 10px; border: 1px solid #e5e7eb; background: #fff; border-radius: 6px; cursor: pointer; font-size: 12px; color: #374151; text-decoration: none; }
.action-btn:hover { background: #f3f4f6; }
.action-btn.danger { color: #ef4444; border-color: #fecaca; }
.action-btn.danger:hover { background: #fef2f2; }
</style>
