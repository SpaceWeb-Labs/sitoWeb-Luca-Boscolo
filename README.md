# template-site — SpaceWeb Labs

Multi-page corporate website template. Blog with CMS, contact form, optional admin panel, full i18n.

**Stack:** Vue 3 · TypeScript · Vite · Pinia · vue-i18n · @unhead/vue · Supabase · Resend · Vercel

---

## What's included

### Public pages

| Route | View | Description |
|-------|------|-------------|
| `/` | HomeView | Hero, services preview, about teaser, CTA — JSON-LD Organization |
| `/chi-siamo` | AboutView | Placeholder — customize per client |
| `/servizi` | ServicesView | Placeholder — customize per client |
| `/blog` | BlogListView | Post grid filtered by locale. Published only. |
| `/blog/:slug` | BlogPostView | Post detail — DOMPurify body, dynamic OG meta per post |
| `/contatti` | ContactView | Form → DB + fire-and-forget email notification |
| `/privacy` | PrivacyView | GDPR/LPD-compliant privacy policy |
| `/:pathMatch` | NotFoundView | 404 |

### Admin panel (optional — `VITE_ENABLE_ADMIN=true`)

| Route | View | Description |
|-------|------|-------------|
| `/admin/login` | AdminLoginView | Invite-only login — no public signup |
| `/admin/posts` | PostsView | Post list — publish/unpublish toggle |
| `/admin/posts/new` | PostEditView | Create post — auto-slug from title |
| `/admin/posts/:id/edit` | PostEditView | Edit post — unsaved changes guard |
| `/admin/contacts` | ContactsView | Contact inbox — unread count badge |

### DB tables

| Table | Purpose |
|-------|---------|
| `profiles` | Admin users — `role='admin'` auto-set by trigger on signup |
| `posts` | Blog/news — slug, locale, title, excerpt, body HTML, cover_url, published |
| `contact_submissions` | Contact form — name, email, subject, message, read flag |
| `cookie_consents` | GDPR/LPD audit trail — per-session consent preferences |

### Internationalization

All UI strings are translated. Supported locales: **it, en, de, fr** (IT default). The locale switcher is in the nav. Blog posts are filtered by locale — a post written in `it` appears only when the UI language is Italian.

---

## Status

| Area | Status | Notes |
|------|--------|-------|
| Public pages (Home, About, Services, Blog, Contact, Privacy, 404) | Ready | About/Services are intentional placeholders |
| Blog CMS (create, edit, publish, locale) | Ready | |
| Contact form → DB + email | Ready | Needs Resend API key |
| Admin panel | Ready | Enable via `VITE_ENABLE_ADMIN=true` |
| Cookie banner (GDPR/LPD) + DB audit | Ready | |
| i18n — 4 locales, all keys | Complete | |
| SEO (useSeo, OG, Twitter, canonical, JSON-LD) | Ready | |
| RLS on all DB tables | Ready | |
| CI/CD (GitHub Actions) | Ready | Skipped on template repos, active on client repos |
| Rich text editor | Not included | Integrate Tiptap at client level |
| Image upload | Not included | `cover_url` is a URL field — wire to Supabase Storage at client level |
| Blog pagination | Not included | Add `.range()` to the Supabase query when needed |
| Sitemap.xml | Not included | Generate at client level for SEO-critical sites |

---

## Setup guide

### Prerequisites

```bash
node --version      # 20+
pnpm --version      # 9+
supabase --version  # Supabase CLI — install: brew install supabase/tap/supabase
```

---

### Step 1 — Create accounts

You need three services. All have free tiers.

