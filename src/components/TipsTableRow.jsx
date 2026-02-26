import StatusBadge from './StatusBadge.jsx'
import { formatDate, formatDateTime } from '../utils/dates.js'

export default function TipsTableRow({ tip, onDelete }) {
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
      <td className="px-4 py-3 text-sm text-gray-900 max-w-xs">
        {tip.entry_type === 'link' && tip.source_url ? (
          <a
            href={tip.source_url}
            target="_blank"
            rel="noopener noreferrer"
            className="text-indigo-600 hover:text-indigo-800 hover:underline line-clamp-2 block"
            title={tip.source_url}
          >
            {tip.tip_excerpt || tip.source_url}
          </a>
        ) : (
          <span className="line-clamp-2" title={tip.raw_input}>
            {tip.tip_excerpt || tip.raw_input}
          </span>
        )}
      </td>
      <td className="px-4 py-3 text-sm text-gray-600 max-w-sm">
        <span className="line-clamp-3">{tip.summary || '—'}</span>
      </td>
      <td className="px-4 py-3 whitespace-nowrap">
        <StatusBadge quality={tip.quality} />
        {tip.quality && (
          <p className="text-xs text-gray-400 mt-1 max-w-[160px] line-clamp-2">
            {tip.quality.includes(' - ') ? tip.quality.split(' - ').slice(1).join(' - ') : ''}
          </p>
        )}
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
