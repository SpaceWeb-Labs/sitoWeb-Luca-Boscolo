# SpaceWeb Labs — Template System Context

## Who You Are Working With

This repository belongs to **SpaceWeb Labs**, a web development agency based in Canton Ticino, Switzerland. The agency targets SMEs, professional firms, and B2B companies in the Ticino/Northern Italy area, positioning on high technical quality in a market where most local agencies deliver substandard work.

I'm a software engineer with deep expertise in Vue 3, TypeScript, Supabase, and modern frontend architecture. He has strong architectural reasoning and prefers production-ready, pragmatic solutions over over-engineered ones.

---

## The Template System — Big Picture

SpaceWeb Labs operates on a **template-first agency model**. Instead of building every client project from scratch, we maintain a library of 6 battle-tested templates:

```
agency-template     → Shared technical base (monorepo config, CI/CD, hooks)
template-landing    → One-page marketing / lead generation
template-site       → Multi-page corporate site with blog and contact form   ← YOU ARE HERE
template-webapp     → Internal tools / B2B apps (invite-only auth)
template-ecommerce  → Shop with physical + digital products, Stripe Checkout
template-saas       → Multi-tenant SaaS with Stripe Subscriptions, org model
```

**Each template is a GitHub Template Repository.** When starting a client project:

1. GitHub → "Use this template" → creates a new private repo (e.g. `SpaceWeb-Labs/rossi-costruzioni`)
2. `git clone` the new repo into `~/Desktop/SpaceWeb Labs/Clients/`
3. `node scripts/setup.js` → interactive wizard that replaces all `{{PLACEHOLDER}}` tokens, configures Supabase, sets GitHub secrets, optionally deploys to Vercel

Templates are **never modified during client work** — they are the canonical source. Client repos diverge the moment `setup.js` runs.

---

## Tech Stack (Non-Negotiable)

| Layer       | Technology                            | Why                                  |
| ----------- | ------------------------------------- | ------------------------------------ |
| Frontend    | Vue 3 + TypeScript + `<script setup>` | Team expertise, Composition API      |
| State       | Pinia                                 | Official Vue state manager           |
| Routing     | Vue Router 4                          | Standard                             |
| SEO         | @unhead/vue                           | Meta tags, OG, structured data       |
| i18n        | vue-i18n 9                            | 4 locales: IT (default), EN, DE, FR  |
| Backend     | Supabase                              | DB + Auth + Storage + Edge Functions |
| Email       | Resend via Supabase Edge Function     | Reliable, developer-friendly         |
| Deploy      | Vercel                                | Zero-config, preview URLs            |
| Package mgr | pnpm workspaces                       | Monorepo speed                       |
| Build       | Vite 6                                | Fast dev/build                       |

**No exceptions on stack** — consistency across all templates is the entire point.

---

## This Template: template-site

### Purpose

Multi-page corporate website for SMEs and professional firms. Designed for:

- Company institutional sites (who we are, services, contacts)
- Studios, agencies, law firms, consultancies
- Any client who needs a professional web presence with a blog/news section
- Clients who want basic content management without a full CMS

### Key Design Decisions

**Multi-page architecture with SiteLayout** — all public pages share `SiteLayout.vue` (sticky nav + footer). The layout includes the cookie banner. Admin panel is fully separate with its own `AdminLayout.vue`.

**Optional admin panel via `VITE_ENABLE_ADMIN`** — the admin panel is not always needed. Some clients just want a static site with a contact form. Setting `VITE_ENABLE_ADMIN=false` completely removes admin routes from the build — not just hidden, but never registered. This is a hard build-time toggle, not a runtime guard.

**Blog backed by Supabase** — posts have locale support (IT/EN/DE/FR), published/draft state, and a `published_at` timestamp auto-set by a DB trigger when publishing. The public blog list filters by `locale` to show only posts in the current language.

**Contact form → DB + email** — submissions go to `contact_submissions` table AND trigger an email notification to the site owner via Resend. Email is fire-and-forget — form submission succeeds even if email fails. The admin inbox shows unread count.

**Admin is invite-only** — no public signup. The first admin user is created directly in Supabase Auth (by the developer at setup time). `useAuthStore` checks `profiles.role === 'admin'` to grant access.

**Cookie banner GDPR/LPD** — Switzerland uses LPD, consent is saved to `cookie_consents` table for audit. Session ID persisted in `localStorage` to avoid re-asking on every page load.

### File Structure

