import { IconProps, IconSvg } from './base'

export const ArrowRightIcon = (props: IconProps) => (
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
      d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3"
    />
  </IconSvg>
)
