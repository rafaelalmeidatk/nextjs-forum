import { notFound } from 'next/navigation'
import { Metadata } from 'next'
import { getBaseUrl } from '@/utils/urls'
import { PostsList } from '@/components/posts-list'

// This page is probably temporary, it doesn't benefit SEO so
// it's probably a good idea to replace it with an infinite scroll
// in the home page. We can decide which paginating method is better
// later on if we create a search page

export const metadata: Metadata = {
  // Avoid indexing the pagination pages
  alternates: { canonical: getBaseUrl() },
  robots: {
    index: false,
    follow: false,
  },
}

type Params = Promise<{ page: string }>
type PaginationPageProps = { params: Params }

const PaginationPage = async (props: PaginationPageProps) => {
  const params = await props.params

  // Only positive integers
  if (!/^\d+$/g.test(params.page)) {
    notFound()
  }

  const page = parseInt(params.page, 10)
  if (Number.isNaN(page) || page < 1) {
    notFound()
  }

  return <PostsList page={page} />
}

export default PaginationPage
