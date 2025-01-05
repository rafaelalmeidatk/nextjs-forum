import { buildPostTimeValues } from '@/utils/datetime'
import 'highlight.js/styles/github-dark-dimmed.css'
import Link from 'next/link'
import { IncognitoIcon } from './icons/incognito'
import { ShieldCheckIcon } from './icons/shield-check'
import { DisplayLocalTime } from './local-time'
import { Attachment, MessageContent } from './message-content'
import { DeletedReply, MessageReply, Reply } from '@/components/reply'
import { MessageWrapper } from '@/components/message-wrapper'
type MessageProps = {
  snowflakeId: string
  content: string
  isFirstRow: boolean
  reply?: Reply | 'deleted'
  author: {
    username: string
    avatarUrl: string
    isPublic: boolean
    isOP: boolean
    isModerator: boolean
    userID: string
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
  reply,
}: MessageProps) => {
  const createdAtTimes = buildPostTimeValues(createdAt)

  return (
    <MessageWrapper snowflakeId={snowflakeId}>
      <div id={`message-${snowflakeId}`} className="group">
        <div className="pointer-events-none flex w-full grow-0 flex-col items-stretch justify-start gap-1 md:gap-0 p-2 [&>*]:pointer-events-auto">
          {reply &&
            (typeof reply === 'string' ? (
              <DeletedReply />
            ) : (
              <MessageReply reply={reply} />
            ))}
          <div className="flex flex-row">
            <div className="flex w-[50px] shrink-0 items-start justify-start sm:w-[60px]">
              {isFirstRow ? (
                <img
                  src={author.avatarUrl}
                  alt="Avatar"
                  className="h-10 w-10 rounded-full"
                />
              ) : (
                <time
                  className="hidden w-full items-center self-center text-center text-xs opacity-70 group-hover:flex"
                  dateTime={createdAtTimes.iso}
                  title={createdAtTimes.tooltip}
                >
                  <DisplayLocalTime short dateStr={createdAt.toISOString()} />
                </time>
              )}
            </div>

            <div className="w-0 flex-1">
              {isFirstRow && (
                <div className="flex items-center space-x-2">
                  <div className="overflow-hidden text-ellipsis whitespace-nowrap font-semibold">
                    {author.isPublic ? (
                      <Link
                        className="text-white opacity-90"
                        href={`/user/${author.userID}`}
                      >
                        {author.username}
                      </Link>
                    ) : (
                      <span className="opacity-50">{author.username}</span>
                    )}

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
                      <span className="ml-2 select-none rounded-full bg-neutral-300 px-1 py-0.5 text-xs text-neutral-900">
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
      </div>
    </MessageWrapper>
  )
}
