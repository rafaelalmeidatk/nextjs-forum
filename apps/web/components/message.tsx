import { buildPostTimeValues } from '@/utils/datetime'
import { DisplayLocalTime } from './local-time'
import 'highlight.js/styles/github-dark-dimmed.css'
import { Attachment, MessageContent } from './message-content'
import { IncognitoIcon } from './icons/incognito'
import { ShieldCheckIcon } from './icons/shield-check'

type MessageProps = {
  snowflakeId: string
  content: string
  isFirstRow: boolean
  author: {
    username: string
    avatarUrl: string
    isPublic: boolean
    isOP: boolean
    isModerator: boolean
  }
  createdAt: Date
  attachments: Attachment[]
}

export const Message = ({
  snowflakeId,
  content,
  isFirstRow,
  author,
  createdAt,
  attachments,
}: MessageProps) => {
  const createdAtTimes = buildPostTimeValues(createdAt)

  return (
    <div id={`message-${snowflakeId}`} className="group ">
      <div className="flex flex-row items-start pointer-events-none [&>*]:pointer-events-auto">
        <div className="flex justify-start items-start w-[50px] sm:w-[60px] shrink-0">
          {isFirstRow ? (
            <img
              src={author.avatarUrl}
              alt="Avatar"
              className="w-10 h-10 rounded-full"
            />
          ) : (
            <time
              className="hidden self-center text-center group-hover:flex w-full h-[1.35lh] items-end text-xs opacity-70"
              dateTime={createdAtTimes.iso}
              title={createdAtTimes.tooltip}
            >
              <DisplayLocalTime short dateStr={createdAt.toISOString()} />
            </time>
          )}
        </div>

        <div className="flex-1 w-0">
          {isFirstRow && (
            <div className="flex items-center mb-0.5">
              <div className="font-semibold whitespace-nowrap overflow-hidden text-ellipsis">
                {author.username}
                {!author.isPublic && (
                  <i title="User's profile isn't public">
                    <IncognitoIcon className="pl-2" />
                  </i>
                )}
                {author.isModerator && (
                  <i title="User is a moderator">
                    <ShieldCheckIcon className="pl-1" />
                  </i>
                )}
                {author.isOP && (
                  <span className="ml-2 px-1 py-0.5 font-medium text-xs text-neutral-900 bg-neutral-300 rounded-md select-none">
                    OP
                  </span>
                )}
                <time
                  className="mt-[1px] ml-2 text-xs opacity-70 font-normal"
                  dateTime={createdAtTimes.iso}
                  title={createdAtTimes.tooltip}
                >
                  <DisplayLocalTime dateStr={createdAt.toISOString()} />
                </time>
              </div>
            </div>
          )}

          <MessageContent content={content} attachments={attachments} />
        </div>
      </div>
    </div>
  )
}
