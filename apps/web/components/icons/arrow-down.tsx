import { IconProps, IconSvg } from './base'

export const ArrowDownIcon = (props: IconProps) => (
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
      d="M19.5 13.5L12 21m0 0l-7.5-7.5M12 21V3"
    />
  </IconSvg>
)
