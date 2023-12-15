import Link from 'next/link'
import { ReactNode } from 'react'
import { twMerge } from 'tailwind-merge'

type PaginationLinkProps = {
  iconLeft?: ReactNode
  iconRight?: ReactNode
  href: string
  children: ReactNode
  disabled?: boolean
}

export const PaginationLink = ({
  href,
  iconLeft,
  iconRight,
  children,
  disabled,
}: PaginationLinkProps) => {
  const Comp = disabled ? 'div' : Link
  return (
    <Comp
      href={disabled ? '' : href}
      className={twMerge(
        'px-3 py-1.5 text-neutral-300 no-underline w-32 group flex',
        disabled
          ? 'text-neutral-500 select-none'
          : 'hover:text-neutral-100 hover:no-underline',
      )}
    >
      <div
        className={twMerge(
          'flex items-center space-x-1 opacity-90 border-b border-b-transparent',
          iconLeft ? 'justify-end' : 'justify-start',
          disabled ? '' : 'group-hover:border-b-white',
        )}
      >
        {iconLeft}
        <span className="text-sm">{children}</span>
        {iconRight}
      </div>
    </Comp>
  )
}
