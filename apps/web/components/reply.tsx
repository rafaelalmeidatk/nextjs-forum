'use client'
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
    <button
      aria-label={`Scroll to reply from @${reply.author.username}`}
      onClick={() => {
        const element = document.getElementById(`message-${reply.messageID}`)
        if (element) {
          const elementRect = element.getBoundingClientRect()
          const absoluteElementTop = elementRect.top + window.scrollY
          const offset = window.innerHeight / 2 - elementRect.height / 2
          window.scrollTo({
            top: absoluteElementTop - offset,
            behavior: 'smooth',
          })
          history.pushState(null, '', `?replyID=${reply.messageID}`)
        }
      }}
      className="items-center justify-start flex flex-row scroll-smooth text-white"
    >
      <div className="relative flex w-[50px] flex-col items-end justify-end sm:w-[60px] h-[30px]">
        <ReplySplineIcon className="size-10 pt-2" />
      </div>
      <div className="flex w-0 flex-1 flex-row flex-nowrap items-center justify-start gap-2 text-xs md:text-base">
        <img
          src={reply.author.avatarUrl}
          alt="Avatar"
          className="size-5 shrink-0 rounded-full"
        />

        <div className="md:line-clamp-1 w-0 text-sm flex-1  line-clamp-2 text-left ">
          <span className="opacity-50 md:max-w-full">
            @{reply.author.username}
          </span>
          {'  '}
          <span className="  opacity-70">
            {reply.content.length == 0 && reply.attachments.length > 0 ? (
              <span className="italic">Click to see attachment</span>
            ) : reply.content.includes('```') ? (
              <span className="d-code-inline !whitespace-normal">
                {reply.content.replaceAll('```', '')}
              </span>
            ) : reply.content.includes('``') ? (
              <span className="d-code-inline !whitespace-normal ">
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
    </button>
  )
}
