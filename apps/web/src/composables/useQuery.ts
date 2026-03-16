import { ref, type Ref } from 'vue'
import type { PostgrestError } from '@supabase/supabase-js'

/**
 * Composable per query Supabase — gestisce loading/error/data
 *
 * @example
 * const { data, loading, error, refetch } = useQuery(
 *   () => supabase.from('profiles').select('*')
 * )
 */
export function useQuery<T>(
  queryFn: () => PromiseLike<{ data: T | null; error: PostgrestError | null }>,
  options: {
    immediate?: boolean
    onSuccess?: (data: T) => void
    onError?: (error: PostgrestError) => void
  } = {},
) {
  const data: Ref<T | null> = ref(null)
  const loading = ref(false)
  const error: Ref<string | null> = ref(null)

  const execute = async () => {
    loading.value = true
    error.value = null
    try {
      const { data: result, error: dbError } = await queryFn()
      if (dbError) { error.value = dbError.message; options.onError?.(dbError); return }
      data.value = result
      options.onSuccess?.(result as T)
    }
    catch (e) {
      error.value = e instanceof Error ? e.message : 'errors.unknown'
    }
    finally {
      loading.value = false
    }
  }

  if (options.immediate !== false) execute()

  return { data, loading, error, execute, refetch: execute }
}

/**
 * Composable per mutazioni Supabase — insert/update/delete
 *
 * @example
 * const { mutate, loading, error } = useMutation(
 *   (input: NewProfile) => supabase.from('profiles').insert(input).select().single()
 * )
 */
export function useMutation<TInput, TResult>(
  mutationFn: (input: TInput) => PromiseLike<{ data: TResult | null; error: PostgrestError | null }>,
  options: {
    onSuccess?: (data: TResult) => void
    onError?: (error: PostgrestError) => void
  } = {},
) {
  const loading = ref(false)
  const error: Ref<string | null> = ref(null)

  const mutate = async (input: TInput): Promise<TResult | null> => {
    loading.value = true
    error.value = null
    try {
      const { data, error: dbError } = await mutationFn(input)
      if (dbError) { error.value = dbError.message; options.onError?.(dbError); return null }
      options.onSuccess?.(data as TResult)
      return data
    }
    catch (e) {
      error.value = e instanceof Error ? e.message : 'errors.unknown'
      return null
    }
    finally {
      loading.value = false
    }
  }

  return { mutate, loading, error }
}
