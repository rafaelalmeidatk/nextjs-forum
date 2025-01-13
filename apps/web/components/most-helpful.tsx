import { db } from '@nextjs-forum/db/node'
import { CheckCircleSolidIcon } from '@/components/icons/check-circle-solid'
import Link from 'next/link'
import { UserAvatar } from '@/components/user-avatar.client'

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
            <div className="flex items-center space-x-2">
              <UserAvatar
                className="h-4 w-4 rounded-full"
                src={user.avatarUrl}
                alt="Avatar"
              />
              {user.isPublic ? (
                <Link
                  className="line-clamp-1 max-w-[200px] text-white opacity-90"
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
              <span className="text-sm">{user.answersCount}</span>
            </div>
          </div>
        ))}
      </div>
    </>
  )
}
