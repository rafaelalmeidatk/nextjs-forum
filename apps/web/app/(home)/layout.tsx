import { LayoutWithSidebar } from '@/components/layout-with-sidebar'
import discordImage from '@/discord.png'
import Image from 'next/image'
import { ReactNode } from 'react'

type HomeLayoutProps = { children: ReactNode }

export default function HomeLayout({ children }: HomeLayoutProps) {
  return (
    <>
      <div className="relative py-16 border-b border-neutral-800 bg-gradient-to-t from-neutral-900 to-neutral-800 overflow-hidden">
        <div className="container max-w-7xl mx-auto flex items-center">
          <div className="flex-1 flex flex-col px-4 space-y-4 z-10 text-center lg:text-left">
            <h2 className="font-semibold text-5xl lg:max-w-2xl leading-[1.1]">
              The Next.js Discord server indexed in the web
            </h2>
            <a
              href="https://nextjs.org/discord"
              target="_blank"
              rel="noopener"
              className="text-xl w-fit hover:opacity-80 transition-opacity"
            >
              Join the server ➔
            </a>
          </div>

          <div
            className="hidden lg:flex absolute top-0 bottom-0 left-1/2"
            style={{
              WebkitMaskImage:
                'linear-gradient(to bottom, rgba(0, 0, 0, 1.0) 50%, transparent 100%)',
              maskImage:
                'linear-gradient(to top, rgba(0, 0, 0, 1.0) 0%, transparent 100%)',
            }}
          >
            <div>
              <Image
                src={discordImage}
                alt=""
                quality={90}
                className="block relative -top-11 -skew-x-3 opacity-90 "
                style={{
                  WebkitMaskImage:
                    'linear-gradient(to right, transparent 0%, rgba(0, 0, 0, 1.0) 20%, rgba(0, 0, 0, 1.0) 80%, transparent 100%)',
                  maskImage:
                    'linear-gradient(to top, rgba(0, 0, 0, 1.0) 0%, transparent 100%)',
                }}
              />
            </div>
          </div>
        </div>
      </div>

      <LayoutWithSidebar>{children}</LayoutWithSidebar>
    </>
  )
}
