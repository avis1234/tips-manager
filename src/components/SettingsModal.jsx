import { useState } from 'react'
import { testApiKey } from '../lib/claude.js'

export default function SettingsModal({ settings, onSave, onClose }) {
  const [form, setForm] = useState({
    claudeApiKey: settings.claudeApiKey || '',
    supabaseUrl: settings.supabaseUrl || '',
    supabaseAnonKey: settings.supabaseAnonKey || '',
  })
  const [testResult, setTestResult] = useState(null)
  const [testing, setTesting] = useState(false)

  function handleChange(e) {
    setTestResult(null)
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }))
  }

  async function handleTest() {
    setTesting(true)
    setTestResult(null)
    try {
      const { status, body } = await testApiKey(form.claudeApiKey.trim())
      setTestResult({ status, body })
    } catch (err) {
      setTestResult({ status: null, body: err.message })
    } finally {
      setTesting(false)
    }
  }

  function handleSubmit(e) {
    e.preventDefault()
    onSave({
      claudeApiKey: form.claudeApiKey.trim(),
      supabaseUrl: form.supabaseUrl.trim(),
      supabaseAnonKey: form.supabaseAnonKey.trim(),
    })
    onClose()
  }

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg">
        <div className="flex items-center justify-between px-6 py-4 border-b">
          <h2 className="text-lg font-semibold text-gray-900">Settings</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 text-2xl leading-none"
          >
            ×
          </button>
        </div>

        <form onSubmit={handleSubmit} className="px-6 py-5 space-y-5">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Claude API Key
            </label>
            <input
              type="password"
              name="claudeApiKey"
              value={form.claudeApiKey}
              onChange={handleChange}
              placeholder="sk-ant-..."
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
            <div className="flex items-center gap-3 mt-2">
              <button
                type="button"
                onClick={handleTest}
                disabled={!form.claudeApiKey.trim() || testing}
                className="text-xs px-3 py-1.5 rounded-lg border border-gray-300 text-gray-600 hover:bg-gray-50 disabled:opacity-40 transition-colors"
              >
                {testing ? 'Testing…' : 'Test Key'}
              </button>
              {testResult && (
                <span className={`text-xs font-medium ${testResult.status === 200 ? 'text-emerald-600' : 'text-red-600'}`}>
                  {testResult.status === 200
                    ? 'HTTP 200 — Key is valid!'
                    : testResult.status
                    ? `HTTP ${testResult.status} — ${testResult.body}`
                    : `Network error — ${testResult.body}`}
                </span>
              )}
            </div>
            <p className="text-xs text-gray-500 mt-1">
              Stored in your browser only. Never sent to any server.
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Supabase Project URL
            </label>
            <input
              type="text"
              name="supabaseUrl"
              value={form.supabaseUrl}
              onChange={handleChange}
              placeholder="https://xxxx.supabase.co"
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Supabase Anon Key
            </label>
            <input
              type="password"
              name="supabaseAnonKey"
              value={form.supabaseAnonKey}
              onChange={handleChange}
              placeholder="eyJ..."
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          <div className="flex justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg transition-colors"
            >
              Save Settings
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
