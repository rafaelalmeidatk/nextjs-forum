import { db, selectUuid } from '@nextjs-forum/db/node'
import { CheckCircleSolidIcon } from '@/components/icons/check-circle-solid'
import { unstable_cache } from 'next/cache'

const QUERY_REVALIDATE_TIME = 24 * 60 * 60

const getMostHelpfulUsers = async () => {
  return db
    .selectFrom('users')
    .select([
      selectUuid('users.id').as('id'),
      'users.username',
      'users.avatarUrl',
      (eb) =>
        eb
          .selectFrom('posts')
          .select(eb.fn.countAll<number>().as('count'))
          .innerJoin('messages', (join) =>
            join
              .onRef('messages.snowflakeId', '=', 'posts.answerId')
              .onRef('messages.userId', '=', 'users.snowflakeId')
          )
          .as('answersCount'),
    ])
    .orderBy('answersCount', 'desc')
    .orderBy('users.username')
    .limit(5)
    .execute()
}

export const MostHelpful = async () => {
  const users = await unstable_cache(getMostHelpfulUsers, [], {
    revalidate: QUERY_REVALIDATE_TIME,
  })()

  if (users.length === 0) return null

  return (
    <>
      <div className="text-lg font-semibold">Most Helpful</div>

      <div className="mt-2 grid grid-cols-1 divide-y divide-neutral-800">
        {users.map((user) => (
          <div key={user.id} className="flex justify-between py-2">
            <div className="flex space-x-2 items-center">
              <img
                src={user.avatarUrl}
                alt="Avatar"
                className="w-4 h-4 rounded-full"
              />
              <div className="opacity-90">{user.username}</div>
            </div>
            <div className="flex items-center space-x-1 opacity-90">
              <CheckCircleSolidIcon size={5} />
              <span className="text-sm ">{user.answersCount}</span>
            </div>
          </div>
        ))}
      </div>
    </>
  )
}
