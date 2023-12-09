import { ReactNode } from 'react'
import { twMerge } from 'tailwind-merge'
import { Sidebar } from '@/components/sidebar'

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
      className={twMerge('container max-w-7xl mx-auto px-12 py-8', className)}
    >
      <main className="flex space-x-8">
        <section className="flex-1 min-w-0">{children}</section>
        <div className="hidden lg:block">
          <Sidebar />
        </div>
      </main>
    </div>
  )
}
