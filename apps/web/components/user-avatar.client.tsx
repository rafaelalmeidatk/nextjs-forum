'use client'
import { ImgHTMLAttributes } from 'react'
import React from 'react'
export function UserAvatar({
  ...props
}: {} & ImgHTMLAttributes<HTMLImageElement>) {
  return (
    <img
      onError={(e) => {
        const url = 'https://cdn.discordapp.com/embed/avatars/1.png'
        e.currentTarget.src = url
      }}
      {...props}
    />
  )
}
