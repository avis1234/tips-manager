import { useState, useCallback } from 'react'

const STORAGE_KEY = 'ai-tips-settings'

function loadSettings() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return { claudeApiKey: '', supabaseUrl: '', supabaseAnonKey: '' }
    return JSON.parse(raw)
  } catch {
    return { claudeApiKey: '', supabaseUrl: '', supabaseAnonKey: '' }
  }
}

export function useSettings() {
  const [settings, setSettingsState] = useState(loadSettings)

  const saveSettings = useCallback((newSettings) => {
    const merged = { ...newSettings }
    localStorage.setItem(STORAGE_KEY, JSON.stringify(merged))
    setSettingsState(merged)
  }, [])

  const isConfigured =
    Boolean(settings.claudeApiKey) &&
    Boolean(settings.supabaseUrl) &&
    Boolean(settings.supabaseAnonKey)

  return { settings, saveSettings, isConfigured }
}
