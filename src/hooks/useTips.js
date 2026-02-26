import { useState, useCallback, useEffect } from 'react'
import { getSupabaseClient } from '../lib/supabase.js'

export function useTips(settings) {
  const [tips, setTips] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const fetchTips = useCallback(async () => {
    const { supabaseUrl, supabaseAnonKey } = settings
    const supabase = getSupabaseClient(supabaseUrl, supabaseAnonKey)
    if (!supabase) return

    setLoading(true)
    setError(null)
    try {
      const { data, error: fetchError } = await supabase
        .from('tips')
        .select('*')
        .order('date_entered', { ascending: false })

      if (fetchError) throw fetchError
      setTips(data || [])
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }, [settings])

  useEffect(() => {
    if (settings.supabaseUrl && settings.supabaseAnonKey) {
      fetchTips()
    }
  }, [fetchTips, settings.supabaseUrl, settings.supabaseAnonKey])

  const deleteTip = useCallback(
    async (id) => {
      const { supabaseUrl, supabaseAnonKey } = settings
      const supabase = getSupabaseClient(supabaseUrl, supabaseAnonKey)
      if (!supabase) return

      const { error: deleteError } = await supabase
        .from('tips')
        .delete()
        .eq('id', id)

      if (deleteError) throw new Error('SUPABASE_ERROR')
      await fetchTips()
    },
    [settings, fetchTips]
  )

  return { tips, loading, error, fetchTips, deleteTip }
}
