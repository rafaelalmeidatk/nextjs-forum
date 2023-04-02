import Link from 'next/link'
import { ReactNode } from 'react'

type PaginationLinkProps = {
  iconLeft?: ReactNode
  iconRight?: ReactNode
  href: string
  children: ReactNode
}

export const PaginationLink = ({
  href,
  iconLeft,
  iconRight,
  children,
}: PaginationLinkProps) => {
  return (
    <Link
      href={href}
      className="px-2 py-1 border border-neutral-700 rounded-lg text-neutral-300 hover:text-neutral-100"
    >
      <span className="flex items-center space-x-1 opacity-90">
        {iconLeft}
        <span>{children}</span>
        {iconRight}
      </span>
    </Link>
  )
}
