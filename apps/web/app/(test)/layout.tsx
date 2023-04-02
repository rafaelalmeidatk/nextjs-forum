import { LayoutWithSidebar } from '@/components/layout-with-sidebar'
import { ReactNode } from 'react'

type HomeLayoutProps = { children: ReactNode }

export default function HomeLayout({ children }: HomeLayoutProps) {
  return (
    <>
      <div className="py-12 border-b border-neutral-800 bg-gradient-to-t from-neutral-900 to-neutral-800">
        <div className="container max-w-7xl mx-auto flex items-center">
          <div className="flex-1 flex flex-col space-y-4">
            <h2 className="font-semibold text-5xl max-w-2xl leading-[1.1]">
              The Next.js Discord server indexed in the web
            </h2>
            <a
              href="https://nextjs.org/discord"
              target="_blank"
              rel="noopener"
              className="text-xl"
            >
              Join the server ➔
            </a>
          </div>

          <div className="bg-slate-900 w-[200px] h-[200px]" />
        </div>
      </div>

      <LayoutWithSidebar>{children}</LayoutWithSidebar>
    </>
  )
}
