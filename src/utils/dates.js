import { format, parseISO, isValid } from 'date-fns'

export function formatDate(dateString) {
  if (!dateString) return '—'
  try {
    const date = parseISO(dateString)
    if (!isValid(date)) return '—'
    return format(date, 'MMM d, yyyy')
  } catch {
    return '—'
  }
}

export function formatDateTime(dateString) {
  if (!dateString) return '—'
  try {
    const date = parseISO(dateString)
    if (!isValid(date)) return '—'
    return format(date, 'MMM d, yyyy')
  } catch {
    return '—'
  }
}
