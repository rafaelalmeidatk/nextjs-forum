'use client'

import { useCallback, useEffect, useState } from 'react'

export function useHashFocus(targetHash: string): {
  isHashFocused: boolean
  handleHashChange: () => void
} {
  const [isHashFocused, setIsHashFocused] = useState(false)

  const handleHashChange = useCallback(() => {
    const currentHash = window.location.hash
    const isFocused = currentHash === targetHash
    setIsHashFocused(isFocused)
  }, [targetHash])

  useEffect(() => {
    handleHashChange()
    window.addEventListener('hashchange', handleHashChange)
    return () => window.removeEventListener('hashchange', handleHashChange)
  }, [handleHashChange])

  return { isHashFocused, handleHashChange }
}
