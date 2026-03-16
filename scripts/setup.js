#!/usr/bin/env node
// SpaceWeb Labs — Project Setup Wizard
// Uso: node scripts/setup.js
// Prerequisiti: gh (autenticato), supabase (autenticato), pnpm

import { createInterface } from 'readline'
import { execSync, spawnSync } from 'child_process'
import { readFileSync, writeFileSync, readdirSync, statSync, existsSync } from 'fs'
import { join, extname } from 'path'
import { randomBytes } from 'crypto'

// ─────────────────────────────────────────
// UTILS
// ─────────────────────────────────────────

const c = {
  reset: '\x1b[0m',
  bold: '\x1b[1m',
  dim: '\x1b[2m',
  green: '\x1b[32m',
  blue: '\x1b[34m',
  yellow: '\x1b[33m',
  red: '\x1b[31m',
  cyan: '\x1b[36m',
  gray: '\x1b[90m',
}

const ok  = (msg) => console.log(`${c.green}✓${c.reset} ${msg}`)
const err = (msg) => console.log(`${c.red}✗${c.reset} ${msg}`)
const info= (msg) => console.log(`${c.blue}→${c.reset} ${msg}`)
const warn= (msg) => console.log(`${c.yellow}!${c.reset} ${msg}`)
const dim = (msg) => console.log(`${c.gray}  ${msg}${c.reset}`)

function header(text) {
  const line = '─'.repeat(48)
  console.log(`\n${c.bold}${c.cyan}${line}${c.reset}`)
  console.log(`${c.bold}  ${text}${c.reset}`)
  console.log(`${c.cyan}${line}${c.reset}\n`)
}

function section(text) {
  console.log(`\n${c.bold}${text}${c.reset}`)
  console.log(`${c.gray}${'─'.repeat(text.length)}${c.reset}`)
}

function run(cmd, opts = {}) {
  try {
    const result = execSync(cmd, {
      encoding: 'utf8',
      stdio: opts.silent ? 'pipe' : 'inherit',
      ...opts,
    })
    return result?.trim()
  } catch (e) {
    if (opts.ignoreError) return null
    throw e
  }
}

function runJSON(cmd) {
  try {
    const out = execSync(cmd, { encoding: 'utf8', stdio: 'pipe' })
    return JSON.parse(out)
  } catch {
    return null
  }
}

function generatePassword(length = 24) {
  return randomBytes(length).toString('base64').replace(/[^a-zA-Z0-9]/g, '').slice(0, length)
}

function toSlug(str) {
  return str
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-')
}

// ─────────────────────────────────────────
// PROMPT
// ─────────────────────────────────────────

function prompt(rl, question, defaultVal = '') {
  return new Promise((resolve) => {
    const hint = defaultVal ? ` ${c.gray}(${defaultVal})${c.reset}` : ''
    rl.question(`${c.bold}${question}${c.reset}${hint}: `, (answer) => {
      resolve(answer.trim() || defaultVal)
    })
  })
}

function promptYN(rl, question, defaultYes = true) {
  return new Promise((resolve) => {
    const hint = defaultYes ? ' [Y/n]' : ' [y/N]'
    rl.question(`${c.bold}${question}${c.reset}${c.gray}${hint}${c.reset}: `, (answer) => {
      const a = answer.trim().toLowerCase()
      if (!a) resolve(defaultYes)
      else resolve(a === 'y' || a === 'yes')
    })
  })
}

// ─────────────────────────────────────────
// CHECK PREREQUISITES
// ─────────────────────────────────────────

