import { ComponentProps } from 'react'
import { twMerge } from 'tailwind-merge'

export type IconProps = ComponentProps<'svg'> & {
  size?: keyof typeof sizes
}

const sizes = {
  3: 'w-3 h-3',
  4: 'w-4 h-4',
  5: 'w-5 h-5',
  6: 'w-6 h-6',
  7: 'w-7 h-7',
  8: 'w-8 h-8',
  14: 'w-14 h-14',
}

export const IconSvg = ({ size = 6, className, ...props }: IconProps) => {
  return (
    <svg
      className={twMerge(
        `${sizes[size]} inline-block shrink-0 text-current align-middle`,
        className,
      )}
      fill="none"
      {...props}
    />
  )
}
