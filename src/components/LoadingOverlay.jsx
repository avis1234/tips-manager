const STATUS_LABELS = {
  fetching: 'Fetching page content…',
  analyzing: 'Analyzing with Claude…',
  saving: 'Saving to database…',
}

export default function LoadingOverlay({ status }) {
  if (!status) return null

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl shadow-xl px-8 py-6 flex flex-col items-center gap-4 min-w-[260px]">
        <div className="w-10 h-10 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin" />
        <p className="text-gray-700 font-medium text-center">
          {STATUS_LABELS[status] || 'Processing…'}
        </p>
      </div>
    </div>
  )
}
