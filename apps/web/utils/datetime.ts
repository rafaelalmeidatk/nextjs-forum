import { DateTime } from '@/utils/luxon'

export const buildPostTimeValues = (createdAt: Date) => {
  const datetime = DateTime.fromJSDate(createdAt)
  const text = datetime.setLocale('en-GB').toLocaleString({
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: 'numeric',
  }) // 17 Sep 2023 at 15:20
  const shortText = datetime.toLocaleString({
    hour: 'numeric',
    minute: 'numeric',
  }) // 15:20
  const tooltip = datetime.setLocale('en-GB').toLocaleString({
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: 'numeric',
    minute: 'numeric',
    second: 'numeric',
    timeZoneName: 'short',
  }) // 17 September 2023 at 15:20:38 GMT+7
  const iso = datetime.toISO() // 2023-09-17T15:20:38.000+07:00

  return { text, shortText, tooltip, iso }
}
