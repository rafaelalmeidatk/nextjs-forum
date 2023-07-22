import { db, selectUuid, sql } from '@nextjs-forum/db/node'
import { ArrowLeftIcon } from '@/components/icons/arrow-left'
import { ArrowRightIcon } from '@/components/icons/arrow-right'
import { PaginationLink } from '@/components/pagination-link'
import { Post } from '@/components/post'
import { Inbox } from './icons/inbox'
import { Balancer } from 'react-wrap-balancer'

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
    // Add one more result so we can know if there's a next page, not the
    // prettiest solution but it works great
    .limit(limit + 1)
    .offset(offset)
    .execute()
}

type PostsListProps = {
  page: number
}

export const PostsList = async ({ page }: PostsListProps) => {
  const posts = await getPostsByPage(page)

  if (posts.length === 0) {
    return (
      <div className="flex flex-col space-y-2 items-center justify-center">
        <Inbox size={14} className="opacity-75" />
        <div className="text-xl text-center w-full opacity-80">
          <Balancer>
            There are no posts indexed yet! Try checking again later
          </Balancer>
        </div>
      </div>
    )
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
            messagesCount={post.messagesCount ?? 0}
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
