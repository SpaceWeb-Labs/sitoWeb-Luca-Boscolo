import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '@/stores/useAuthStore'

const ADMIN_ENABLED = import.meta.env.VITE_ENABLE_ADMIN === 'true'

const router = createRouter({
  history: createWebHistory(),
  scrollBehavior(to, _from, savedPosition) {
    if (savedPosition) return savedPosition
    if (to.hash) return { el: to.hash, behavior: 'smooth' }
    return { top: 0, behavior: 'smooth' }
  },
  routes: [
    // ─── Single Page ─────────────────────────────
    {
      path: '/',
      component: () => import('@/views/HomeView.vue'),
    },

    // ─── Standalone pages ────────────────────────
    {
      path: '/servizi',
      component: () => import('@/views/ServicesView.vue'),
    },
    {
      path: '/privacy',
      component: () => import('@/views/PrivacyView.vue'),
    },

    // ─── Blog (if needed) ────────────────────────
    {
      path: '/blog',
      component: () => import('@/views/blog/BlogListView.vue'),
    },
    {
      path: '/blog/:slug',
      component: () => import('@/views/blog/BlogPostView.vue'),
    },

    // ─── Admin (opzionale) ───────────────────────
    ...(ADMIN_ENABLED
      ? [
          {
            path: '/admin/login',
            component: () => import('@/views/admin/AdminLoginView.vue'),
            meta: { requiresGuest: true },
          },
          {
            path: '/admin',
            component: () => import('@/views/admin/AdminLayout.vue'),
            meta: { requiresAdmin: true },
            children: [
              {
                path: '',
                redirect: '/admin/posts',
              },
              {
                path: 'posts',
                component: () => import('@/views/admin/PostsView.vue'),
              },
              {
                path: 'posts/new',
                component: () => import('@/views/admin/PostEditView.vue'),
              },
              {
                path: 'posts/:id/edit',
                component: () => import('@/views/admin/PostEditView.vue'),
              },
              {
                path: 'contacts',
                component: () => import('@/views/admin/ContactsView.vue'),
              },
            ],
          },
        ]
      : []),

    // ─── Redirects for old multi-page paths ──────
    { path: '/chi-siamo', redirect: '/#chi-sono' },
    { path: '/contatti', redirect: '/#contatti' },

    // ─── 404 ─────────────────────────────────────
    {
      path: '/:pathMatch(.*)*',
      component: () => import('@/views/NotFoundView.vue'),
    },
  ],
})

// Guards
router.beforeEach(async (to) => {
  if (!to.meta.requiresAdmin && !to.meta.requiresGuest) return true

  const auth = useAuthStore()
  if (!auth.initialized) await auth.initialize()

  if (to.meta.requiresAdmin) {
    if (!auth.user) return '/admin/login'
    if (!auth.isAdmin) return '/'
  }

  if (to.meta.requiresGuest && auth.user) {
    return '/admin/posts'
  }
})

export default router
