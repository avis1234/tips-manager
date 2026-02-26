import { useState } from 'react'

function isValidUrl(str) {
  try {
    const url = new URL(str)
    return url.protocol === 'https:' || url.protocol === 'http:'
  } catch {
    return false
  }
}

export default function AddTipModal({ onSubmit, onClose }) {
  const [entryType, setEntryType] = useState('text')
  const [input, setInput] = useState('')
  const [validationError, setValidationError] = useState('')

  function handleSubmit(e) {
    e.preventDefault()
    setValidationError('')

    const trimmed = input.trim()
    if (!trimmed) {
      setValidationError('Please enter some content.')
      return
    }

    if (entryType === 'link' && !isValidUrl(trimmed)) {
      setValidationError('Please enter a valid https:// URL.')
      return
    }

    onSubmit({ rawInput: trimmed, entryType })
    onClose()
  }

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg">
        <div className="flex items-center justify-between px-6 py-4 border-b">
          <h2 className="text-lg font-semibold text-gray-900">Add Tip</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 text-2xl leading-none"
          >
            ×
          </button>
        </div>

        <form onSubmit={handleSubmit} className="px-6 py-5 space-y-4">
          {/* Toggle */}
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => { setEntryType('text'); setInput(''); setValidationError('') }}
              className={`flex-1 py-2 rounded-lg text-sm font-medium border transition-colors ${
                entryType === 'text'
                  ? 'bg-indigo-600 text-white border-indigo-600'
                  : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
              }`}
            >
              Text
            </button>
            <button
              type="button"
              onClick={() => { setEntryType('link'); setInput(''); setValidationError('') }}
              className={`flex-1 py-2 rounded-lg text-sm font-medium border transition-colors ${
                entryType === 'link'
                  ? 'bg-indigo-600 text-white border-indigo-600'
                  : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
              }`}
            >
              Link
            </button>
          </div>

          {/* Input */}
          {entryType === 'text' ? (
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Paste or type your tip here…"
              rows={6}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none"
              autoFocus
            />
          ) : (
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="https://..."
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
              autoFocus
            />
          )}

          {validationError && (
            <p className="text-sm text-red-600">{validationError}</p>
          )}

          <p className="text-xs text-gray-500">
            {entryType === 'link'
              ? 'The page will be fetched and analyzed by Claude automatically.'
              : 'Claude will summarize and rate this tip automatically.'}
          </p>

          <div className="flex justify-end gap-3 pt-1">
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
              Add Tip
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
