import { createClient } from '@supabase/supabase-js'

let client = null

export function getSupabaseClient(url, anonKey) {
  if (!url || !anonKey) return null
  if (
    client &&
    client.supabaseUrl === url &&
    client.supabaseKey === anonKey
  ) {
    return client
  }
  client = createClient(url, anonKey)
  return client
}
