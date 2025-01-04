'use client'
import { ImageIcon } from '@/components/icons/image'
import { BadReplyIcon } from '@/components/icons/reply-bad'
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
      aria-label={`Scroll to reply from @${reply.author.username}`}
      className="flex flex-row items-center justify-start scroll-smooth text-white"
    >
      <div className="relative flex h-[30px] w-[50px] flex-col items-end justify-end sm:w-[60px]">
        <ReplySplineIcon className="size-10 pt-2" />
      </div>
      <div className="flex w-0 flex-1 flex-row flex-nowrap items-center justify-start gap-2 text-xs md:text-base">
        <img
          src={reply.author.avatarUrl}
          alt="Avatar"
          className="size-5 shrink-0 rounded-full"
        />

        <div className="line-clamp-2 w-0 flex-1 text-left text-sm md:line-clamp-1">
          <span className="opacity-50 md:max-w-full">
            @{reply.author.username}
          </span>
          {'  '}
          <span className="opacity-70">
            {reply.content.length == 0 && reply.attachments.length > 0 ? (
              <span className="italic">Click to see attachment</span>
            ) : reply.content.includes('```') ? (
              <span className="d-code-inline !whitespace-normal">
                {reply.content.replaceAll('```', '')}
              </span>
            ) : reply.content.includes('``') ? (
              <span className="d-code-inline !whitespace-normal">
                {reply.content.replaceAll('``', '')}
              </span>
            ) : (
              reply.content
            )}{' '}
            {reply.attachments.length > 0 && (
              <ImageIcon className="ml-1 size-5" />
            )}
          </span>
        </div>
      </div>
    </a>
  )
}

export const DeletedReply = () => {
  return (
    <div className="flex flex-row items-center justify-start scroll-smooth text-white">
      <div className="relative flex h-[30px] w-[50px] flex-col items-end justify-end sm:w-[60px]">
        <ReplySplineIcon className="size-10 pt-2" />
      </div>
      <div className="flex w-0 flex-1 flex-row flex-nowrap items-center justify-center gap-1 text-xs md:text-base">
        <div className="flex h-fit w-fit items-center justify-center rounded-full bg-slate-700 p-1">
          <BadReplyIcon className="size-3" />
        </div>
        <div className="line-clamp-2 w-0 flex-1 text-left text-sm md:line-clamp-1">
          <span className="italic opacity-70">
            Original message was deleted
          </span>
        </div>
      </div>
    </div>
  )
}
