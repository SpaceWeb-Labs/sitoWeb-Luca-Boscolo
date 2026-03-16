# {{PROJECT_NAME}} — Sito Aziendale

## Progetto
- **Cliente:** {{CLIENT_NAME}}
- **Tipo:** template-site (sito aziendale multi-pagina)
- **Repository:** {{GITHUB_REPO_URL}}
- **Supabase Project:** {{SUPABASE_PROJECT_URL}}
- **Vercel URL:** {{VERCEL_URL}}
- **Admin abilitato:** {{ADMIN_ENABLED}} (VITE_ENABLE_ADMIN)

## Pagine
```
Pubbliche
├── /              → HomeView
├── /chi-siamo     → AboutView (placeholder — personalizzare)
├── /servizi       → ServicesView (placeholder — personalizzare)
├── /blog          → BlogListView (da DB: tabella posts)
├── /blog/:slug    → BlogPostView
├── /contatti      → ContactView (form → DB + email)
└── /privacy       → PrivacyView (template LPD/GDPR)

Admin (se VITE_ENABLE_ADMIN=true)
├── /admin/login   → AdminLoginView
├── /admin/posts   → PostsView (lista + pubblica/nascondi)
├── /admin/posts/new → PostEditView
├── /admin/posts/:id/edit → PostEditView
└── /admin/contacts → ContactsView (inbox messaggi)
```

## DB Tables
```
profiles           → admin users (role: 'admin')
posts              → blog/news (slug, locale, title, body, published)
contact_submissions→ form contatti (name, email, subject, message, read)
cookie_consents    → audit GDPR/LPD
```

## Stack
- Vue 3 + TypeScript + Composition API + `<script setup>`
- vue-i18n: 4 lingue (it, en, de, fr) — TUTTE le stringhe UI tradotte
- @unhead/vue: SEO meta tags — ogni pagina usa `useSeo()`
- Supabase: DB + Auth (solo admin) + Edge Function email
- Resend: email transazionali via supabase/functions/send-email
- Tailwind CSS v4

## Convenzioni
- ZERO stringhe hardcoded — sempre `t('chiave')`
- ZERO `any` TypeScript
- Ogni pagina: `useSeo({ title, description })`
- Form contatti: salva in DB + notifica email
- Admin: sempre verificare `isAdmin` via `useAuthStore`
- Blog body: HTML sanitizzato prima di `v-html`

## Variabili {{PLACEHOLDER}} da sostituire
```
{{PROJECT_NAME}}      → nome del progetto
{{CLIENT_NAME}}       → nome del cliente
{{APP_NAME}}          → nome visualizzato nell'header
{{APP_TAGLINE}}       → tagline del sito
{{CONTACT_EMAIL}}     → email di contatto
{{COMPANY_ADDRESS}}   → indirizzo azienda
{{HERO_TITLE}}        → titolo hero homepage
{{HERO_SUBTITLE}}     → sottotitolo hero
{{ABOUT_TEXT}}        → testo about teaser
{{DATE}}              → data privacy policy
{{COMPANY_NAME}}      → nome legale per privacy
```

## Comandi
```bash
pnpm dev                                    # sviluppo locale
pnpm db:types                               # rigenera types dopo migration
supabase migration new <nome>               # nuova migration
supabase functions deploy send-email        # deploy edge function email
```

## Admin setup
1. Creare utente in Supabase Auth Dashboard
2. Il trigger crea automaticamente il profilo con role='admin'
3. Impostare VITE_ENABLE_ADMIN=true nel .env.local
4. Accedere su /admin/login
