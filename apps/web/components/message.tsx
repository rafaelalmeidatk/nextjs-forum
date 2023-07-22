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
              className="hidden self-center text-center group-hover:flex w-full items-center text-xs opacity-70"
              dateTime={createdAtTimes.iso}
              title={createdAtTimes.tooltip}
            >
              <DisplayLocalTime short dateStr={createdAt.toISOString()} />
            </time>
          )}
        </div>

        <div className="flex-1 w-0">
          {isFirstRow && (
            <div className="flex items-center space-x-2">
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
                  <span className="ml-2 px-1 py-0.5 text-xs text-neutral-900 bg-neutral-300 rounded-full select-none">
                    OP
                  </span>
                )}
              </div>
              <time
                className="mt-[1px] text-xs opacity-70"
                dateTime={createdAtTimes.iso}
                title={createdAtTimes.tooltip}
              >
                <DisplayLocalTime dateStr={createdAt.toISOString()} />
              </time>
            </div>
          )}

          <MessageContent content={content} attachments={attachments} />
        </div>
      </div>
    </div>
  )
}
