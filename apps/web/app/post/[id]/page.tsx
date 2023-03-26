import { notFound } from 'next/navigation'
import { db, selectUuid, sql } from 'db/node'
import { Attachment, Message } from '../../../components/message'

import '../../discord-markdown.css'
import { LayoutWithSidebar } from '../../../components/layout-with-sidebar'
import { groupMessagesByUser } from '../../../utils/group-messages'
import { MessageGroup } from '../../../components/message-group'

const getPost = async (snowflakeId: string) => {
  return await db
    .selectFrom('posts')
    .innerJoin('users', 'users.snowflakeId', 'posts.userId')
    .select([
      selectUuid('posts.id').as('id'),
      'posts.title',
      'posts.createdAt',
      'users.username',
      'users.avatarUrl as userAvatar',
      (eb) =>
        eb
          .selectFrom('messages')
          .select(eb.fn.countAll<number>().as('count'))
          .where('messages.postId', '=', eb.ref('posts.snowflakeId'))
          .as('messagesCount'),
    ])
    .where('posts.snowflakeId', '=', snowflakeId)
    .executeTakeFirst()
}

const getMessages = async (postId: string) => {
  return await db
    .selectFrom('messages')
    .leftJoin('attachments', 'attachments.messageId', 'messages.snowflakeId')
    .innerJoin('users', 'users.snowflakeId', 'messages.userId')
    .select([
      selectUuid('messages.id').as('id'),
      'messages.content',
      'messages.createdAt',
      selectUuid('users.id').as('authorId'),
      'users.avatarUrl as authorAvatarUrl',
      'users.username as authorUsername',
      sql<Attachment[]>`
        if(
          count(attachments.id) > 0,
          json_arrayagg(
            json_object(
              'id', ${selectUuid('attachments.id')},
              'url', attachments.url,
              'name', attachments.name,
              'contentType', attachments.contentType
            )
          ),
          json_array()
        )
      `.as('attachments'),
    ])
    .where('postId', '=', postId)
    .groupBy('messages.id')
    .orderBy('messages.createdAt', 'asc')
    .execute()
}

type PostProps = {
  params: { id: string }
}

const Post = async ({ params }: PostProps) => {
  const post = await getPost(params.id)
  if (!post) {
    notFound()
  }

  const messages = await getMessages(params.id)
  const postMessage = messages[0]
  const groupedMessages = groupMessagesByUser(messages.slice(1))

  return (
    <LayoutWithSidebar className="mt-4">
      <div>
        <h1 className="mb-4 font-semibold text-3xl">{post.title}</h1>
        <div className="flex items-center space-x-2">
          <div className="px-2.5 py-1 border rounded-full opacity-60">
            Unanswered
          </div>
          <div className="">{post.username} posted this in #help-forum</div>
        </div>
      </div>

      <div className="mt-4">
        <MessageGroup>
          <Message
            id={postMessage.id.toString()}
            createdAt={postMessage.createdAt}
            content={postMessage.content}
            isFirstRow
            author={{
              username: postMessage.authorUsername,
              avatarUrl: postMessage.authorAvatarUrl,
            }}
            attachments={postMessage.attachments}
          />
        </MessageGroup>
      </div>

      <h2 className="my-4 text-lg font-semibold">
        {messages.length - 1} Replies
      </h2>

      <div className="space-y-2">
        {groupedMessages.map((group) => (
          <MessageGroup key={group.id}>
            {group.messages.map((message, i) => (
              <Message
                key={message.id.toString()}
                id={message.id.toString()}
                createdAt={message.createdAt}
                content={message.content}
                isFirstRow={i === 0}
                author={{
                  username: message.authorUsername,
                  avatarUrl: message.authorAvatarUrl,
                }}
                attachments={message.attachments}
              />
            ))}
          </MessageGroup>
        ))}
      </div>
    </LayoutWithSidebar>
  )
}

export default Post
