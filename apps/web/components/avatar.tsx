'use client'

import { cn } from '@/utils/cn'
import { ComponentProps, useLayoutEffect, useRef, useState } from 'react'

const sizeToClassName = {
  4: 'w-4 h-4',
  5: 'w-5 h-5',
  10: 'w-10 h-10',
  16: 'w-16 h-16',
}

const DEFAULT_AVATAR = 'https://cdn.discordapp.com/embed/avatars/1.png'

type AvatarProps = ComponentProps<'img'> & {
  size: keyof typeof sizeToClassName
  username?: string
}

type LoadingStatus = 'loading' | 'loaded' | 'error'

export const Avatar = ({
  src,
  size,
  className,
  referrerPolicy,
  crossOrigin,
  username,
  ...props
}: AvatarProps) => {
  const [loadingStatus, setLoadingStatus] = useState<LoadingStatus>('loading')

  useLayoutEffect(() => {
    if (!src) {
      setLoadingStatus('error')
      return
    }

    const image = new window.Image()

    image.onload = () => setLoadingStatus('loaded')
    image.onerror = () => setLoadingStatus('error')

    if (referrerPolicy) {
      image.referrerPolicy = referrerPolicy
    }
    if (typeof crossOrigin === 'string') {
      image.crossOrigin = crossOrigin
    }
    image.src = src
  }, [src, referrerPolicy, crossOrigin])

  if (loadingStatus === 'loaded') {
    return (
      <img
        src={src}
        alt={username ? `${username}'s avatar` : ''}
        className={cn('rounded-full', sizeToClassName[size], className)}
        {...props}
      />
    )
  }

  if (loadingStatus === 'error') {
    return (
      <img
        src={DEFAULT_AVATAR}
        alt={username ? `${username}'s avatar` : ''}
        className={cn('rounded-full', sizeToClassName[size], className)}
        {...props}
      />
    )
  }

  return (
    <span
      className={cn('rounded-full bg-neutral-800', sizeToClassName[size])}
    />
  )
}
