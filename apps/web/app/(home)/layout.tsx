import { LayoutWithSidebar } from '@/components/layout-with-sidebar'
import Balancer from 'react-wrap-balancer'
import discordImage from '@/discord.png'
import Image from 'next/image'
import { ReactNode } from 'react'

type HomeLayoutProps = { children: ReactNode }

export default function HomeLayout({ children }: HomeLayoutProps) {
  return (
    <>
      <div className="relative py-16 overflow-hidden">
        <div className="container max-w-3xl lg:max-w-5xl mx-auto flex items-center pl-4">
          <div className="flex-1 flex flex-col px-4 space-y-5 z-10">
            <h2 className="font-bold text-[2.5rem] max-w-2xl leading-[1.1] bg-gradient-to-tr from-white/40 to-white text-transparent bg-clip-text">
              <Balancer ratio={0.55}>
                Next.js Discord server indexed in the web
              </Balancer>
            </h2>
            <a
              href="https://nextjs.org/discord"
              target="_blank"
              rel="noopener"
              className="px-7 py-2 rounded-lg text-sm text-black font-semibold w-fit hover:opacity-80 hover:no-underline transition-opacity bg-white/80"
            >
              Join the server {'->'}
            </a>
          </div>
          <div
            className="flex absolute top-4 bottom-0 left-3/4 md:left-2/3 lg:left-1/2 min-w-full"
            style={{
              WebkitMaskImage:
                'linear-gradient(to bottom, rgba(0, 0, 0, 1.0) 50%, transparent 100%)',
              maskImage:
                'linear-gradient(to bottom, rgba(0, 0, 0, 1.0) 50%, transparent 100%)',
            }}
          >
            <div>
              <Image
                src={discordImage}
                alt=""
                quality={90}
                className="block relative top-0 -skew-x-3 brightness-75 "
                style={{
                  WebkitMaskImage:
                    'radial-gradient(90.98% 90.93% at 0 0, #000 0%, rgba(0, 0, 0, 0.00) 100%)',
                  maskImage:
                    'radial-gradient(90.98% 90.93% at 0 0, #000 0%, rgba(0, 0, 0, 0.00) 100%)',
                }}
              />
            </div>
          </div>
          d
        </div>
      </div>

      <LayoutWithSidebar>
        <header className="mb-8">
          <h2 className="text-3xl mb-4 font-medium">Questions</h2>
          <div className="flex flex-row gap-4 text-sm text-white/50 [&_div]:pb-2">
            <div className="text-white border-b">All</div>
            <div>Answered</div>
            <div>Unanswered</div>
            <div>No replies</div>
          </div>
        </header>
        {children}
      </LayoutWithSidebar>
    </>
  )
}
