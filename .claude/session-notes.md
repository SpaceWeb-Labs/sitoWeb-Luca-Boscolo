# Session Notes — Full Audit + Fix (2025-03)

## Summary

Full audit + fix pass on `template-site`, mirroring the workflow previously completed on `template-landing`. 16 bugs found and fixed. Template is now production-ready.

## Bugs Fixed

| # | Bug | File(s) |
|---|---|---|
| 1 | Hardcoded Italian strings across views/admin | 8 view files |
| 2 | `{{PLACEHOLDER}}` tokens in `<template>` blocks | SiteLayout, AdminLayout, PrivacyView, ContactView |
| 3 | Email notification blocking form submission | ContactView.vue |
| 4 | `v-html` without DOMPurify (XSS) | BlogPostView.vue |
| 5 | Blog locale filter with Italian fallback | BlogListView.vue |
| 6 | `requiresGuest` redirect to `/admin` instead of `/admin/posts` | router/index.ts |
| 7 | Hardcoded date locale `'it'` in ContactsView | ContactsView.vue |
| 8 | Missing reactive SEO on BlogPostView | BlogPostView.vue |
| 9 | AdminLoginView redirect to `/admin` after login | AdminLoginView.vue |
| 10 | Errors as translated strings instead of i18n keys | ContactView, AdminLoginView, PostEditView |
| 11 | `database.types.ts` missing 3 of 4 tables | database.types.ts |
| 12 | CookieBanner missing `session_id` and DB save | CookieBanner.vue |
| 13 | Migration missing `UNIQUE` on `cookie_consents.session_id` | 001_site_schema.sql |
| 14 | CI missing template-skip condition | ci.yml |
| 15 | `useQuery.ts` hardcoded Italian fallback | useQuery.ts |
| 16 | `useSeo.ts` APP_NAME fallback `'App'` (not a token) | useSeo.ts |

## Key Design Decisions

### Placeholder token placement
- Config tokens → `import.meta.env.VITE_* || '{{TOKEN}}'`
- Content tokens → `const x = '{{TOKEN}}'` in `<script setup>`
- NEVER in `<template>` — vue-tsc errors

### Fire-and-forget email pattern
```typescript
// State set to success BEFORE email call
state.value = 'success'
form.value = { ... }  // reset form
// Email is non-blocking — .catch() only
supabase.functions.invoke('send-email', { body: {...} })
  .catch(err => console.warn('[send-email]', err))
```

### Blog SEO: reactive useHead (not useSeo)
BlogPostView uses `useHead(() => ({ ... }))` (function form) so OG tags update reactively when the post loads from Supabase.

### CookieBanner session persistence
```typescript
const SESSION_ID_KEY = 'cookie_session_id'
function getOrCreateSessionId() {
  let id = localStorage.getItem(SESSION_ID_KEY)
  if (!id) { id = crypto.randomUUID(); localStorage.setItem(SESSION_ID_KEY, id) }
  return id
}
// Upsert — requires UNIQUE on cookie_consents.session_id
supabase.from('cookie_consents').upsert({ session_id: sessionId, ... }, { onConflict: 'session_id' })
```

### Error keys pattern
```typescript
// Store/view errors are i18n keys:
errorKey.value = 'contact.submitError'
// Template renders:
// {{ t(errorKey) }}
```

## Grep Verification Results (all clean)
- `{{PLACEHOLDER}}` in templates: NONE
- Hardcoded Italian strings: NONE
- `await` on email: NONE
- `v-html` without DOMPurify: NONE (safeBody computed)
- Locale file line count: 154 lines each (all 4 identical)
- TypeScript `any`: NONE

## Template-site Specific Fixes (second pass)

These were NOT covered in the common bug pass — they are unique to template-site architecture.

| # | Feature | What was wrong | Fix |
|---|---|---|---|
| A | JSON-LD Organization on HomeView | Missing entirely | Added `useHead({ script: [{ type: 'application/ld+json', ... }] })` with Organization schema |
| B | Unread count in admin sidebar | Count only in ContactsView header, not sidebar nav | AdminLayout fetches unread count via Supabase on mount, shows red badge on Contacts nav item |
| C | Unsaved changes warning (PostEditView) | No `onBeforeRouteLeave` guard | Added `isDirty` computed, `snapshot()`, `onBeforeRouteLeave` → `confirm(t('admin.unsavedChanges'))`. Added `admin.unsavedChanges` key to all 4 locales |
| D | ip_hash not populated | Client-side insert can't get real IP | Left null. Added architecture note in ContactView: move to Edge Function to hash `x-forwarded-for` header |

### Patterns from these fixes

**JSON-LD in Vue:**
```typescript
useHead({
  script: [{
    type: 'application/ld+json',
    innerHTML: JSON.stringify({ '@context': 'https://schema.org', '@type': 'Organization', ... }),
  }],
})
```

**Unsaved changes guard:**
```typescript
const savedForm = ref<string>('')
const isDirty = computed(() => JSON.stringify(form.value) !== savedForm.value)
function snapshot() { savedForm.value = JSON.stringify(form.value) }
onBeforeRouteLeave(() => {
  if (isDirty.value && !saving.value) return confirm(t('admin.unsavedChanges'))
})
// Call snapshot() after load and after successful save
```

**Unread count in AdminLayout (sidebar):**
```typescript
const unreadCount = ref(0)
onMounted(async () => {
  const { count } = await supabase
    .from('contact_submissions')
    .select('*', { count: 'exact', head: true })
    .eq('read', false)
  unreadCount.value = count ?? 0
})
```
