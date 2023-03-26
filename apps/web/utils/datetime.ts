import { DateTime } from 'luxon'

export const formatPostDate = (date: DateTime) => {
  return DateTime.now().year === date.year
    ? date.toLocaleString({ month: 'short', day: 'numeric' })
    : date.toLocaleString({ year: 'numeric', month: 'short', day: 'numeric' })
}
