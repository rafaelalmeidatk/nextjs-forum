import { ReactNode } from 'react'
import { Inter } from 'next/font/google'
import { Analytics } from '@vercel/analytics/react'

import './globals.css'
import { GitHubIcon } from '../components/icons/github'
import { NextIcon } from '../components/icons/next'
import { DiscordIcon } from '../components/icons/discord'
import { Metadata } from 'next'
import { getBaseUrl } from '../utils/urls'

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
})

export const metadata: Metadata = {
  metadataBase: new URL(getBaseUrl()),
  title: {
    default: 'Next.js Discord Forum',
    template: '%s | Next.js Discord Forum',
  },
  description: 'The web version of the Next.js Discord server',
  alternates: {
    canonical: getBaseUrl(),
  },
  openGraph: {
    title: {
      default: 'Next.js Discord Forum',
      template: '%s | Next.js Discord Forum',
    },
    description: 'The web version of the Next.js Discord server',
    type: 'website',
    url: getBaseUrl(),
    siteName: 'Next.js Discord Forum',
  },
  twitter: {
    card: 'summary',
    title: 'Next.js Discord Forum',
    description: 'The web version of the Next.js Discord server',
  },
}

type RootLayoutProps = { children: ReactNode }

const RootLayout = ({ children }: RootLayoutProps) => {
  return (
    <html lang="en" className={`${inter.className}`}>
      <body className="bg-black text-slate-900 text-white/80 min flex flex-col min-h-screen">
        <header className="">
          <div className="container max-w-7xl flex mx-auto px-4 py-6 justify-between items-center xl:mt-4">
            <h1 aria-hidden="true" className="sr-only">
              Next.js Discord
            </h1>

            <a
              href="/"
              className="hover:opacity-75 text-white/80 hover:no-underline transition-all duration-200"
            >
              <span className="flex flex-row xs:space-x-2  items-center">
                <NextIcon className="w-[90px]" />
                <span className=" text-2xl font-bold tracking-tighter">
                  Discord Forum
                </span>
              </span>
            </a>

            <div className=" space-x-5 hidden xs:flex">
              <a
                href="https://nextjs.org/discord"
                target="_blank"
                rel="noopener"
                aria-label="Discord Server Invite"
                className="hover:opacity-75 text-white/70 transition-all duration-200"
              >
                <DiscordIcon size={7} />
              </a>

              <a
                href="https://github.com/rafaelalmeidatk/nextjs-forum"
                target="_blank"
                rel="noopener"
                aria-label="Github Repository"
                className="hover:opacity-75 text-white/70 transition-all duration-200"
              >
                <GitHubIcon size={7} />
              </a>
            </div>
          </div>
        </header>

        <div className="flex-grow">{children}</div>

        <footer className="mt-12 pb-6">
          <div className="container max-w-7xl flex flex-col mx-auto px-4 py-6 justify-start items-center text-center text-white/50">
            Made by Rafael Almeida and the Next.js Community
          </div>
        </footer>

        <Analytics />
      </body>
    </html>
  )
}

export default RootLayout
