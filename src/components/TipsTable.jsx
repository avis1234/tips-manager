import { useState } from 'react'
import TipsTableRow from './TipsTableRow.jsx'
import EmptyState from './EmptyState.jsx'

const COLUMNS = [
  { key: 'tool_name', label: 'Tool' },
  { key: 'date_entered', label: 'Date Entered' },
  { key: 'date_created', label: 'Date Created' },
  { key: 'tip_excerpt', label: 'Tip / Link' },
  { key: 'summary', label: 'Summary' },
  { key: 'quality', label: 'Quality' },
  { key: '_actions', label: '' },
]

function sortTips(tips, sortKey, sortDir) {
  if (!sortKey) return tips
  return [...tips].sort((a, b) => {
    const av = a[sortKey] ?? ''
    const bv = b[sortKey] ?? ''
    const cmp = String(av).localeCompare(String(bv))
    return sortDir === 'asc' ? cmp : -cmp
  })
}

export default function TipsTable({ tips, loading, isConfigured, onDelete }) {
  const [sortKey, setSortKey] = useState('date_entered')
  const [sortDir, setSortDir] = useState('desc')

  function handleSort(key) {
    if (key === '_actions') return
    if (sortKey === key) {
      setSortDir((d) => (d === 'asc' ? 'desc' : 'asc'))
    } else {
      setSortKey(key)
      setSortDir('asc')
    }
  }

  const sorted = sortTips(tips, sortKey, sortDir)

  if (loading) {
    return (
      <div className="text-center py-16 text-gray-400">
        <div className="w-8 h-8 border-4 border-indigo-400 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
        <p>Loading tips…</p>
      </div>
    )
  }

  if (tips.length === 0) {
    return <EmptyState isConfigured={isConfigured} />
  }

  return (
    <div className="overflow-x-auto rounded-xl border border-gray-200">
      <table className="w-full text-left">
        <thead className="bg-gray-50 border-b border-gray-200">
          <tr>
            {COLUMNS.map((col) => (
              <th
                key={col.key}
                onClick={() => handleSort(col.key)}
                className={`px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide select-none ${
                  col.key !== '_actions' ? 'cursor-pointer hover:text-gray-700' : ''
                }`}
              >
                {col.label}
                {sortKey === col.key && col.key !== '_actions' && (
                  <span className="ml-1">{sortDir === 'asc' ? '↑' : '↓'}</span>
                )}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="bg-white">
          {sorted.map((tip) => (
            <TipsTableRow key={tip.id} tip={tip} onDelete={onDelete} />
          ))}
        </tbody>
      </table>
    </div>
  )
}
