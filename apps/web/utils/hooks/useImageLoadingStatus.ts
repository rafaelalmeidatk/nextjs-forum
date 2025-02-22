import { ComponentProps, useLayoutEffect } from 'react'
import { useState } from 'react'

// Code based on https://github.com/radix-ui/primitives/blob/6e75e117977c9e6ffa939e6951a707f16ba0f95e/packages/react/avatar/src/avatar.tsx#L119

type LoadingStatus = 'loading' | 'loaded' | 'error'

export const useImageLoadingStatus = (
  src: string | undefined,
  { referrerPolicy, crossOrigin }: ComponentProps<'img'> = {},
) => {
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

  return loadingStatus
}
