import { useState, useCallback } from 'react'
import { useSettings } from './hooks/useSettings.js'
import { useTips } from './hooks/useTips.js'
import { processTip } from './lib/processtip.js'
import TipsTable from './components/TipsTable.jsx'
import AddTipModal from './components/AddTipModal.jsx'
import SettingsModal from './components/SettingsModal.jsx'
import LoadingOverlay from './components/LoadingOverlay.jsx'

const ERROR_MESSAGES = {
  JINA_ERROR: 'Could not fetch that URL. Paste the text directly instead.',
  CLAUDE_401: 'Invalid Claude API key — check Settings.',
  CLAUDE_429: 'Rate limit hit. Wait a moment and retry.',
  CLAUDE_BAD_JSON: 'AI analysis failed. Try again.',
  CLAUDE_ERROR: 'AI analysis failed. Try again.',
  SUPABASE_ERROR: 'Failed to save — check Supabase settings.',
  INVALID_URL: 'Please enter a valid https:// URL.',
}

export default function App() {
  const { settings, saveSettings, isConfigured } = useSettings()
  const { tips, loading, fetchTips, deleteTip } = useTips(settings)

  const [showAddModal, setShowAddModal] = useState(false)
  const [showSettingsModal, setShowSettingsModal] = useState(false)
  const [processingStatus, setProcessingStatus] = useState(null)
  const [toast, setToast] = useState(null)

  function showToast(message, type = 'error') {
    setToast({ message, type })
    setTimeout(() => setToast(null), 4000)
  }

  const handleAddTip = useCallback(
    async ({ rawInput, entryType }) => {
      try {
        await processTip({
          rawInput,
          entryType,
          settings,
          onStatus: setProcessingStatus,
        })
        await fetchTips()
        showToast('Tip saved successfully!', 'success')
      } catch (err) {
        const msg = ERROR_MESSAGES[err.message] || 'Something went wrong. Please try again.'
        showToast(msg, 'error')
      } finally {
        setProcessingStatus(null)
      }
    },
    [settings, fetchTips]
  )

  const handleDelete = useCallback(
    async (id) => {
      try {
        await deleteTip(id)
      } catch {
        showToast('Failed to delete — check Supabase settings.', 'error')
      }
    },
    [deleteTip]
  )

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="text-2xl">💡</span>
            <h1 className="text-xl font-bold text-gray-900">AI Tips Manager</h1>
            {tips.length > 0 && (
              <span className="text-sm text-gray-400 font-normal">
                {tips.length} tip{tips.length !== 1 ? 's' : ''}
              </span>
            )}
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={() => setShowSettingsModal(true)}
              className="px-3 py-2 text-sm font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
            >
              ⚙️ Settings
            </button>
            <button
              onClick={() => {
                if (!isConfigured) {
                  showToast('Configure your API keys in Settings first.', 'error')
                  return
                }
                setShowAddModal(true)
              }}
              className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg transition-colors"
            >
              + Add Tip
            </button>
          </div>
        </div>
      </header>

      {/* Config banner */}
      {!isConfigured && (
        <div className="bg-amber-50 border-b border-amber-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex items-center justify-between">
            <p className="text-sm text-amber-800">
              Configure your API keys to get started — Claude API key, Supabase URL, and Anon key needed.
            </p>
            <button
              onClick={() => setShowSettingsModal(true)}
              className="text-sm font-medium text-amber-700 hover:text-amber-900 underline ml-4 shrink-0"
            >
              Open Settings
            </button>
          </div>
        </div>
      )}

      {/* Main content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <TipsTable
          tips={tips}
          loading={loading}
          isConfigured={isConfigured}
          onDelete={handleDelete}
        />
      </main>

      {/* Toast */}
      {toast && (
        <div
          className={`fixed bottom-6 right-6 z-50 px-5 py-3 rounded-xl shadow-lg text-sm font-medium max-w-sm transition-all ${
            toast.type === 'success'
              ? 'bg-emerald-600 text-white'
              : 'bg-red-600 text-white'
          }`}
        >
          {toast.message}
        </div>
      )}

      {/* Modals */}
      {showAddModal && (
        <AddTipModal
          onSubmit={handleAddTip}
          onClose={() => setShowAddModal(false)}
        />
      )}
      {showSettingsModal && (
        <SettingsModal
          settings={settings}
          onSave={saveSettings}
          onClose={() => setShowSettingsModal(false)}
        />
      )}

      {/* Loading overlay */}
      <LoadingOverlay status={processingStatus} />
    </div>
  )
}
