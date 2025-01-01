'use client'

import { usePathname, useSearchParams } from 'next/navigation'
import React, { useEffect, useState } from 'react'

type MessageWrapperProps = {
  children: React.ReactNode
  snowflakeId: string
}
export const MessageWrapper = ({
  children,
  snowflakeId,
}: MessageWrapperProps) => {
  const searchParams = useSearchParams()
  const [isHighlighted, setIsHighlighted] = useState(false)
  const pathname = usePathname()

  useEffect(() => {
    if (!searchParams || searchParams.has(snowflakeId)) return
    const searchID = searchParams.get('replyID')
    let timeout: NodeJS.Timeout
    if (searchID && searchID === snowflakeId) {
      setIsHighlighted(true)
      timeout = setTimeout(() => {
        setIsHighlighted(false)
        window.history.replaceState(null, '', pathname)
      }, 1000)
    }
    return () => {
      if (timeout) clearTimeout(timeout)
    }
  }, [searchParams, snowflakeId])
  return (
    <div
      id={`message-${snowflakeId}`}
      className="group rounded transition-colors duration-300 ease-in-out"
      style={
        {
          backgroundColor: isHighlighted
            ? 'rgba(255, 255, 255, 0.1)'
            : undefined,
        } as React.CSSProperties
      }
    >
      {children}
    </div>
  )
}
