import StatusBadge from './StatusBadge.jsx'
import { formatDate, formatDateTime } from '../utils/dates.js'

const expandable = 'cursor-pointer hover:text-indigo-600 transition-colors'

export default function TipsTableRow({ tip, onDelete, onExpand }) {
  const excerptLong = (tip.tip_excerpt?.length ?? 0) > 60
  const summaryLong = (tip.summary?.length ?? 0) > 100
  const qualityHasDetail = tip.quality?.includes(' - ') ?? false

  return (
    <tr className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
      <td className="px-4 py-3 text-sm text-gray-700 whitespace-nowrap">
        {tip.tool_name || '—'}
      </td>
      <td className="px-4 py-3 text-sm text-gray-500 whitespace-nowrap">
        {formatDateTime(tip.date_entered)}
      </td>
      <td className="px-4 py-3 text-sm text-gray-500 whitespace-nowrap">
        {formatDate(tip.date_created)}
      </td>

      {/* Tip / Link */}
      <td className="px-4 py-3 text-sm text-gray-900 max-w-xs">
        {tip.entry_type === 'link' && tip.source_url ? (
          <div className="space-y-0.5">
            <a
              href={tip.source_url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-indigo-600 hover:text-indigo-800 hover:underline line-clamp-2 block"
              title={tip.source_url}
            >
              {tip.tip_excerpt || tip.source_url}
            </a>
            {excerptLong && (
              <button
                onClick={() => onExpand('Tip / Link', tip.tip_excerpt)}
                className="text-xs text-gray-400 hover:text-indigo-500 transition-colors"
              >
                expand
              </button>
            )}
          </div>
        ) : (
          <span
            className={`line-clamp-2 block ${excerptLong ? expandable : ''}`}
            onClick={() => excerptLong && onExpand('Tip', tip.raw_input || tip.tip_excerpt)}
            title={excerptLong ? 'Click to expand' : undefined}
          >
            {tip.tip_excerpt || tip.raw_input}
          </span>
        )}
      </td>

      {/* Summary */}
      <td className="px-4 py-3 text-sm text-gray-600 max-w-sm">
        <span
          className={`line-clamp-3 block ${summaryLong ? expandable : ''}`}
          onClick={() => summaryLong && onExpand('Summary', tip.summary)}
          title={summaryLong ? 'Click to expand' : undefined}
        >
          {tip.summary || '—'}
        </span>
      </td>

      {/* Quality */}
      <td className="px-4 py-3">
        <div
          className={qualityHasDetail ? expandable : ''}
          onClick={() => qualityHasDetail && onExpand('Quality', tip.quality)}
          title={qualityHasDetail ? 'Click to expand' : undefined}
        >
          <StatusBadge quality={tip.quality} />
          {qualityHasDetail && (
            <p className="text-xs text-gray-400 mt-1 max-w-[160px] line-clamp-2">
              {tip.quality.split(' - ').slice(1).join(' - ')}
            </p>
          )}
        </div>
      </td>

      <td className="px-4 py-3 whitespace-nowrap">
        <button
          onClick={() => onDelete(tip.id)}
          className="text-xs text-gray-400 hover:text-red-500 transition-colors"
          title="Delete tip"
        >
          Delete
        </button>
      </td>
    </tr>
  )
}
