import { IconProps, IconSvg } from './base'

export const CalendarPlusIcon = (props: IconProps) => (
  <IconSvg
    viewBox="0 0 24 24"
    fill="none"
    strokeWidth={2}
    stroke="currentColor"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <path d="M8 2v4" />
    <path d="M16 2v4" />
    <path d="M21 13V6a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h8" />
    <path d="M3 10h18" />
    <path d="M16 19h6" />
    <path d="M19 16v6" />
  </IconSvg>
)
