<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { supabase } from '@/lib/supabase'

const { t, locale } = useI18n()

interface Submission {
  id: string
  name: string
  email: string
  subject: string | null
  message: string
  read: boolean
  created_at: string
}

const submissions = ref<Submission[]>([])
const loading = ref(true)
const selected = ref<Submission | null>(null)

async function load() {
  loading.value = true
  const { data } = await supabase
    .from('contact_submissions')
    .select('*')
    .order('created_at', { ascending: false })
  submissions.value = (data as Submission[]) || []
  loading.value = false
}

async function open(sub: Submission) {
  selected.value = sub
  if (!sub.read) {
    await supabase.from('contact_submissions').update({ read: true }).eq('id', sub.id)
    sub.read = true
  }
}

onMounted(load)
</script>

<template>
  <div class="contacts-view">
    <div class="view-header">
      <h1>{{ t('admin.contactsTitle') }}</h1>
      <span class="count">{{ submissions.filter(s => !s.read).length }} {{ t('admin.unread') }}</span>
    </div>

    <div v-if="loading" class="loading">
      {{ t('common.loading') }}
    </div>

    <div v-else class="contacts-layout">
      <!-- List -->
      <div class="contacts-list">
        <div
          v-for="sub in submissions"
          :key="sub.id"
          class="contact-item" :class="[{ unread: !sub.read, active: selected?.id === sub.id }]"
          @click="open(sub)"
        >
          <div class="contact-item-header">
            <strong>{{ sub.name }}</strong>
            <time>{{ new Date(sub.created_at).toLocaleDateString(locale) }}</time>
          </div>
          <p class="contact-item-email">
            {{ sub.email }}
          </p>
          <p class="contact-item-preview">
            {{ sub.message.slice(0, 60) }}...
          </p>
        </div>
        <p v-if="submissions.length === 0" class="empty">
          {{ t('admin.noMessages') }}
        </p>
      </div>

      <!-- Detail -->
      <div class="contact-detail">
        <div v-if="selected" class="detail-content">
          <div class="detail-header">
            <div>
              <h2>{{ selected.name }}</h2>
              <a :href="`mailto:${selected.email}`">{{ selected.email }}</a>
            </div>
            <time>{{ new Date(selected.created_at).toLocaleString(locale) }}</time>
          </div>
          <p v-if="selected.subject" class="detail-subject">
            <strong>{{ t('admin.subjectLabel') }}</strong> {{ selected.subject }}
          </p>
          <div class="detail-message">
            {{ selected.message }}
          </div>
          <a :href="`mailto:${selected.email}?subject=Re: ${selected.subject || ''}`" class="btn-reply">
            {{ t('admin.replyByEmail') }}
          </a>
        </div>
        <div v-else class="detail-empty">
          <p>{{ t('admin.selectMessage') }}</p>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.contacts-view { height: calc(100vh - 64px); display: flex; flex-direction: column; }
.view-header { display: flex; align-items: center; gap: 12px; margin-bottom: 20px; }
.view-header h1 { font-size: 24px; font-weight: 700; margin: 0; }
.count { background: #fee2e2; color: #dc2626; padding: 3px 10px; border-radius: 100px; font-size: 13px; font-weight: 600; }
.loading, .empty { color: #9ca3af; padding: 32px; text-align: center; }

.contacts-layout { display: grid; grid-template-columns: 340px 1fr; gap: 16px; flex: 1; overflow: hidden; }
.contacts-list { overflow-y: auto; background: #fff; border-radius: 12px; border: 1px solid #e5e7eb; }
.contact-item { padding: 16px; border-bottom: 1px solid #f3f4f6; cursor: pointer; transition: background 0.1s; }
.contact-item:hover { background: #f9fafb; }
.contact-item.active { background: #f3f4f6; }
.contact-item.unread .contact-item-header strong::before { content: '●'; color: #3b82f6; font-size: 8px; margin-right: 6px; vertical-align: middle; }
.contact-item-header { display: flex; justify-content: space-between; margin-bottom: 2px; font-size: 14px; }
.contact-item-header time { font-size: 11px; color: #9ca3af; }
.contact-item-email { font-size: 12px; color: #6b7280; margin: 0 0 4px; }
.contact-item-preview { font-size: 13px; color: #9ca3af; margin: 0; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }

.contact-detail { background: #fff; border-radius: 12px; border: 1px solid #e5e7eb; overflow-y: auto; }
.detail-content { padding: 32px; }
.detail-header { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 20px; }
.detail-header h2 { margin: 0 0 4px; }
.detail-header a { color: #6b7280; font-size: 14px; }
.detail-header time { font-size: 12px; color: #9ca3af; flex-shrink: 0; }
.detail-subject { font-size: 14px; color: #6b7280; margin-bottom: 20px; }
.detail-message { white-space: pre-wrap; font-size: 15px; line-height: 1.7; color: #374151; padding: 24px; background: #f9fafb; border-radius: 8px; margin-bottom: 24px; }
.btn-reply { display: inline-block; padding: 10px 20px; background: #111; color: #fff; text-decoration: none; border-radius: 8px; font-size: 14px; font-weight: 600; }
.detail-empty { display: flex; align-items: center; justify-content: center; height: 100%; color: #9ca3af; }
</style>
