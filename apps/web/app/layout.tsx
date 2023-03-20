import { ReactNode } from 'react'
import { Inter } from 'next/font/google'

import './globals.css'

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
})

export const metadata = {
  title: 'Next.js Discord Forum',
  description: 'The web version of the Next.js Discord server',
}

type RootLayoutProps = { children: ReactNode }

const RootLayout = ({ children }: RootLayoutProps) => {
  return (
    <html lang="en" className={`${inter.className} dark`}>
      <body className="bg-neutral-50 dark:bg-neutral-900 text-slate-900 dark:text-white">
        {children}
      </body>
    </html>
  )
}

export default RootLayout
