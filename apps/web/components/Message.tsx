import { toHTML } from 'discord-markdown'

type MessageProps = {
  id: string
  content: string
}

export const Message = ({ content }: MessageProps) => {
  const htmlContent = toHTML(content)

  return (
    <div className="p-4 border border-gray-50 rounded">
      <div dangerouslySetInnerHTML={{ __html: htmlContent }} />
    </div>
  )
}
