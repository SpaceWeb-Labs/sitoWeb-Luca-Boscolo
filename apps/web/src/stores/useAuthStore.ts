import type { User } from '@supabase/supabase-js'
import { defineStore } from 'pinia'
import { computed, ref } from 'vue'
import { supabase } from '@/lib/supabase'

export const useAuthStore = defineStore('auth', () => {
  const user = ref<User | null>(null)
  const profile = ref<{ role: string } | null>(null)
  const initialized = ref(false)

  const isAdmin = computed(() => profile.value?.role === 'admin')

  async function initialize() {
    const { data: { session } } = await supabase.auth.getSession()
    user.value = session?.user ?? null
    if (user.value)
      await fetchProfile()
    initialized.value = true

    supabase.auth.onAuthStateChange(async (_event, session) => {
      user.value = session?.user ?? null
      if (user.value)
        await fetchProfile()
      else profile.value = null
    })
  }

  async function fetchProfile() {
    if (!user.value)
      return
    const { data } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', user.value.id)
      .single()
    profile.value = data
  }

  async function signIn(email: string, password: string) {
    const { error } = await supabase.auth.signInWithPassword({ email, password })
    if (error)
      throw error
  }

  async function signOut() {
    await supabase.auth.signOut()
    user.value = null
    profile.value = null
  }

  return { user, profile, initialized, isAdmin, initialize, signIn, signOut }
})
