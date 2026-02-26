export default function EmptyState({ isConfigured }) {
  if (!isConfigured) {
    return (
      <div className="text-center py-16 text-gray-500">
        <div className="text-5xl mb-4">⚙️</div>
        <p className="text-lg font-medium text-gray-700">Configure your API keys to get started</p>
        <p className="text-sm mt-1">Click the Settings button in the top right to add your credentials.</p>
      </div>
    )
  }

  return (
    <div className="text-center py-16 text-gray-500">
      <div className="text-5xl mb-4">💡</div>
      <p className="text-lg font-medium text-gray-700">No tips yet</p>
      <p className="text-sm mt-1">Click "Add Tip" to save your first AI tip.</p>
    </div>
  )
}
