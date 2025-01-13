import Link from 'next/link'
import plur from 'plur'
import { buildPostTimeValues } from '@/utils/datetime'
import { UserAvatar } from '@/components/user-avatar.client'

type PostProps = {
  id: string
  title: string
  messagesCount: number
  createdAt: Date
  hasAnswer: boolean
  author: {
    username: string
    avatar: string
  }
}

export const Post = ({
  id,
  title,
  messagesCount,
  createdAt,
  hasAnswer,
  author,
}: PostProps) => {
  const createdAtTimes = buildPostTimeValues(createdAt)
  const borderColor = hasAnswer ? 'border-green-700' : 'border-neutral-700'

  return (
    <Link href={`/post/${id}`} className="block text-white no-underline">
      <div
        className={`border bg-neutral-800 px-4 py-3 ${borderColor} rounded hover:opacity-90`}
      >
        <p className="inline-block pr-2 text-lg font-semibold text-white">
          {title}
        </p>

        <div className="mt-2 flex items-center space-x-2">
          <UserAvatar
            className="h-5 w-5 rounded-full"
            src={author.avatar}
            alt={`${author.username}'s avatar`}
          />
          <div className="text-sm no-underline opacity-90">
            {author.username} asked on{' '}
            <time dateTime={createdAtTimes.iso} title={createdAtTimes.tooltip}>
              {createdAtTimes.text}
            </time>{' '}
            · {messagesCount} {plur('Message', messagesCount)}
            {hasAnswer && (
              <span>
                {' '}
                · <span className="font-semibold text-green-500">Answered</span>
              </span>
            )}
          </div>
        </div>
      </div>
    </Link>
  )
}