```
apps/web/src/
├── components/
│   ├── CookieBanner.vue              # GDPR/LPD consent
│   └── layout/
│       └── SiteLayout.vue            # Sticky nav + footer, wraps all public pages
├── composables/
│   ├── useSeo.ts                     # Meta tags per-page (title, description, OG)
│   └── useQuery.ts                   # Supabase query helper with loading/error state
├── lib/
│   ├── supabase.ts                   # Single Supabase client instance
│   └── database.types.ts            # Auto-generated from `pnpm db:types`
├── stores/
│   └── useAuthStore.ts               # Auth state + isAdmin computed + initialize()
├── views/
│   ├── HomeView.vue                  # Homepage
│   ├── AboutView.vue                 # Chi siamo — placeholder, customize per client
│   ├── ServicesView.vue              # Servizi — placeholder, customize per client
│   ├── ContactView.vue               # Contact form → DB + email
│   ├── PrivacyView.vue               # GDPR/LPD privacy policy
│   ├── NotFoundView.vue              # 404
│   ├── blog/
│   │   ├── BlogListView.vue          # Blog list filtered by locale
│   │   └── BlogPostView.vue          # Post detail with OG meta + sanitized v-html
│   └── admin/
│       ├── AdminLoginView.vue        # Admin login (no public signup)
│       ├── AdminLayout.vue           # Admin sidebar layout
│       ├── PostsView.vue             # Blog posts list + publish/unpublish toggle
│       ├── PostEditView.vue          # Create/edit post (title, body HTML, cover)
│       └── ContactsView.vue         # Contact submissions inbox
├── i18n/
│   ├── index.ts                      # vue-i18n setup, IT default
│   └── locales/{it,en,de,fr}.ts     # All UI strings — must be complete in all 4
├── router/index.ts                   # Routes + VITE_ENABLE_ADMIN conditional
├── App.vue                           # RouterView + CookieBanner
└── main.ts                           # App bootstrap

supabase/
├── migrations/001_site_schema.sql    # profiles, posts, contact_submissions, cookie_consents
└── functions/send-email/index.ts    # Resend transactional email

scripts/
└── setup.js                         # Interactive project setup wizard
```

### DB Schema

```sql
profiles (
  id UUID → auth.users,
  email, full_name,
  role TEXT DEFAULT 'admin'   -- only role in this template
)

posts (
  id, slug UNIQUE,
  locale TEXT,                -- 'it' | 'en' | 'de' | 'fr'
  title, excerpt, body TEXT,  -- body is HTML, must be sanitized before v-html
  cover_url TEXT,
  published BOOLEAN,
  published_at TIMESTAMPTZ,   -- auto-set by trigger on publish
  author_id → profiles
)

contact_submissions (
  id, name, email, subject, message,
  read BOOLEAN DEFAULT false, -- admin inbox unread indicator
  ip_hash TEXT,               -- anonymized IP for abuse tracking
  created_at
)

cookie_consents (
  session_id TEXT,            -- persisted in localStorage
  necessary, analytics, marketing BOOLEAN,
  ip_hash, user_agent, version
)
```

**RLS summary:**

- `posts`: anon SELECT only on `published = true`. Admin full access.
- `contact_submissions`: anon INSERT only. Admin full access (read/update/delete).
- `cookie_consents`: anon INSERT only. Admin SELECT.
- `profiles`: self only (owner read/update).

### Route Map

```
Public (SiteLayout)
├── /              → HomeView
├── /chi-siamo     → AboutView       (placeholder — client customizes)
├── /servizi       → ServicesView    (placeholder — client customizes)
├── /blog          → BlogListView    (filtered by locale)
├── /blog/:slug    → BlogPostView    (OG meta per post, sanitized v-html)
├── /contatti      → ContactView     (form → DB + email)
└── /privacy       → PrivacyView

Admin (AdminLayout) — only if VITE_ENABLE_ADMIN=true
├── /admin/login   → AdminLoginView  (requiresGuest guard)
├── /admin/posts   → PostsView       (requiresAdmin guard)
├── /admin/posts/new
├── /admin/posts/:id/edit → PostEditView
└── /admin/contacts → ContactsView  (inbox with unread count)
```

---

## Code Conventions

