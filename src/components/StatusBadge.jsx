const QUALITY_STYLES = {
  Excellent: 'bg-emerald-100 text-emerald-800',
  Good: 'bg-blue-100 text-blue-800',
  Average: 'bg-yellow-100 text-yellow-800',
  Weak: 'bg-red-100 text-red-800',
}

export default function StatusBadge({ quality }) {
  if (!quality) return <span className="text-gray-400 text-sm">—</span>

  const tier = quality.split(' - ')[0].trim()
  const styles = QUALITY_STYLES[tier] || 'bg-gray-100 text-gray-700'

  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${styles}`}
      title={quality}
    >
      {tier}
    </span>
  )
}
