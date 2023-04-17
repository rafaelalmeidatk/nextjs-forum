import { ReactNode } from 'react'
import { Inter } from 'next/font/google'

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
    url: 'https://nextjs-forum.vercel.app',
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
    <html lang="en" className={`${inter.className} dark`}>
      <body className="bg-neutral-50 dark:bg-neutral-900 text-slate-900 dark:text-white">
        <header className="border-b border-neutral-700">
          <div className="container max-w-7xl flex mx-auto px-4 py-6 justify-between items-center">
            <h1 aria-hidden="true" className="sr-only">
              Next.js Discord
            </h1>

            <a href="/" className="hover:opacity-75">
              <span className="flex flex-col xs:flex-row xs:space-x-2  xs:items-center">
                <NextIcon className="w-[90px]" />
                <span className=" text-2xl font-bold tracking-tighter">
                  Discord Forum
                </span>
              </span>
            </a>

            <div className="flex space-x-5">
              <a
                href="https://nextjs.org/discord"
                target="_blank"
                rel="noopener"
                aria-label="Discord Server Invite"
                className="hover:opacity-75"
              >
                <DiscordIcon size={7} />
              </a>

              <a
                href="https://github.com/rafaelalmeidatk/nextjs-forum"
                target="_blank"
                rel="noopener"
                aria-label="Github Repository"
                className="hover:opacity-75"
              >
                <GitHubIcon size={7} />
              </a>
            </div>
          </div>
        </header>

        {children}
      </body>
    </html>
  )
}

export default RootLayout
