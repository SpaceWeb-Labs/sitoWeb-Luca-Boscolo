# Skill: Vue 3 + Supabase Agency Stack

## Supabase Client

```typescript
// SEMPRE importare da src/lib/supabase.ts — mai creare nuovi client
import { supabase } from '@/lib/supabase'
```

## Pattern query DB

```typescript
// ✅ Corretto — gestire sempre l'errore
const { data, error } = await supabase
  .from('profiles')
  .select('*')
  .eq('id', userId)
  .single()
if (error) throw error

// ❌ Mai ignorare l'errore
const { data } = await supabase.from('profiles').select('*')
```

## Auth con Pinia

```typescript
export const useAuthStore = defineStore('auth', () => {
  const user = ref<User | null>(null)
  const loading = ref(true)

  async function initialize() {
    const { data: { session } } = await supabase.auth.getSession()
    user.value = session?.user ?? null
    loading.value = false
    supabase.auth.onAuthStateChange((_, session) => {
      user.value = session?.user ?? null
    })
  }

  return { user, loading, initialize }
})
```

## Composable standard per dati

```typescript
export function useItems() {
  const items = ref<Item[]>([])
  const loading = ref(false)
  const error = ref<string | null>(null)

  const fetch = async () => {
    loading.value = true
    error.value = null
    try {
      const { data, error: e } = await supabase.from('items').select('*')
      if (e) throw e
      items.value = data
    } catch (e) {
      error.value = e instanceof Error ? e.message : 'Errore'
    } finally {
      loading.value = false
    }
  }

  onMounted(fetch)
  return { items, loading, error, refetch: fetch }
}
```

## Realtime

```typescript
onMounted(() => {
  const channel = supabase
    .channel('changes')
    .on('postgres_changes', { event: '*', schema: 'public', table: 'items' },
      (payload) => { /* aggiorna stato */ })
    .subscribe()
  onUnmounted(() => supabase.removeChannel(channel))
})
```

## Anti-pattern

- ❌ Mai `any` per dati Supabase — usa i tipi generati
- ❌ Mai hardcodare URL o chiavi — sempre `import.meta.env`
- ❌ Mai fetch in `created()` — usa `onMounted()`
- ❌ Mai mutare props — usa emit o store
- ❌ Mai tabelle senza RLS
