import plur from 'plur'
import { DateTime } from 'luxon'
import { formatPostDate } from '../utils/datetime'

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
  const createdAtDateTime = DateTime.fromJSDate(createdAt)
  const createdAtText = formatPostDate(createdAtDateTime)
  const createdAtTooltip = createdAtDateTime.toLocaleString({
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: 'numeric',
    second: 'numeric',
    timeZoneName: 'short',
  })
  const borderColor = hasAnswer ? 'border-green-700' : 'border-neutral-700'

  return (
    <div className={`px-4 py-3 border bg-neutral-800 ${borderColor} rounded`}>
      <a
        className="inline-block pr-2 text-lg font-semibold hover:opacity-75"
        href={`/post/${id}`}
      >
        {title}
      </a>

      <div className="mt-2 flex items-center space-x-2">
        <img
          src={author.avatar}
          alt={`${author.username}'s avatar`}
          className="rounded-full w-5 h-5"
        />
        <div className="text-sm opacity-90">
          {author.username} asked on{' '}
          <time dateTime={createdAtDateTime.toISO()} title={createdAtTooltip}>
            {createdAtText}
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
  )
}
