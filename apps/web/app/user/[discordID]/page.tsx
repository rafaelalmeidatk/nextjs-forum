import { CalendarPlusIcon } from '@/components/icons/calender-plus'
import { HeartIcon } from '@/components/icons/heart'
import { MedalIcon } from '@/components/icons/medal'
import { Post } from '@/components/post'
import { getCanonicalUserUrl } from '@/utils/urls'
import { Metadata } from 'next'
import { db, sql } from '@nextjs-forum/db/node'
import { notFound } from 'next/navigation'

export const revalidate = 60
export const dynamic = 'error'

const getLeaderboardPosition = async (discordID: string) => {
  const result = await db
    .with('rankedUsers', (db) =>
      db
        .selectFrom('users')
        .select([
          'snowflakeId',
          sql<number>`RANK() OVER (ORDER BY COALESCE("answersCount", 0) DESC, "snowflakeId" DESC)`.as(
            'position',
          ),
        ]),
    )
    .selectFrom('rankedUsers')
    .select(['snowflakeId', 'position'])
    .where('snowflakeId', '=', discordID)
    .execute()

  return result.length > 0 ? result[0].position : null
}

const getUserData = async (discordID: string) => {
  const userData = await db
    .selectFrom('users')
    .select([
      'snowflakeId',
      'username',
      'avatarUrl',
      'answersCount',
      'isPublic',
      'joinedAt',
    ])
    .where('snowflakeId', '=', discordID)
    .executeTakeFirst()

  if (!userData) {
    return null
  }

  const position = await getLeaderboardPosition(discordID)

  return { ...userData, leaderBoardPosition: position ?? null }
}

const getUserPosts = async (discordID: string) => {
  // First query to get posts
  const posts = await db
    .selectFrom('posts')
    .innerJoin('messages', 'posts.answerId', 'messages.snowflakeId')
    .select(['posts.id'])
    .where('messages.userId', '=', discordID)
    .orderBy('posts.createdAt', 'desc')
    .limit(5)
    .execute()

  // Extract post IDs from the first query results
  const postIds = posts.map((post) => post.id)
  if (postIds.length === 0) {
    return []
  }
  // Second query to get additional details for the posts
  const detailedPosts = await db
    .selectFrom('posts')
    .where('posts.id', 'in', postIds)
    .innerJoin('users', 'users.snowflakeId', 'posts.userId')
    .leftJoin('messages', 'messages.snowflakeId', 'posts.answerId')
    .select([
      'posts.id',
      'posts.snowflakeId',
      'posts.title',
      'posts.createdAt',
      'users.username',
      'users.avatarUrl as userAvatar',
      sql<boolean>`messages.id is not null`.as('hasAnswer'),
      (eb) =>
        eb
          .selectFrom('messages')
          .select(eb.fn.countAll<string>().as('count'))
          .where('messages.postId', '=', eb.ref('posts.snowflakeId'))
          .where('messages.snowflakeId', '!=', eb.ref('posts.snowflakeId'))
          .as('messagesCount') as any, // Ensure the return type matches AliasedSelectQueryBuilder
    ])
    .orderBy('posts.createdAt', 'desc')
    .execute()

  return detailedPosts
}

export const generateMetadata = async ({
  params,
}: UserProps): Promise<Metadata> => {
  const userData = await getUserData(params.discordID)
  if (!userData || !userData.isPublic) {
    return notFound()
  }
  const title = userData.username
  const description = `${userData.username}'s profile on the Next.js Discord Forum`
  const url = getCanonicalUserUrl(params.discordID)

  return {
    title,
    description,
    alternates: {
      canonical: url,
    },
    openGraph: {
      title,
      description,
      url,
      type: 'website',
      siteName: 'Next.js Discord Forum',
    },
    twitter: {
      card: 'summary',
      title,
      description,
    },
  }
}

type UserProps = {
  params: { discordID: string }
}

const UserInfo = async ({ params }: UserProps) => {
  const userData = await getUserData(params.discordID)
  if (!userData || !userData.isPublic) {
    return notFound()
  }
  const recentPosts = await getUserPosts(params.discordID)

  return (
    <main className="w-full h-full flex flex-col items-center justify-center">
      <section className="w-full h-full flex flex-col xl:flex-row items-stretch justify-center max-w-7xl px-4 py-12 xl:py-16 gap-4 xl:gap-10">
        <div className="w-fit min-w-[20%] md:max-w-[50%] xl:max-w-[30%] flex flex-row items-stretch justify-start gap-4 shrink-0">
          <img
            className="size-16 rounded-full"
            src={userData.avatarUrl}
            alt={`User Avatar of ${userData.username}`}
          />
          <div className="w-fit h-auto flex flex-col items-start justify-start gap-1 max-w-[200px]">
            <h1 className="w-full text-xl md:text-2xl font-semibold text-white line-clamp-1">
              {userData.username}
            </h1>
            {userData.leaderBoardPosition && (
              <div className="flex flex-row items-center justify-center gap-1 w-fit h-fit opacity-80 pt-1 ">
                <MedalIcon size={4} className="mb-[1px]" />{' '}
                <p className="text-sm h-fit">
                  Leaderboard Position:{' '}
                  <span className="opacity-60">
                    {userData.leaderBoardPosition}
                  </span>
                </p>
              </div>
            )}
            {/* joinedAt can be nulled, as it could be in discord.js */}
            {userData.joinedAt && (
              <div className=" flex flex-row items-center justify-center gap-1 w-fit h-fit opacity-80 ">
                <CalendarPlusIcon size={4} className="mb-[1px]" />{' '}
                <p className="text-sm h-fit">
                  Joined:{' '}
                  <span className="opacity-60">
                    {userData.joinedAt?.toLocaleDateString()}
                  </span>
                </p>
              </div>
            )}
            <div className=" flex flex-row items-center justify-center gap-1 w-fit h-fit opacity-80 ">
              <HeartIcon size={4} className="mb-[1px]" />{' '}
              <p className="text-sm h-fit">
                Total Answers:{' '}
                <span className="text-green-500">{userData.answersCount}</span>
              </p>
            </div>
          </div>
        </div>
        <div className="w-full h-[1px] xl:w-[1px] bg-white/10 xl:h-auto mt-3 xl:mt-0"></div>
        <div className="w-full h-fit flex flex-col items-stretch justify-start gap-4  xl:py-0">
          {recentPosts.length > 0 ? (
            recentPosts.map((post) => (
              <Post
                key={post.id}
                id={post.snowflakeId}
                title={post.title}
                createdAt={post.createdAt}
                messagesCount={parseInt(post.messagesCount ?? '0', 10)}
                hasAnswer={post.hasAnswer}
                author={{ avatar: post.userAvatar, username: post.username }}
              />
            ))
          ) : (
            <p className="text-center text-lg">
              The user has no marked answers yet
            </p>
          )}
        </div>
      </section>
    </main>
  )
}

export default UserInfo
