'use client'

import { useEffect, useState } from 'react'
import { buildPostTimeValues } from '@/utils/datetime'

type LocalTime = {
  text: string
  shortText: string
}

function useLocalTime(dateStr: string) {
  const [localTime, setLocalTime] = useState<LocalTime | null>(null)

  useEffect(() => {
    const date = new Date(dateStr)
    setLocalTime(buildPostTimeValues(date))
  }, [dateStr])

  return localTime
}

export const DisplayLocalTime = ({
  short,
  dateStr,
}: {
  short?: boolean
  dateStr: string
}) => {
  const localTime = useLocalTime(dateStr)
  if (!localTime) return <span className="invisible">{dateStr}</span>
  return (
    <span className="visible">
      {short ? localTime.shortText : localTime.text}
    </span>
  )
}
