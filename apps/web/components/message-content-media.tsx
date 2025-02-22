'use client'

import { useImageLoadingStatus } from '@/utils/hooks/useImageLoadingStatus'
import { ComponentProps } from 'react'

export const MessageContentImage = ({
  src,
  alt,
  ...props
}: ComponentProps<'img'>) => {
  const loadingStatus = useImageLoadingStatus(src)

  if (loadingStatus === 'loaded') {
    return <img src={src} alt={alt} {...props} />
  }

  const brokenMediaJsx = (
    <div className="border border-neutral-700 rounded-lg px-2 py-1 text-neutral-400 text-sm min-h-8 flex items-center">
      This media is unavailable, please check the original message on Discord
    </div>
  )

  if (loadingStatus === 'error') {
    return brokenMediaJsx
  }

  return (
    <div className="relative" aria-label="Loading media" aria-busy="true">
      {/* Most images will be broken so we will use the broken state to size this loading indicator,
          this will avoid most layout shifts */}
      <div aria-hidden="true">{brokenMediaJsx}</div>
      <div className="absolute inset-0 bg-neutral-800" />
    </div>
  )
}