```typescript
// ✅ Always import from composables, never create new instances
import { supabase } from '@/lib/supabase'
import { useSeo } from '@/composables/useSeo'

// ✅ Every page/view calls useSeo — page-specific title only (not APP_NAME)
useSeo({ title: t('nav.blog'), description: t('blog.meta.description') })
// The composable appends "— APP_NAME" automatically

// ✅ Always handle Supabase errors explicitly
const { data, error } = await supabase.from('contact_submissions').insert({...})
if (error) throw error

// ✅ All UI strings go through i18n
const { t } = useI18n()
t('contact.name')  // not 'Nome'

// ✅ Store errors are i18n keys, not translated strings
error.value = 'contact.submitError'
// Component renders: {{ t(contactStore.error) }}

// ✅ Blog body is sanitized before v-html
import DOMPurify from 'dompurify'
const safeBody = computed(() => DOMPurify.sanitize(post.value.body))
// <div v-html="safeBody" />

// ✅ <script setup lang="ts"> on every component
// ✅ Scoped styles on every component
// ✅ Zero TypeScript any
```

---

## Placeholder System

All `{{PLACEHOLDER}}` tokens are replaced by `scripts/setup.js` at project init. **Never put them inside `<template>` blocks** — vue-tsc errors. Safe locations: prop defaults, `import.meta.env.*` fallbacks.

Key placeholders for this template:

```
{{PROJECT_NAME}}        Repo/project name
{{CLIENT_NAME}}         Client display name
{{APP_NAME}}            Site name shown in nav
{{APP_TAGLINE}}         Site tagline
{{CONTACT_EMAIL}}       Email receiving contact form notifications
{{COMPANY_ADDRESS}}     Footer address
{{COMPANY_VAT}}         P.IVA / UID number for footer
{{GITHUB_REPO_URL}}
{{SUPABASE_PROJECT_URL}}
{{VERCEL_URL}}
{{ADMIN_ENABLED}}       'true' or 'false' → VITE_ENABLE_ADMIN
{{DATE}}                Privacy policy date
```

---

## What "Good" Looks Like for This Template

**Performance**

- Blog list: paginated or lazy-loaded, not all posts at once
- BlogPostView: uses `useHead()` for dynamic OG tags per post
- SiteLayout nav: no unnecessary re-renders on route change

**SEO**

- Every public page has unique title + description via `useSeo()`
- BlogPostView: OG title, description, and cover image set per post
- Structured data (JSON-LD Organization) on homepage
- Blog: proper canonical URL per post

**Security**

- `v-html` on post body MUST be sanitized (DOMPurify)
- Admin routes not just hidden but never registered when `VITE_ENABLE_ADMIN=false`
- `ip_hash` in contact_submissions: MD5/SHA of IP, never raw IP (privacy)

**Admin UX**

- Unread contact submissions count visible in admin sidebar
- Post list shows published/draft status clearly
- PostEditView: unsaved changes warning before navigating away

**Content management**

- AboutView and ServicesView are intentionally thin placeholders — they are meant to be built out per client, not to have a generic layout
- Blog is the only section with real DB-backed content management

---

## Known Limitations / Improvement Areas

1. **No rich text editor** — PostEditView currently uses a plain `<textarea>` for HTML body. For real client use, should integrate a lightweight editor (Tiptap or similar).
2. **No image upload for posts** — `cover_url` is a text field for an external URL. Supabase Storage integration is missing.
3. **No pagination on blog list** — all published posts are fetched at once. Fine for small sites, not for 100+ posts.
4. **No sitemap.xml** — important for SEO, especially for the blog.
5. **No slug auto-generation** — admin must type the slug manually. Should auto-generate from title.
6. **About/Services are static placeholders** — no DB backing. Intentional: they are per-client custom pages.
7. **No search** — blog has no search functionality.
8. **No post scheduling** — `published_at` is set on publish, but there is no "schedule for future" feature.

These are deliberate omissions to keep the template lean. Implement at the client project level when needed.

---

## How to Work in This Repo

```bash
pnpm install              # Install dependencies
pnpm dev                  # Vite dev server + Supabase local
pnpm build                # Production build
pnpm typecheck            # TypeScript check
pnpm db:types             # Regenerate database.types.ts from local Supabase

supabase start            # Start local Supabase
supabase db reset         # Reset + re-run all migrations
supabase functions serve  # Test Edge Functions locally
```

**To test with admin panel:**

```bash
# .env.local
VITE_ENABLE_ADMIN=true
```

**To test without admin panel (default client config):**

```bash
# .env.local
VITE_ENABLE_ADMIN=false
```

**When modifying the template:**

- Keep all `{{PLACEHOLDER}}` tokens intact
- Never run `scripts/setup.js` — that's for client projects only
- Test changes with dummy values in `.env.local`
- Verify both `VITE_ENABLE_ADMIN=true` AND `false` build correctly
- Breaking changes → check impact on all 5 other templates
