import Link from 'next/link'
import plur from 'plur'
import { buildPostTimeValues } from '@/utils/datetime'
import { MessageAnsweredIcon } from './icons/message-answered'
import { MessageCountIcon } from './icons/message-count'
import { PostTimeIcon } from './icons/post-time'

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
  return (
    <div className="border-t border-t-white/5">
      <Link
        href={`/post/${id}`}
        className={`block text-white no-underline hover:no-underline -ml-4 border border-transparent hover:bg-neutral-900/60 hover:border-neutral-900 rounded-md hover:brightness-125 transition-all duration-75 pb-0.5`}
      >
        <div className="flex flex-row px-4 py-3 items-start">
          <div className={`flex-1  `}>
            <p className="text-white/90 inline-block pr-2 text-lg font-medium break-all leading-snug">
              {title}
            </p>

            <div className="mt-1 flex items-center space-x-1.5">
              <div className="text-sm opacity-40 no-underline">by</div>
              <img
                src={author.avatar}
                alt={`${author.username}'s avatar`}
                className="rounded-full w-4 h-4"
              />
              <div className="text-sm text-white/70 no-underline">
                {author.username}
                <span className="text-white/40"> · </span>
                {/* <PostTimeIcon size={ 4 } /> */}
                <time
                  dateTime={createdAtTimes.iso}
                  title={createdAtTimes.tooltip}
                >
                  {createdAtTimes.relative}
                </time>{' '}
                {hasAnswer && (
                  <span>
                    {' '}
                    ·{' '}
                    <span className="font-medium text-green-500">Answered</span>
                  </span>
                )}
              </div>
            </div>
          </div>
          <div className="flex flex-row gap-1 items-center text-white/40">
            <div className="">
              {hasAnswer ? (
                <MessageAnsweredIcon size={4} className="text-green-600" />
              ) : (
                <MessageCountIcon size={4} />
              )}
            </div>
            <div className="min-w-[1rem] text-right text-sm">
              {messagesCount}
            </div>
          </div>
        </div>
      </Link>
    </div>
  )
}
