import { db, selectUuid } from '@nextjs-forum/db/node'
import { CheckCircleSolidIcon } from '@/components/icons/check-circle-solid'

const getMostHelpfulUsers = async () => {
  return db
    .selectFrom('users')
    .select([
      selectUuid('id').as('id'),
      'username',
      'avatarUrl',
      'answersCount',
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

export const MostHelpfulLoading = () => {
  const randomSizes = [175, 105, 190, 115];

  return (
    <>
      <div className="text-lg font-semibold">Most Helpful</div>

      <div className="mt-2 grid grid-cols-1 divide-y divide-neutral-800">
        {Array.from({length: 15}).map((_, i) => (
          <div key={i} className="flex justify-between py-2">
            <div className="flex space-x-2 items-center">
              <div className="w-4 h-4 rounded-full animate-pulse bg-gray-700/50" />
              <div
                className="opacity-90 animate-pulse bg-gray-600/50 w-40 h-4 rounded-sm"
                style={{
                  width: randomSizes[i % randomSizes.length],
                }}
              />
            </div>
            <div className="flex items-center space-x-1 opacity-90">
              {/* <CheckCircleSolidIcon size={5} /> */}
              <span className="text-sm animate-pulse w-7 h-3 rounded-sm bg-gray-700/50" />
            </div>
          </div>
        ))}
      </div>
    </>
  );
};

