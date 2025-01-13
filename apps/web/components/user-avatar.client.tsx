'use client'
import { ImgHTMLAttributes, useState } from 'react'
import React from 'react'
const DEFAULT_AVATAR = 'https://cdn.discordapp.com/embed/avatars/1.png'
export function UserAvatar(props: ImgHTMLAttributes<HTMLImageElement>) {
  const [URL, setURL] = useState(props.src || DEFAULT_AVATAR)
  return (
    <img
      src={URL}
      onError={() => {
        setURL(DEFAULT_AVATAR)
      }}
      {...props}
    />
  )
}