function checkPrerequisites() {
  section('Controllo prerequisiti')

  const checks = [
    {
      name: 'gh (GitHub CLI)',
      cmd: 'gh --version',
      installHint: 'brew install gh && gh auth login',
    },
    {
      name: 'supabase CLI',
      cmd: 'supabase --version',
      installHint: 'brew install supabase/tap/supabase && supabase login',
    },
    {
      name: 'pnpm',
      cmd: 'pnpm --version',
      installHint: 'npm install -g pnpm',
    },
  ]

  let allOk = true

  for (const check of checks) {
    const result = runJSON(`${check.cmd} 2>/dev/null`) !== null
      ? true
      : (() => {
          try { execSync(check.cmd, { stdio: 'pipe' }); return true } catch { return false }
        })()

    if (result) {
      ok(check.name)
    } else {
      err(`${check.name} non trovato`)
      dim(`Installa con: ${check.installHint}`)
      allOk = false
    }
  }

  // Check gh auth
  if (allOk) {
    const ghStatus = run('gh auth status 2>&1', { silent: true, ignoreError: true })
    if (!ghStatus || ghStatus.includes('not logged')) {
      err('gh non autenticato')
      dim('Esegui: gh auth login')
      allOk = false
    } else {
      ok('gh autenticato')
    }
  }

  // Check supabase auth
  if (allOk) {
    const sbStatus = run('supabase projects list 2>&1', { silent: true, ignoreError: true })
    if (!sbStatus || sbStatus.includes('not logged') || sbStatus.includes('Unauthorized')) {
      err('supabase non autenticato')
      dim('Esegui: supabase login')
      allOk = false
    } else {
      ok('supabase autenticato')
    }
  }

  if (!allOk) {
    console.log(`\n${c.red}${c.bold}Setup interrotto. Risolvi i prerequisiti e riprova.${c.reset}\n`)
    process.exit(1)
  }
}

// ─────────────────────────────────────────
// REPLACE PLACEHOLDERS
// ─────────────────────────────────────────

const PLACEHOLDER_EXTENSIONS = ['.ts', '.vue', '.md', '.json', '.toml', '.html', '.css', '.js', '.sql', '.txt', '.env', '.example']
const SKIP_DIRS = ['node_modules', '.git', 'dist', '.supabase', 'supabase/.branches']

function replacePlaceholders(dir, replacements) {
  const entries = readdirSync(dir)

  for (const entry of entries) {
    const fullPath = join(dir, entry)

    // Skip hidden dirs except .claude and .github
    if (entry.startsWith('.') && entry !== '.claude' && entry !== '.github' && entry !== '.env.example') continue
    if (SKIP_DIRS.includes(entry)) continue

    const stat = statSync(fullPath)

    if (stat.isDirectory()) {
      replacePlaceholders(fullPath, replacements)
    } else if (PLACEHOLDER_EXTENSIONS.includes(extname(entry)) || entry === '.env.example' || entry === 'CLAUDE.md') {
      let content = readFileSync(fullPath, 'utf8')
      let changed = false

      for (const [placeholder, value] of Object.entries(replacements)) {
        const regex = new RegExp(placeholder.replace(/[{}]/g, '\\$&'), 'g')
        if (regex.test(content)) {
          content = content.replace(regex, value)
          changed = true
        }
      }

      if (changed) {
        writeFileSync(fullPath, content, 'utf8')
      }
    }
  }
}

// ─────────────────────────────────────────
// SUPABASE ORG SELECTION
// ─────────────────────────────────────────

async function selectSupabaseOrg(rl) {
  const orgs = runJSON('supabase orgs list --output json')

  if (!orgs || orgs.length === 0) {
    warn('Nessuna org Supabase trovata. Usa la tua org personale.')
    return null
  }

  if (orgs.length === 1) {
    ok(`Org Supabase: ${orgs[0].name}`)
    return orgs[0].id
  }

  console.log('\nOrganizzazioni Supabase disponibili:')
  orgs.forEach((org, i) => console.log(`  ${c.bold}${i + 1}${c.reset}. ${org.name} ${c.gray}(${org.id})${c.reset}`))

  const choice = await prompt(rl, 'Seleziona org (numero)', '1')
  const idx = parseInt(choice) - 1
  return orgs[Math.max(0, Math.min(idx, orgs.length - 1))].id
}

// ─────────────────────────────────────────
// WRITE .env.local
// ─────────────────────────────────────────

