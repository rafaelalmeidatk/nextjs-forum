import { db, selectUuid, sql } from 'db/node'
import { Post } from '@/components/post'
import { notFound } from 'next/navigation'
import { ArrowLeftIcon } from '@/components/icons/arrow-left'
import { PaginationLink } from '@/components/pagination-link'
import { ArrowRightIcon } from '@/components/icons/arrow-right'
import { Metadata } from 'next'
import { getBaseUrl } from '@/utils/urls'

export const metadata: Metadata = {
  title: 'Next.js Discord Forum',
  description: 'The web version of the Next.js Discord server',
  // These tags are to avoid indexing the pagination pages -->
  alternates: {
    canonical: getBaseUrl(),
  },
  robots: {
    index: false,
    follow: false,
  },
  // <-- End
  openGraph: {
    title: 'Next.js Discord Forum',
    description: 'The web version of the Next.js Discord server',
    type: 'website',
    url: 'https://nextjs-forum.vercel.app',
    siteName: 'Next.js Discord Forum',
  },
  twitter: {
    card: 'summary',
    title: 'Next.js Discord Forum',
    description: 'The web version of the Next.js Discord server',
  },
}

const POSTS_BY_PAGE = 20

const getPostsByPage = async (pageNumber: number) => {
  const limit = POSTS_BY_PAGE
  const offset = (pageNumber - 1) * limit

  return await db
    .selectFrom('posts')
    .innerJoin('users', 'users.snowflakeId', 'posts.userId')
    .leftJoin('messages', 'messages.snowflakeId', 'posts.answerId')
    .select([
      selectUuid('posts.id').as('id'),
      'posts.snowflakeId',
      'posts.title',
      'posts.createdAt',
      'users.username',
      'users.avatarUrl as userAvatar',
      sql<number>`if (messages.id is null, 0, 1)`.as('hasAnswer'),
      (eb) =>
        eb
          .selectFrom('messages')
          .select(eb.fn.countAll<number>().as('count'))
          .where('messages.postId', '=', eb.ref('posts.snowflakeId'))
          .where('messages.snowflakeId', '!=', eb.ref('posts.snowflakeId'))
          .as('messagesCount'),
    ])
    .orderBy('createdAt', 'desc')
    .limit(limit + 1)
    .offset(offset)
    .execute()
}

type Params = { page: string }
type PaginationPageProps = { params: Params }

const PaginationPage = async ({ params }: PaginationPageProps) => {
  // Only positive integers
  if (!/^\d+$/g.test(params.page)) {
    notFound()
  }

  const page = parseInt(params.page, 10)
  if (Number.isNaN(page) || page < 1) {
    notFound()
  }

  const posts = await getPostsByPage(page)
  if (posts.length === 0) {
    notFound()
  }

  const postsToRender = posts.slice(0, POSTS_BY_PAGE)
  const hasPreviousPage = page > 1
  const hasNextPage = posts.length > POSTS_BY_PAGE

  return (
    <>
      <div className="space-y-2">
        {postsToRender.map((post) => (
          <Post
            key={post.id.toString()}
            id={post.snowflakeId}
            title={post.title}
            createdAt={post.createdAt}
            messagesCount={post.messagesCount}
            hasAnswer={post.hasAnswer === 1}
            author={{ avatar: post.userAvatar, username: post.username }}
          />
        ))}
      </div>
      <div className="mt-4 flex space-x-4 justify-center">
        {hasPreviousPage && (
          <PaginationLink
            href={`/page/${page - 1}`}
            iconLeft={<ArrowLeftIcon size={4} />}
          >
            Previous
          </PaginationLink>
        )}
        {hasNextPage && (
          <PaginationLink
            href={`/page/${page + 1}`}
            iconRight={<ArrowRightIcon size={4} />}
          >
            Next
          </PaginationLink>
        )}
      </div>
    </>
  )
}

export default PaginationPage
