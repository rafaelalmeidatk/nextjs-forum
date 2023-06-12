import { parseDiscordMessage } from '@/utils/discord-markdown'

export type Attachment = {
  id: string
  url: string
  name: string
  contentType: string
}

type MessageContentProps = {
  content: string
  attachments: Attachment[]
}

export const MessageContent = async ({
  content,
  attachments,
}: MessageContentProps) => {
  const htmlContent = await parseDiscordMessage(content)

  return (
    <>
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
    </>
  )
}
