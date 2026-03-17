<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { RouterView, useRouter } from 'vue-router'
import { supabase } from '@/lib/supabase'
import { useAuthStore } from '@/stores/useAuthStore'

const { t } = useI18n()
const auth = useAuthStore()
const router = useRouter()

// Config token — replaced by setup.js and available via VITE_APP_NAME at runtime
const appName = import.meta.env.VITE_APP_NAME || 'Boscolo Luca'

const unreadCount = ref(0)

onMounted(async () => {
  const { count } = await supabase
    .from('contact_submissions')
    .select('*', { count: 'exact', head: true })
    .eq('read', false)
  unreadCount.value = count ?? 0
})

async function logout() {
  await auth.signOut()
  router.push('/admin/login')
}
</script>

<template>
  <div class="admin-layout">
    <!-- Sidebar -->
    <aside class="sidebar">
      <div class="sidebar-header">
        <RouterLink to="/" class="logo">
          {{ appName }}
        </RouterLink>
        <span class="badge">Admin</span>
      </div>
      <nav class="sidebar-nav">
        <RouterLink to="/admin/posts" class="nav-item" active-class="active">
          <span>📝</span>
          {{ t('admin.posts') }}
        </RouterLink>
        <RouterLink to="/admin/contacts" class="nav-item" active-class="active">
          <span>📬</span>
          {{ t('admin.contacts') }}
          <span v-if="unreadCount > 0" class="unread-badge">{{ unreadCount }}</span>
        </RouterLink>
      </nav>
      <div class="sidebar-footer">
        <span class="user-email">{{ auth.user?.email }}</span>
        <button class="logout-btn" @click="logout">
          {{ t('auth.logout') }}
        </button>
      </div>
    </aside>

    <!-- Main -->
    <main class="admin-main">
      <RouterView />
    </main>
  </div>
</template>

<style scoped>
.admin-layout {
  display: flex;
  min-height: 100vh;
  background: #f9fafb;
}
.sidebar {
  width: 240px;
  flex-shrink: 0;
  background: #111;
  color: #fff;
  display: flex;
  flex-direction: column;
  padding: 20px 0;
  position: sticky;
  top: 0;
  height: 100vh;
}
.sidebar-header {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 0 20px 20px;
  border-bottom: 1px solid #1f2937;
  margin-bottom: 12px;
}
.logo { color: #fff; text-decoration: none; font-weight: 700; font-size: 16px; }
.badge {
  font-size: 10px;
  background: #374151;
  color: #9ca3af;
  padding: 2px 6px;
  border-radius: 4px;
}
.sidebar-nav { flex: 1; padding: 0 12px; }
.nav-item {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 10px 12px;
  border-radius: 8px;
  text-decoration: none;
  color: #9ca3af;
  font-size: 14px;
  margin-bottom: 2px;
  transition: background 0.15s, color 0.15s;
}
.nav-item:hover, .nav-item.active {
  background: #1f2937;
  color: #fff;
}
.sidebar-footer {
  padding: 20px;
  border-top: 1px solid #1f2937;
  margin-top: 12px;
}
.user-email { display: block; font-size: 12px; color: #6b7280; margin-bottom: 10px; overflow: hidden; text-overflow: ellipsis; }
.logout-btn {
  width: 100%;
  padding: 8px;
  background: #1f2937;
  color: #9ca3af;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-size: 13px;
}
.logout-btn:hover { background: #374151; color: #fff; }
.unread-badge {
  margin-left: auto;
  background: #ef4444;
  color: #fff;
  font-size: 10px;
  font-weight: 700;
  padding: 1px 6px;
  border-radius: 10px;
  min-width: 18px;
  text-align: center;
}
.admin-main { flex: 1; padding: 32px; overflow: auto; }
</style>
