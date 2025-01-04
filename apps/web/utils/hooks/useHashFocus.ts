'use client'

import { useState, useEffect, useCallback } from 'react'

export function useHashFocus(targetHash: string): {
  isHashFocused: boolean
  handleHashChange: () => void
} {
  const [isHashFocused, setIsHashFocused] = useState(false)

  const handleHashChange = useCallback(() => {
    const currentHash = window.location.hash
    const isFocused = currentHash === targetHash
    setIsHashFocused(isFocused)

    if (isFocused) {
      const element = document.getElementById(targetHash.slice(1))
      if (element) {
        const elementRect = element.getBoundingClientRect()
        const absoluteElementTop = elementRect.top + window.scrollY
        const middle =
          absoluteElementTop - window.innerHeight / 2 + elementRect.height / 2
        window.scrollTo({
          top: middle,
          behavior: 'smooth',
        })
      }
    }
  }, [targetHash])

  useEffect(() => {
    handleHashChange()
    window.addEventListener('hashchange', handleHashChange)
    return () => window.removeEventListener('hashchange', handleHashChange)
  }, [handleHashChange])

  return { isHashFocused, handleHashChange }
}
