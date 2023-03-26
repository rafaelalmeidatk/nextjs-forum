import { ReactNode } from 'react'

type MessageGroupProps = { children: ReactNode }

export const MessageGroup = ({ children }: MessageGroupProps) => {
  return (
    <div className="pr-4 py-4 border border-neutral-800 rounded space-y-0.5">
      {children}
    </div>
  )
}
