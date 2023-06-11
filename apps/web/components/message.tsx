import { buildPostTimeValues } from '@/utils/datetime'
import { DisplayLocalTime } from './local-time'
import 'highlight.js/styles/github-dark-dimmed.css'
import { Attachment, MessageContent } from './message-content'

type MessageProps = {
  snowflakeId: string
  content: string
  isFirstRow: boolean
  author: { username: string; avatarUrl: string }
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
      <div className="flex pt-16 -mt-16 pointer-events-none [&>*]:pointer-events-auto">
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