function writeEnvLocal(answers, supabaseUrl, anonKey) {
  const adminFlag = answers.enableAdmin ? 'true' : 'false'

  const env = `# Generato da setup.js — ${new Date().toISOString()}
# NON committare questo file su GitHub

VITE_SUPABASE_URL=${supabaseUrl}
VITE_SUPABASE_ANON_KEY=${anonKey}

VITE_APP_NAME=${answers.appName}
VITE_APP_URL=${answers.appUrl || 'https://example.com'}
VITE_APP_TAGLINE=${answers.appTagline || ''}

VITE_CONTACT_EMAIL=${answers.contactEmail}

# Abilita area admin CMS
VITE_ENABLE_ADMIN=${adminFlag}

# Resend (email) — imposta dopo: supabase secrets set RESEND_API_KEY=xxx
# FROM_EMAIL=${answers.contactEmail}
`

  writeFileSync('.env.local', env, 'utf8')
  ok('.env.local creato con credenziali reali')
}

// ─────────────────────────────────────────
// SET GITHUB SECRETS
// ─────────────────────────────────────────

function setGithubSecrets(projectRef, dbPassword) {
  const secrets = [
    ['SUPABASE_PROJECT_REF', projectRef],
    ['SUPABASE_DB_PASSWORD', dbPassword],
  ]

  // Get Supabase access token from file if available
  const tokenPath = `${process.env.HOME}/.supabase/access-token`
  if (existsSync(tokenPath)) {
    const token = readFileSync(tokenPath, 'utf8').trim()
    if (token) secrets.push(['SUPABASE_ACCESS_TOKEN', token])
  }

  for (const [key, value] of secrets) {
    try {
      run(`gh secret set ${key} --body "${value}"`, { silent: true })
      ok(`GitHub Secret: ${key}`)
    } catch {
      warn(`Non riuscito a impostare ${key} — impostalo manualmente`)
    }
  }
}

// ─────────────────────────────────────────
// MAIN
// ─────────────────────────────────────────

