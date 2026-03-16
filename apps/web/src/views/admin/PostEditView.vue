<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { onBeforeRouteLeave } from 'vue-router'
import { useRoute, useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { supabase } from '@/lib/supabase'
import { useAuthStore } from '@/stores/useAuthStore'

const { t } = useI18n()
const route = useRoute()
const router = useRouter()
const auth = useAuthStore()

const isNew = computed(() => route.path.endsWith('/new'))
const postId = computed(() => route.params.id as string | undefined)

const form = ref({
  title: '',
  slug: '',
  locale: 'it',
  excerpt: '',
  body: '',
  published: false,
})
const saving = ref(false)
const loading = ref(!isNew.value)

// Unsaved changes tracking
const savedForm = ref<string>('')
const isDirty = computed(() => JSON.stringify(form.value) !== savedForm.value)

function snapshot() {
  savedForm.value = JSON.stringify(form.value)
}

onBeforeRouteLeave(() => {
  if (isDirty.value && !saving.value) {
    return confirm(t('admin.unsavedChanges'))
  }
})

// Auto-genera slug dal titolo
function generateSlug(title: string) {
  return title
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-')
}

function onTitleInput() {
  if (isNew.value) {
    form.value.slug = generateSlug(form.value.title)
  }
}

onMounted(async () => {
  if (!isNew.value && postId.value) {
    const { data } = await supabase
      .from('posts')
      .select('*')
      .eq('id', postId.value)
      .single()
    if (data) {
      form.value = {
        title: data.title,
        slug: data.slug,
        locale: data.locale,
        excerpt: data.excerpt || '',
        body: data.body,
        published: data.published,
      }
      snapshot()  // baseline for dirty tracking
    }
    loading.value = false
  }
})

async function save() {
  saving.value = true
  try {
    const payload = {
      title: form.value.title,
      slug: form.value.slug,
      locale: form.value.locale,
      excerpt: form.value.excerpt || null,
      body: form.value.body,
      published: form.value.published,
      author_id: auth.user?.id,
    }

    if (isNew.value) {
      const { error } = await supabase.from('posts').insert(payload)
      if (error) throw error
    }
    else {
      const { error } = await supabase.from('posts').update(payload).eq('id', postId.value)
      if (error) throw error
    }
    snapshot()  // reset dirty state
    router.push('/admin/posts')
  }
  catch (err) {
    alert(err instanceof Error ? err.message : t('admin.saveError'))
  }
  finally {
    saving.value = false
  }
}
</script>

<template>
  <div class="post-edit">
    <div class="edit-header">
      <h1>{{ isNew ? t('admin.newPost') : t('admin.editPost') }}</h1>
      <div class="header-actions">
        <RouterLink to="/admin/posts" class="btn-secondary">{{ t('common.cancel') }}</RouterLink>
        <button class="btn-primary" :disabled="saving || !form.title || !form.slug" @click="save">
          {{ saving ? t('admin.saving') : t('common.save') }}
        </button>
      </div>
    </div>

    <div v-if="loading" style="color: #9ca3af; padding: 32px;">{{ t('common.loading') }}</div>

    <div v-else class="edit-layout">
      <!-- Main content -->
      <div class="edit-main">
        <div class="form-group">
          <label>{{ t('admin.titleRequired') }}</label>
          <input v-model="form.title" type="text" :placeholder="t('admin.titlePlaceholder')" @input="onTitleInput">
        </div>
        <div class="form-group">
          <label>{{ t('admin.excerptLabel') }}</label>
          <input v-model="form.excerpt" type="text" :placeholder="t('admin.excerptPlaceholder')">
        </div>
        <div class="form-group">
          <label>{{ t('admin.bodyRequired') }}</label>
          <textarea v-model="form.body" rows="20" :placeholder="t('admin.bodyPlaceholder')" />
        </div>
      </div>

      <!-- Sidebar settings -->
      <div class="edit-sidebar">
        <div class="sidebar-card">
          <h3>{{ t('admin.settings') }}</h3>
          <div class="form-group">
            <label>{{ t('admin.statusLabel') }}</label>
            <label class="toggle-label">
              <input v-model="form.published" type="checkbox">
              <span>{{ form.published ? t('admin.published') : t('admin.draft') }}</span>
            </label>
          </div>
          <div class="form-group">
            <label>{{ t('admin.languageLabel') }}</label>
            <select v-model="form.locale">
              <option value="it">Italiano</option>
              <option value="en">English</option>
              <option value="de">Deutsch</option>
              <option value="fr">Français</option>
            </select>
          </div>
          <div class="form-group">
            <label>{{ t('admin.slugRequired') }}</label>
            <input v-model="form.slug" type="text" placeholder="url-del-post">
            <small>{{ form.slug ? `/blog/${form.slug}` : '' }}</small>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.post-edit { max-width: 1100px; }
.edit-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 24px; }
.edit-header h1 { font-size: 24px; font-weight: 700; margin: 0; }
.header-actions { display: flex; gap: 8px; }
.btn-primary { padding: 10px 20px; background: #111; color: #fff; border: none; border-radius: 8px; font-size: 14px; font-weight: 600; cursor: pointer; }
.btn-primary:disabled { opacity: 0.5; cursor: not-allowed; }
.btn-secondary { padding: 10px 20px; background: #f3f4f6; color: #111; text-decoration: none; border-radius: 8px; font-size: 14px; font-weight: 600; }

.edit-layout { display: grid; grid-template-columns: 1fr 280px; gap: 24px; align-items: start; }
.edit-main { background: #fff; border-radius: 12px; border: 1px solid #e5e7eb; padding: 24px; }
.form-group { margin-bottom: 20px; }
.form-group label { display: block; font-size: 13px; font-weight: 500; margin-bottom: 6px; color: #374151; }
.form-group input,
.form-group select,
.form-group textarea {
  width: 100%;
  padding: 10px 14px;
  border: 1px solid #d1d5db;
  border-radius: 8px;
  font-size: 14px;
  font-family: inherit;
  box-sizing: border-box;
  outline: none;
}
.form-group input:focus,
.form-group textarea:focus { border-color: #111; }
.form-group small { display: block; margin-top: 4px; font-size: 12px; color: #9ca3af; }

.edit-sidebar { position: sticky; top: 24px; }
.sidebar-card { background: #fff; border-radius: 12px; border: 1px solid #e5e7eb; padding: 20px; }
.sidebar-card h3 { font-size: 14px; font-weight: 600; margin: 0 0 20px; }
.toggle-label { display: flex; align-items: center; gap: 8px; cursor: pointer; }
.toggle-label input { width: auto; }
</style>
