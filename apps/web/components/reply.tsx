import { ImageIcon } from '@/components/icons/image'
import { ReplySplineIcon } from '@/components/icons/reply-spline'
import { Attachment } from '@/components/message-content'
export type Reply = {
  author: {
    username: string
    avatarUrl: string
  }
  messageID: string
  content: string
  attachments: Attachment[]
}
export const MessageReply = ({ reply }: { reply: Reply }) => {
  return (
    <a
      href={`#message-${reply.messageID}`}
      className="flex flex-row scroll-smooth text-white"
    >
      <div className="relative flex w-[50px] flex-col items-end justify-end sm:w-[60px]">
        <ReplySplineIcon className="size-10 pt-2" />
      </div>
      <div className="flex w-0 flex-1 flex-row flex-nowrap items-center justify-start gap-2 text-xs md:text-base">
        <img
          src={reply.author.avatarUrl}
          alt="Avatar"
          className="size-5 shrink-0 rounded-full"
        />

        <p className="max-w-[100px] shrink-0 truncate opacity-50 md:max-w-full">
          @{reply.author.username}
        </p>
        <p className="min-w-0 truncate text-sm opacity-70">
          {reply.content.length == 0 && reply.attachments.length > 0 ? (
            <span className="italic">Click to see attachment</span>
          ) : reply.content.includes('```') ? (
            <span className="d-code-inline !whitespace-nowrap">
              {reply.content.replaceAll('```', '')}
            </span>
          ) : reply.content.includes('``') ? (
            <span className="d-code-inline !whitespace-nowrap">
              {reply.content.replaceAll('``', '')}
            </span>
          ) : (
            reply.content
          )}
          {reply.attachments.length > 0 && (
            <ImageIcon className="ml-2 size-5" />
          )}
        </p>
      </div>
    </a>
  )
}