async function main() {
  header('SpaceWeb Labs — Project Setup Wizard')

  // 1. Check prerequisites
  checkPrerequisites()

  // 2. Gather project info
  section('Informazioni progetto')

  const rl = createInterface({ input: process.stdin, output: process.stdout })

  // Detect template type from CLAUDE.md
  let templateType = 'site'
  if (existsSync('.claude/CLAUDE.md')) {
    const claudeMd = readFileSync('.claude/CLAUDE.md', 'utf8')
    const match = claudeMd.match(/Tipo:.*template-(\w+)/)
    if (match) templateType = match[1]
  }
  info(`Tipo template rilevato: ${c.bold}template-${templateType}${c.reset}`)

  const answers = {}

  answers.clientName   = await prompt(rl, 'Nome cliente (es. Rossi Costruzioni Sagl)')
  answers.appName      = await prompt(rl, 'Nome app/sito (es. Rossi Costruzioni)', answers.clientName)
  answers.appTagline   = await prompt(rl, 'Tagline (opzionale)')
  answers.contactEmail = await prompt(rl, 'Email di contatto (es. info@rossi.ch)')
  answers.address      = await prompt(rl, 'Indirizzo azienda (es. Via Roma 1, 6900 Lugano, CH)')
  answers.appUrl       = await prompt(rl, 'URL produzione (es. https://www.rossi.ch)')

  // Repo name
  const defaultSlug = toSlug(answers.clientName).replace(/\s+/g, '-')
  answers.repoSlug = await prompt(rl, 'Nome repo GitHub (slug)', `cliente-${defaultSlug}`)

  // Admin?
  if (templateType === 'site') {
    answers.enableAdmin = await promptYN(rl, 'Abilitare area admin CMS?', false)
  }

  // Confirm
  console.log(`\n${c.bold}Riepilogo:${c.reset}`)
  console.log(`  Cliente:    ${c.cyan}${answers.clientName}${c.reset}`)
  console.log(`  App:        ${c.cyan}${answers.appName}${c.reset}`)
  console.log(`  Email:      ${c.cyan}${answers.contactEmail}${c.reset}`)
  console.log(`  Repo:       ${c.cyan}SpaceWeb-Labs/${answers.repoSlug}${c.reset}`)
  if (templateType === 'site') {
    console.log(`  Admin CMS:  ${c.cyan}${answers.enableAdmin ? 'Sì' : 'No'}${c.reset}`)
  }

  const confirmed = await promptYN(rl, '\nConfermi e avvii il setup?', true)
  if (!confirmed) {
    console.log('\nSetup annullato.\n')
    rl.close()
    process.exit(0)
  }

  // 3. Replace placeholders
  section('Sostituzione placeholder')

  const today = new Date().toLocaleDateString('it-IT', { year: 'numeric', month: 'long', day: 'numeric' })

  const replacements = {
    '{{PROJECT_NAME}}':   answers.appName,
    '{{CLIENT_NAME}}':    answers.clientName,
    '{{APP_NAME}}':       answers.appName,
    '{{APP_TAGLINE}}':    answers.appTagline || answers.appName,
    '{{CONTACT_EMAIL}}':  answers.contactEmail,
    '{{COMPANY_ADDRESS}}': answers.address,
    '{{COMPANY_NAME}}':   answers.clientName,
    '{{APP_URL}}':        answers.appUrl || '',
    '{{HERO_TITLE}}':     `Benvenuti da ${answers.appName}`,
    '{{HERO_SUBTITLE}}':  answers.appTagline || 'La soluzione digitale per la tua azienda',
    '{{ABOUT_TEXT}}':     `Siamo ${answers.appName}, un team dedicato a offrire i migliori servizi.`,
    '{{DATE}}':           today,
    '{{GITHUB_REPO_URL}}': `https://github.com/SpaceWeb-Labs/${answers.repoSlug}`,
    '{{ADMIN_ENABLED}}':  answers.enableAdmin ? 'true' : 'false',
  }

  replacePlaceholders('.', replacements)
  ok('Tutti i placeholder sostituiti')

  // 4. Create GitHub repo
  section('Creazione repo GitHub')
  info(`Creazione SpaceWeb-Labs/${answers.repoSlug}...`)

  try {
    run(`gh repo create SpaceWeb-Labs/${answers.repoSlug} --private --source=. --push --description "Progetto: ${answers.clientName}"`)
    ok(`Repo creato: github.com/SpaceWeb-Labs/${answers.repoSlug}`)
  } catch (e) {
    err('Errore creazione repo GitHub')
    dim('Puoi crearlo manualmente: gh repo create SpaceWeb-Labs/' + answers.repoSlug + ' --private')
  }

  // 5. Create Supabase project
  section('Creazione progetto Supabase')

  const orgId = await selectSupabaseOrg(rl)
  const dbPassword = generatePassword(28)
  const projectName = answers.repoSlug

  info(`Creazione progetto Supabase "${projectName}"...`)
  dim('(può richiedere 30-60 secondi)')

  let projectRef = null
  let supabaseUrl = ''
  let anonKey = ''

  try {
    const orgFlag = orgId ? `--org-id ${orgId}` : ''
    const createOut = run(
      `supabase projects create "${projectName}" ${orgFlag} --db-password "${dbPassword}" --region eu-central-1 --output json`,
      { silent: true }
    )

    const created = JSON.parse(createOut)
    projectRef = created.id
    ok(`Progetto Supabase creato: ${projectRef}`)

    // Get API keys
    info('Recupero API keys...')
    // Aspetta un po' che il progetto sia pronto
    await new Promise(r => setTimeout(r, 3000))

    const keysOut = run(`supabase projects api-keys --project-ref ${projectRef} --output json`, { silent: true })
    const keys = JSON.parse(keysOut)

    const anon = keys.find(k => k.name === 'anon')
    anonKey = anon?.api_key || ''
    supabaseUrl = `https://${projectRef}.supabase.co`

    ok(`URL: ${supabaseUrl}`)
    ok('API keys recuperate')

    // Link project
    run(`supabase link --project-ref ${projectRef}`, { silent: true, ignoreError: true })
    ok('Progetto Supabase linkato')

  } catch (e) {
    warn('Creazione Supabase automatica non riuscita.')
    dim('Crea il progetto manualmente su supabase.com e inserisci i dati:')

    supabaseUrl  = await prompt(rl, 'VITE_SUPABASE_URL')
    anonKey      = await prompt(rl, 'VITE_SUPABASE_ANON_KEY')
    projectRef   = supabaseUrl.replace('https://', '').split('.')[0]
  }

  // 6. Write .env.local
  section('Configurazione ambiente')
  writeEnvLocal(answers, supabaseUrl, anonKey)

  // Update CLAUDE.md with real values
  if (existsSync('.claude/CLAUDE.md')) {
    let claudeMd = readFileSync('.claude/CLAUDE.md', 'utf8')
    claudeMd = claudeMd
      .replace('{{SUPABASE_PROJECT_URL}}', `https://supabase.com/dashboard/project/${projectRef}`)
      .replace('{{VERCEL_URL}}', answers.appUrl || 'da configurare')
      .replace('{{START_DATE}}', new Date().toISOString().split('T')[0])
    writeFileSync('.claude/CLAUDE.md', claudeMd, 'utf8')
    ok('CLAUDE.md aggiornato')
  }

  // 7. GitHub secrets
  if (projectRef) {
    section('Configurazione GitHub Secrets')
    setGithubSecrets(projectRef, dbPassword)
  }

  // 8. Install dependencies
  section('Installazione dipendenze')
  info('pnpm install...')
  run('pnpm install')
  ok('Dipendenze installate')

  // 9. Apply migrations to remote (optional)
  if (projectRef) {
    const applyMigrations = await promptYN(rl, 'Applicare le migrations al progetto Supabase remoto?', true)
    if (applyMigrations) {
      section('Migrations Supabase')
      info('supabase db push...')
      try {
        run(`supabase db push --project-ref ${projectRef}`)
        ok('Migrations applicate')
      } catch {
        warn('Errore migrations — applicale manualmente: supabase db push')
      }
    }
  }

  // 10. Vercel
  section('Deploy Vercel')
  const hasVercel = (() => { try { execSync('vercel --version', { stdio: 'pipe' }); return true } catch { return false } })()

  if (hasVercel) {
    const deployVercel = await promptYN(rl, 'Creare progetto Vercel e fare il primo deploy?', true)
    if (deployVercel) {
      info('vercel...')
      try {
        run('vercel --yes')
        ok('Progetto Vercel creato')

        // Set env vars on Vercel
        info('Impostazione variabili d\'ambiente su Vercel...')
        run(`echo "${supabaseUrl}" | vercel env add VITE_SUPABASE_URL production`, { ignoreError: true, silent: true })
        run(`echo "${anonKey}" | vercel env add VITE_SUPABASE_ANON_KEY production`, { ignoreError: true, silent: true })
        ok('Env vars impostate su Vercel')
      } catch {
        warn('Vercel deploy non riuscito — fai il deploy manualmente')
      }
    }
  } else {
    warn('Vercel CLI non installato.')
    dim('Installa con: npm install -g vercel')
    dim('Poi esegui: vercel (nella cartella del progetto)')
    dim('Oppure importa il repo su vercel.com/new')
  }

  // 11. Start local dev (optional)
  rl.close()

  // ─── DONE ───────────────────────────────
  header('✓ Setup completato!')

  console.log(`${c.bold}Progetto:${c.reset}  ${answers.appName}`)
  console.log(`${c.bold}Cliente:${c.reset}   ${answers.clientName}`)
  console.log(`${c.bold}Repo:${c.reset}      github.com/SpaceWeb-Labs/${answers.repoSlug}`)
  if (supabaseUrl) console.log(`${c.bold}Supabase:${c.reset}  ${supabaseUrl}`)

  console.log(`\n${c.bold}Prossimi passi:${c.reset}`)
  console.log(`  1. ${c.cyan}pnpm dev${c.reset}       → avvia frontend + Supabase locale`)
  console.log(`  2. ${c.cyan}claude${c.reset}          → apri Claude Code (già configurato)`)
  if (answers.enableAdmin) {
    console.log(`  3. Crea il primo admin su supabase.com/dashboard → Auth → Users`)
    console.log(`  4. Accedi su ${c.cyan}/admin/login${c.reset}`)
  }
  console.log(`\n${c.gray}Credenziali DB salvate in .env.local (non committare)${c.reset}\n`)
}

main().catch((e) => {
  console.error(`\n${c.red}Errore fatale:${c.reset}`, e.message)
  process.exit(1)
})
