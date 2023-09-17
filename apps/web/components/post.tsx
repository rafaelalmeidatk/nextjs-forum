import Link from 'next/link'
import plur from 'plur'
import { buildPostTimeValues } from '@/utils/datetime'
import { DisplayLocalTime } from './local-time'

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
        className={`px-4 py-3 border bg-neutral-800 ${borderColor} rounded hover:opacity-90`}
      >
        <p className="text-white inline-block pr-2 text-lg font-semibold">
          {title}
        </p>

        <div className="mt-2 flex items-center space-x-2">
          <img
            src={author.avatar}
            alt={`${author.username}'s avatar`}
            className="rounded-full w-5 h-5"
          />
          <div className="text-sm opacity-90 no-underline">
            {author.username} asked on{' '}
            <time dateTime={createdAtTimes.iso} title={createdAtTimes.tooltip}>
              <DisplayLocalTime dateStr={createdAt.toISOString()} />
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
