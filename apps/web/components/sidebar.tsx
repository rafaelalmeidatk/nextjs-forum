import { MostHelpful, MostHelpfulLoading } from '@/components/most-helpful'
import { Suspense } from 'react'

export const Sidebar = () => {
  return (
    <aside className="w-[300px]">
      <Suspense fallback={<MostHelpfulLoading />}>
        <MostHelpful />
      </Suspense>
    </aside>
  )
}
