import { toHTML } from 'discord-markdown'

export type Attachment = {
  id: string
  url: string
  name: string
  contentType: string
}

type MessageProps = {
  id: string
  content: string
  attachments: Attachment[]
}

export const Message = ({ content, attachments }: MessageProps) => {
  const htmlContent = toHTML(content)

  return (
    <div className="p-4 border border-gray-50 rounded">
      <div dangerouslySetInnerHTML={{ __html: htmlContent }} />
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
  )
}
