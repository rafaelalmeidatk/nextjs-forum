import { DateTime } from '@/utils/luxon'

export const buildPostTimeValues = (createdAt: Date) => {
  const datetime = DateTime.fromJSDate(createdAt)
  const text = datetime.toLocaleString(DateTime.DATETIME_SHORT)
  const shortText = datetime.toLocaleString({
    hour: 'numeric',
    minute: 'numeric',
  })
  const tooltip = datetime.toLocaleString({
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: 'numeric',
    second: 'numeric',
    timeZoneName: 'short',
  })
  const iso = datetime.toISO()

  return { text, shortText, tooltip, iso }
}

export const largerDate = (...dates: Date[]) => {
  return dates.reduce((a, b) => (a > b ? a : b))
}
