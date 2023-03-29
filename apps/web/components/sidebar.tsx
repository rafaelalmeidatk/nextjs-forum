import { MostHelpful } from './most-helpful'

export const Sidebar = () => {
  return (
    <aside className="w-[300px]">
      {/* @ts-expect-error: async component */}
      <MostHelpful />
    </aside>
  )
}
