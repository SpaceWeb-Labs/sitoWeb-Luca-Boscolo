-- Migration: 001_site_schema
-- Template: template-site
-- Tabelle: profiles, posts, contact_submissions, cookie_consents

-- ───────────────────────────────────────────
-- PROFILES (estende auth.users)
-- ───────────────────────────────────────────
CREATE TABLE public.profiles (
  id         UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  email      TEXT NOT NULL,
  full_name  TEXT,
  role       TEXT NOT NULL DEFAULT 'admin' CHECK (role IN ('admin')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "profiles: owner read/update"
  ON public.profiles FOR ALL
  USING (auth.uid() = id);

-- Auto-crea profilo al signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name)
  VALUES (
    NEW.id,
    NEW.email,
    NEW.raw_user_meta_data->>'full_name'
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- ───────────────────────────────────────────
-- POSTS (blog / news)
-- ───────────────────────────────────────────
CREATE TABLE public.posts (
  id           UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  slug         TEXT NOT NULL UNIQUE,
  locale       TEXT NOT NULL DEFAULT 'it' CHECK (locale IN ('it', 'en', 'de', 'fr')),
  title        TEXT NOT NULL,
  excerpt      TEXT,
  body         TEXT NOT NULL DEFAULT '',
  cover_url    TEXT,
  published    BOOLEAN NOT NULL DEFAULT false,
  published_at TIMESTAMPTZ,
  author_id    UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  created_at   TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at   TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Indici per query comuni
CREATE INDEX posts_slug_idx ON public.posts(slug);
CREATE INDEX posts_published_idx ON public.posts(published, published_at DESC);
CREATE INDEX posts_locale_idx ON public.posts(locale);

ALTER TABLE public.posts ENABLE ROW LEVEL SECURITY;

-- Pubblico: legge solo i post pubblicati
CREATE POLICY "posts: public read published"
  ON public.posts FOR SELECT
  USING (published = true);

-- Admin: CRUD completo
CREATE POLICY "posts: admin full access"
  ON public.posts FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- Auto-imposta published_at quando si pubblica
CREATE OR REPLACE FUNCTION public.handle_post_publish()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.published = true AND OLD.published = false THEN
    NEW.published_at = NOW();
  END IF;
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER on_post_update
  BEFORE UPDATE ON public.posts
  FOR EACH ROW EXECUTE FUNCTION public.handle_post_publish();

-- ───────────────────────────────────────────
-- CONTACT SUBMISSIONS
-- ───────────────────────────────────────────
CREATE TABLE public.contact_submissions (
  id         UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name       TEXT NOT NULL,
  email      TEXT NOT NULL,
  subject    TEXT,
  message    TEXT NOT NULL,
  read       BOOLEAN NOT NULL DEFAULT false,
  ip_hash    TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX contact_submissions_read_idx ON public.contact_submissions(read, created_at DESC);

ALTER TABLE public.contact_submissions ENABLE ROW LEVEL SECURITY;

-- Chiunque può inviare un messaggio
CREATE POLICY "contact_submissions: public insert"
  ON public.contact_submissions FOR INSERT
  WITH CHECK (true);

-- Solo admin può leggere
CREATE POLICY "contact_submissions: admin read/update"
  ON public.contact_submissions FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- ───────────────────────────────────────────
-- COOKIE CONSENTS (GDPR/LPD)
-- ───────────────────────────────────────────
CREATE TABLE public.cookie_consents (
  id          UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  session_id  TEXT NOT NULL UNIQUE,
  necessary   BOOLEAN NOT NULL DEFAULT true,
  analytics   BOOLEAN NOT NULL DEFAULT false,
  marketing   BOOLEAN NOT NULL DEFAULT false,
  ip_hash     TEXT,
  user_agent  TEXT,
  version     TEXT NOT NULL DEFAULT '1.0',
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX cookie_consents_session_id_idx ON public.cookie_consents(session_id);

ALTER TABLE public.cookie_consents ENABLE ROW LEVEL SECURITY;

-- Chiunque può inserire/aggiornare il proprio consenso (upsert via session_id)
CREATE POLICY "cookie_consents: public insert"
  ON public.cookie_consents FOR INSERT
  WITH CHECK (true);

CREATE POLICY "cookie_consents: public update own"
  ON public.cookie_consents FOR UPDATE
  USING (true)
  WITH CHECK (true);

CREATE POLICY "cookie_consents: admin read"
  ON public.cookie_consents FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = auth.uid() AND role = 'admin'
    )
  );
