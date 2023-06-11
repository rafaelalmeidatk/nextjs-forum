import { buildPostTimeValues } from '@/utils/datetime'
import { parseDiscordMessage } from '@/utils/discord-markdown'
import 'highlight.js/styles/github-dark-dimmed.css'

export type Attachment = {
  id: string
  url: string
  name: string
  contentType: string
}

type MessageProps = {
  id: string
  content: string
  isFirstRow: boolean
  author: { username: string; avatarUrl: string }
  createdAt: Date
  attachments: Attachment[]
}

export const Message = ({
  content,
  isFirstRow,
  author,
  createdAt,
  attachments,
}: MessageProps) => {
  const htmlContent = parseDiscordMessage(content)
  const createdAtTimes = buildPostTimeValues(createdAt)

  return (
    <div className="group">
      <div className="flex">
        <div className="flex justify-center items-start w-[60px] sm:w-[80px] shrink-0">
          {isFirstRow ? (
            <img
              src={author.avatarUrl}
              alt="Avatar"
              className="w-10 h-10 rounded-full"
            />
          ) : (
            <time
              className="hidden self-center text-center group-hover:flex w-full justify-end items-center text-xs opacity-70 pr-2 "
              dateTime={createdAtTimes.iso}
              title={createdAtTimes.tooltip}
            >
              {createdAtTimes.shortText}
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
                {createdAtTimes.text}
              </time>
            </div>
          )}

          <div
            className="opacity-90 break-words"
            dangerouslySetInnerHTML={{ __html: htmlContent }}
          />

          <div className="mt-0.5 w-full max-w-[550px] space-y-1">
            {attachments.map((attachment) => (
              <div
                key={attachment.id}
                className="flex max-h-[350px] rounded-lg overflow-hidden"
              >
                <img
                  src={attachment.url}
                  alt="Image"
                  className="max-w-full h-auto object-cover"
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