**Supabase** — database + auth + edge functions
1. [supabase.com](https://supabase.com) → New project
2. Note your **Project URL** and **anon key** (Settings → API)
3. Note your **project ref** (Settings → General) — needed for CLI

**Resend** — transactional email (contact form notifications)
1. [resend.com](https://resend.com) → Create account
2. Domains → Add domain → verify DNS
3. API Keys → Create key → save it (`RESEND_API_KEY`)
4. Decide the `FROM_EMAIL` address (e.g. `noreply@clientdomain.com`)

**Vercel** — hosting
1. [vercel.com](https://vercel.com) → Import Git repository
2. Framework preset: **Vite**
3. Root directory: `apps/web`
4. Do not deploy yet — add env vars first (step 5)

---

### Step 2 — Clone and install

```bash
git clone <repo-url>
cd <project-name>
pnpm install
```

---

### Step 3 — Run the setup script

Replaces all `{{PLACEHOLDER}}` tokens in source files with client-specific values:

```bash
pnpm setup
```

The script asks for app name, tagline, contact email, company address, hero copy, etc.
See the [Placeholders reference](#placeholders-reference) below for the full list.

---

### Step 4 — Configure environment variables

```bash
cp .env.example apps/web/.env.local
```

Edit `apps/web/.env.local`:

```env
# Supabase
VITE_SUPABASE_URL=https://YOUR_PROJECT.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key

# App identity
VITE_APP_NAME=Rossi Costruzioni
VITE_APP_TAGLINE=Costruiamo il tuo futuro
VITE_APP_URL=https://rossicotruzioni.ch
VITE_CONTACT_EMAIL=info@rossiconstruzioni.ch

# Admin panel (set to true to enable)
VITE_ENABLE_ADMIN=false
```

---

### Step 5 — Run the database migration

```bash
# Link to your Supabase project
supabase link --project-ref YOUR_PROJECT_REF

# Push the migration (creates all 4 tables with RLS policies)
supabase db push
```

Migration file: `supabase/migrations/001_site_schema.sql`

---

### Step 6 — Deploy the Edge Function

The `send-email` function sends admin notifications via Resend when a contact form is submitted.

```bash
# Set secrets in Supabase (never committed to git)
supabase secrets set RESEND_API_KEY=re_yourkey
supabase secrets set FROM_EMAIL=noreply@clientdomain.com

# Deploy
supabase functions deploy send-email
```

---

### Step 7 — Start local development

```bash
pnpm dev
# → http://localhost:5173
```

---

### Step 8 — Enable the admin panel (optional)

```bash
# apps/web/.env.local
VITE_ENABLE_ADMIN=true
```

Then create the first admin user:
1. Supabase Dashboard → Authentication → Users → **Add user**
2. The `on_auth_user_created` trigger auto-creates a `profiles` row with `role='admin'`
3. Access `/admin/login`

> When `VITE_ENABLE_ADMIN=false`, admin routes are **never registered** in the router — not just hidden from the UI.

---

### Step 9 — Deploy to Vercel

In Vercel project settings → **Environment Variables**, add all vars from `.env.local`:

```
VITE_SUPABASE_URL
VITE_SUPABASE_ANON_KEY
VITE_APP_NAME
VITE_APP_TAGLINE
VITE_APP_URL
VITE_CONTACT_EMAIL
VITE_ENABLE_ADMIN
```

Push to `main` — Vercel deploys automatically.

---

### Step 10 — Add GitHub secrets for CI

In GitHub repo → **Settings → Secrets and variables → Actions**, add:

```
VITE_SUPABASE_URL
VITE_SUPABASE_ANON_KEY
```

These are required for the CI build step to pass.

---

## Development commands

From the project root:

```bash
pnpm dev          # Start dev server → http://localhost:5173
pnpm build        # Production build
pnpm typecheck    # TypeScript check only (vue-tsc --noEmit)
pnpm setup        # Run placeholder setup script
```

After modifying the DB schema:

```bash
supabase db reset                                                         # Reset local DB
supabase gen types typescript --linked > apps/web/src/lib/database.types.ts  # Regenerate types
```

Supabase local:

```bash
supabase start            # Start local Supabase (Docker)
supabase db reset         # Reset + re-run all migrations
supabase functions serve  # Test Edge Functions locally
```

---

## Project structure

```
template-site/
├── apps/web/                          # Vue 3 app
│   └── src/
│       ├── components/
│       │   ├── CookieBanner.vue       # GDPR/LPD consent — session_id in localStorage, DB upsert
│       │   └── layout/
│       │       └── SiteLayout.vue     # Sticky nav + footer — wraps all public pages
│       ├── composables/
│       │   ├── useSeo.ts              # Per-page meta: title, description, OG, Twitter, noIndex
│       │   └── useQuery.ts            # Supabase query helper with loading/error state
│       ├── lib/
│       │   ├── supabase.ts            # Single typed Supabase client
│       │   └── database.types.ts      # Auto-generated — regenerate with supabase gen types
│       ├── stores/
│       │   └── useAuthStore.ts        # Auth state + isAdmin computed + initialize()
│       ├── views/
│       │   ├── HomeView.vue           # Hero, services preview, about teaser, JSON-LD
│       │   ├── AboutView.vue          # Placeholder — customize per client
│       │   ├── ServicesView.vue       # Placeholder — customize per client
│       │   ├── ContactView.vue        # Form → DB + fire-and-forget Resend email
│       │   ├── PrivacyView.vue        # GDPR/LPD privacy policy
│       │   ├── NotFoundView.vue       # 404
│       │   ├── blog/
│       │   │   ├── BlogListView.vue   # Posts grid — strict locale filter, no fallback
│       │   │   └── BlogPostView.vue   # Post detail — DOMPurify body, reactive OG meta
│       │   └── admin/                 # Only registered when VITE_ENABLE_ADMIN=true
│       │       ├── AdminLoginView.vue # Login — requiresGuest guard → /admin/posts
│       │       ├── AdminLayout.vue    # Sidebar — unread count badge on Contacts
│       │       ├── PostsView.vue      # Post list — publish/unpublish toggle
│       │       ├── PostEditView.vue   # Create/edit — auto-slug, unsaved changes guard
│       │       └── ContactsView.vue   # Contact inbox — mark as read
│       ├── i18n/
│       │   ├── index.ts               # vue-i18n setup, IT default
│       │   └── locales/               # it.ts · en.ts · de.ts · fr.ts — always keep in sync
│       ├── router/index.ts            # Routes + VITE_ENABLE_ADMIN conditional
│       ├── env.d.ts                   # Vite env var type declarations
│       ├── App.vue                    # RouterView + CookieBanner
│       └── main.ts                    # App bootstrap
├── supabase/
│   ├── migrations/
│   │   └── 001_site_schema.sql        # profiles, posts, contact_submissions, cookie_consents
│   └── functions/
│       └── send-email/index.ts        # Edge Function — Resend email via Deno
├── scripts/
│   └── setup.js                       # Placeholder replacement script (run once per client)
├── .env.example                       # Env var template — commit this, not .env.local
├── .github/workflows/ci.yml           # CI: quality → test → build
└── package.json                       # Root scripts
```

---

## Placeholders reference

All tokens below are replaced by `scripts/setup.js` (or `pnpm setup`).

> **Rule:** Never put `{{PLACEHOLDER}}` inside `<template>` blocks — vue-tsc errors.
> Use script-level `const` declarations or `import.meta.env.VITE_*` fallbacks only.

| Token | Used in | Replaced with |
|-------|---------|---------------|
| `{{PROJECT_NAME}}` | CLAUDE.md | Repo/project name (e.g. `rossi-costruzioni`) |
| `{{CLIENT_NAME}}` | CLAUDE.md | Client display name (e.g. `Rossi Costruzioni Sagl`) |
| `{{APP_NAME}}` | script vars, useSeo | Site name shown in nav + page titles |
| `{{APP_TAGLINE}}` | i18n, script vars | Site tagline shown in footer and homepage meta |
| `{{HERO_TITLE}}` | i18n | Hero section headline |
| `{{HERO_SUBTITLE}}` | i18n | Hero section subtitle |
| `{{ABOUT_TEXT}}` | i18n | About teaser text on homepage |
| `{{CONTACT_EMAIL}}` | `VITE_CONTACT_EMAIL` env var | Email receiving contact form notifications |
| `{{COMPANY_ADDRESS}}` | script vars | Footer + contact page address |
| `{{COMPANY_NAME}}` | script vars | Legal name for privacy policy |
| `{{COMPANY_VAT}}` | script vars | P.IVA / UID in footer |
| `{{DATE}}` | script vars | Privacy policy effective date |
| `{{GITHUB_REPO_URL}}` | CLAUDE.md | GitHub repo URL |
| `{{SUPABASE_PROJECT_URL}}` | CLAUDE.md | Supabase project URL |
| `{{VERCEL_URL}}` | CLAUDE.md | Vercel deployment URL |
| `{{ADMIN_ENABLED}}` | `VITE_ENABLE_ADMIN` env var | `'true'` or `'false'` |

---

## Extending the template

The template is designed to be extended at the client project level. Do not modify the template repo directly — use it as the starting point.

### Add a new public page

1. Create `apps/web/src/views/NewView.vue` — import `SiteLayout`, call `useSeo()`
2. Add a route in `router/index.ts`
3. Add nav link in `SiteLayout.vue` → `navLinks` array (+ i18n key)
4. Add i18n keys to all 4 locale files

### Add a new admin section

1. Create `apps/web/src/views/admin/NewAdminView.vue`
2. Add a child route under `/admin` in `router/index.ts`
3. Add a nav item in `AdminLayout.vue` → sidebar nav

### Add a new DB table

```bash
supabase migration new add_products_table
# edit the generated SQL file
supabase db push
pnpm db:types   # regenerate database.types.ts
```

### Add an external integration

Create a new Supabase Edge Function:

```bash
supabase functions new my-integration
# implement in supabase/functions/my-integration/index.ts
supabase functions deploy my-integration
```

Call it from the frontend with `supabase.functions.invoke('my-integration', { body: {...} })`.

Common patterns: CRM sync (HubSpot, Pipedrive), Slack notifications, webhooks to Zapier/Make.

### Add a rich text editor (Tiptap)

```bash
pnpm add @tiptap/vue-3 @tiptap/starter-kit
```

Replace the `<textarea v-model="form.body">` in `PostEditView.vue` with a Tiptap `<EditorContent>` component.

### Add Supabase Storage for image uploads

1. Create a `post-covers` bucket in Supabase Dashboard → Storage
2. Add an upload input in `PostEditView.vue`
3. On upload: `supabase.storage.from('post-covers').upload(filename, file)`
4. Save the public URL to `cover_url`

---

## Analytics integration

The cookie banner dispatches a native DOM event on every consent action. Use it to initialize or disable your analytics provider:

```typescript
window.addEventListener('cookie-consent', (e: CustomEvent) => {
  const { analytics, marketing } = e.detail
  if (analytics) {
    // initialize GA4, Plausible, PostHog, Fathom, etc.
  }
  if (marketing) {
    // initialize Meta Pixel, LinkedIn Insight, etc.
  }
})
```

---

## Code conventions

```typescript
// Every page/view calls useSeo — page-specific title only (APP_NAME is appended automatically)
useSeo({ title: t('nav.about'), description: t('about.metaDescription') })

// All UI strings go through i18n — zero hardcoded text
const { t } = useI18n()
t('contact.name')   // not 'Nome'

// Errors are stored as i18n keys, not translated strings
errorKey.value = 'contact.submitError'
// Template: {{ t(errorKey) }}

// Blog body is always sanitized before v-html
import DOMPurify from 'dompurify'
const safeBody = computed(() => DOMPurify.sanitize(post.value.body))
// <div v-html="safeBody" />

// Placeholders in script only — never in <template>
const appName = import.meta.env.VITE_APP_NAME || '{{APP_NAME}}'  // config token
const address = '{{COMPANY_ADDRESS}}'                              // content token
```

---

## Admin guards

| Guard | Behavior |
|-------|----------|
| `requiresAdmin` | Unauthenticated → `/admin/login`. Authenticated non-admin → `/` |
| `requiresGuest` | Already authenticated admin → `/admin/posts` |

---

## CI/CD pipeline

```
push to main / PR
    └── quality (ESLint + TypeScript)
            └── test (Vitest)
                    └── build (pnpm build)
```

All jobs have `if: "!contains(github.repository, 'template-')"` — **skipped on this template repo, active on every client repo.**

Vercel deploys independently on every push to `main`. PRs get preview URLs automatically.

---

## Known limitations

These are deliberate omissions to keep the template lean. Implement at client project level when needed.

1. **No rich text editor** — `PostEditView` uses a plain `<textarea>` for HTML body. Integrate Tiptap when needed.
2. **No image upload** — `cover_url` is a free-text URL. Wire to Supabase Storage at client level.
3. **No blog pagination** — all published posts fetched at once. Add `.range()` to the Supabase query for sites with 50+ posts.
4. **No sitemap.xml** — generate at client level for SEO-critical sites (e.g. with `vite-plugin-sitemap`).
5. **No blog search** — add client-side filter or Supabase full-text search when needed.
6. **No post scheduling** — `published_at` is set on publish. No future-date scheduling.
7. **About/Services are static placeholders** — no DB backing. These are per-client custom pages by design.
8. **`ip_hash` is always null** — the client cannot safely hash the real IP. Move form submission to an Edge Function to read `x-forwarded-for` and hash it server-side if needed.
