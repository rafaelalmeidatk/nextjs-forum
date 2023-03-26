import { ReactNode } from 'react'
import { twMerge } from 'tailwind-merge'
import { Sidebar } from './sidebar'

type LayoutWithSidebarProps = {
  className?: string
  children: ReactNode
}

export const LayoutWithSidebar = ({
  className,
  children,
}: LayoutWithSidebarProps) => {
  return (
    <div
      className={twMerge('container max-w-7xl mx-auto px-4 py-8', className)}
    >
      <div className="flex space-x-8">
        <div className="flex-1 space-y-2">{children}</div>

        <Sidebar />
      </div>
    </div>
  )
}
