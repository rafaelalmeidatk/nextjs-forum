import { notFound } from 'next/navigation'
import { db, selectUuid, sql } from 'db/node'
import { Attachment, Message } from '../../../components/message'

import '../../discord-markdown.css'
import { LayoutWithSidebar } from '../../../components/layout-with-sidebar'

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
    .select([
      selectUuid('messages.id').as('id'),
      'messages.content',
      'messages.createdAt',
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
    .leftJoin('attachments', 'attachments.messageId', 'messages.snowflakeId')
    .groupBy('messages.id')
    .orderBy('messages.createdAt', 'asc')
    .execute()
}

type PostProps = {
  params: { id: string }
}

const Post = async ({ params }: PostProps) => {
  const post = await getPost(params.id)
  const messages = await getMessages(params.id)

  if (!post) {
    notFound()
  }

  return (
    <LayoutWithSidebar className="mt-4">
      <h1 className="mb-4 font-semibold text-3xl">{post.title}</h1>
      <div className="p-4 border border-neutral-800 rounded space-y-0.5">
        {messages.map((message, i) => (
          <Message
            key={message.id.toString()}
            id={message.id.toString()}
            createdAt={message.createdAt}
            content={message.content}
            isFirstRow={i === 0}
            author={{ username: post.username, avatarUrl: post.userAvatar }}
            attachments={message.attachments}
          />
        ))}
      </div>
    </LayoutWithSidebar>
  )
}

export default Post
