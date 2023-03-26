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
      <main className="flex space-x-8">
        <section className="flex-1">{children}</section>
        <Sidebar />
      </main>
    </div>
  )
}
