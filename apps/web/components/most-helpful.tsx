import { db } from '@nextjs-forum/db/node'
import { CheckCircleSolidIcon } from '@/components/icons/check-circle-solid'
import Link from 'next/link'

const getMostHelpfulUsers = async () => {
  return db
    .selectFrom('users')
    .select([
      'id',
      'username',
      'avatarUrl',
      'answersCount',
      'isPublic',
      'snowflakeId as userID',
    ])
    .orderBy('answersCount', 'desc')
    .orderBy('id', 'desc')
    .limit(15)
    .execute()
}

export const MostHelpful = async () => {
  const users = await getMostHelpfulUsers()

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
              {user.isPublic ? (
                <Link
                  className="opacity-90 text-white line-clamp-1 max-w-[200px]"
                  href={`/user/${user.userID}`}
                >
                  {user.username}
                </Link>
              ) : (
                <div className="opacity-50">{user.username}</div>
              )}
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
