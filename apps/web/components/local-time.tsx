'use client'

import { useEffect, useState } from 'react'
import { buildPostTimeValues } from '@/utils/datetime'

type LocalTime = {
  text: string
  shortText: string
}

function useLocalTime(date: Date) {
  const [localTime, setLocalTime] = useState<LocalTime | null>(null)
  useEffect(() => setLocalTime(buildPostTimeValues(date)), [date])
  return localTime
}

export const DisplayLocalTime = ({
  short,
  dateStr,
}: {
  short?: boolean
  dateStr: string
}) => {
  const localTime = useLocalTime(new Date(dateStr))
  if (!localTime) return <span className="invisible">{dateStr}</span>
  return (
    <span className="visible">
      {short ? localTime.shortText : localTime.text}
    </span>
  )
}
