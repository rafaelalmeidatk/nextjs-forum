import { IconProps, IconSvg } from './base'

export const ArrowLeftIcon = (props: IconProps) => (
  <IconSvg
    viewBox="0 0 24 24"
    fill="none"
    strokeWidth={1.5}
    stroke="currentColor"
    {...props}
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M19.5 12h-15m0 0l6.75 6.75M4.5 12l6.75-6.75"
    />
  </IconSvg>
)
