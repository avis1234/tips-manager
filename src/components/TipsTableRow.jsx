import StatusBadge from './StatusBadge.jsx'
import { formatDate, formatDateTime } from '../utils/dates.js'

const expandable = 'cursor-pointer hover:text-indigo-600 transition-colors'

export default function TipsTableRow({ tip, onDelete, onExpand }) {
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
            {tip.tip_excerpt && tip.tip_excerpt.length > 60 && (
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
            className={`line-clamp-2 block ${tip.tip_excerpt?.length > 60 ? expandable : ''}`}
            onClick={() => tip.tip_excerpt?.length > 60 && onExpand('Tip', tip.raw_input || tip.tip_excerpt)}
            title={tip.tip_excerpt?.length > 60 ? 'Click to expand' : undefined}
          >
            {tip.tip_excerpt || tip.raw_input}
          </span>
        )}
      </td>

      {/* Summary */}
      <td className="px-4 py-3 text-sm text-gray-600 max-w-sm">
        <span
          className={`line-clamp-3 block ${tip.summary?.length > 100 ? expandable : ''}`}
          onClick={() => tip.summary?.length > 100 && onExpand('Summary', tip.summary)}
          title={tip.summary?.length > 100 ? 'Click to expand' : undefined}
        >
          {tip.summary || '—'}
        </span>
      </td>

      {/* Quality */}
      <td className="px-4 py-3">
        <div
          className={tip.quality?.includes(' - ') ? expandable : ''}
          onClick={() => tip.quality?.includes(' - ') && onExpand('Quality', tip.quality)}
          title={tip.quality?.includes(' - ') ? 'Click to expand' : undefined}
        >
          <StatusBadge quality={tip.quality} />
          {tip.quality?.includes(' - ') && (
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
