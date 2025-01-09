'use client'

import { cn } from '@/utils/cn'
import { useHashFocus } from '@/utils/hooks/useHashFocus'
import React, { useEffect, useState } from 'react'

type MessageWrapperProps = {
  children: React.ReactNode
  snowflakeId: string
}
export const MessageWrapper = ({
  children,
  snowflakeId,
}: MessageWrapperProps) => {
  const { isHashFocused } = useHashFocus(`#message-${snowflakeId}`)
  const [isHighlighted, setIsHighlighted] = useState(false)

  useEffect(() => {
    if (!isHashFocused) return
    setIsHighlighted(true)
    let timeout: NodeJS.Timeout
    timeout = setTimeout(() => {
      setIsHighlighted(false)
    }, 1000)
    return () => {
      if (timeout) clearTimeout(timeout)
    }
  }, [isHashFocused])
  return (
    <div
      id={`message-${snowflakeId}`}
      className={cn(
        'group rounded transition-colors duration-300 ease-in-out',
        {
          'bg-white/10': isHighlighted,
        },
      )}
    >
      {children}
    </div>
  )
}
