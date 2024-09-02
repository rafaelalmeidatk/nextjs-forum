import '../../discord-markdown.css'

import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import plur from 'plur'
import { db, sql } from '@nextjs-forum/db/node'
import { Message } from '@/components/message'
import { LayoutWithSidebar } from '@/components/layout-with-sidebar'
import { groupMessagesByUser } from '@/utils/group-messages'
import { MessageGroup } from '@/components/message-group'
import { truncate } from '@/utils/truncate'
import { getCanonicalPostUrl } from '@/utils/urls'
import { CheckCircleSolidIcon } from '@/components/icons/check-circle-solid'
import { Attachment, MessageContent } from '@/components/message-content'
import { ArrowDownIcon } from '@/components/icons/arrow-down'
import type { QAPage, WithContext } from 'schema-dts'
import { parseDiscordMessage } from '@/utils/discord-markdown'
import Link from 'next/link'

const isPostIndexed = async (snowflakeId: string) => {
  const post = await db
    .selectFrom('posts')
    .select('isIndexed')
    .where('snowflakeId', '=', snowflakeId)
    .executeTakeFirst()

  return post ? post.isIndexed : false
}

const getPost = async (snowflakeId: string) => {
  return await db
    .selectFrom('posts')
    .innerJoin('users', 'users.snowflakeId', 'posts.userId')
    .innerJoin('channels', 'channels.snowflakeId', 'posts.channelId')
    .select([
      'posts.id',
      'posts.snowflakeId',
      'posts.title',
      'posts.createdAt',
      'posts.answerId',
      'users.username',
      'users.isPublic as userIsPublic',
      'users.avatarUrl as userAvatar',
      'channels.name as channelName',
      'users.snowflakeId as userID',
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

const getPostMessage = async (postId: string) => {
  return await db
    .selectFrom('messages')
    .leftJoin('attachments', 'attachments.messageId', 'messages.snowflakeId')
    .innerJoin('users', 'users.snowflakeId', 'messages.userId')
    .select([
      'messages.id',
      'messages.content',
      'messages.createdAt',
      'users.id as authorId',
      'users.avatarUrl as authorAvatarUrl',
      'users.username as authorUsername',
      'users.isPublic as userIsPublic',
      'users.isModerator as userIsModerator',
      'users.snowflakeId as userID',
      sql<Attachment[]>`
        coalesce(json_agg(
          json_build_object(
            'id', attachments.id,
            'url', attachments.url,
            'name', attachments.name,
            'contentType', attachments."contentType"
          )
        ) filter (where attachments.id is not null), '[]'::json)
      `.as('attachments'),
    ])
    .where('messages.postId', '=', postId)
    .where('messages.snowflakeId', '=', postId)
    .groupBy(['messages.id', 'users.id'])
    .orderBy('messages.createdAt', 'asc')
    .executeTakeFirst()
}

const getMessages = async (postId: string) => {
  return await db
    .selectFrom('messages')
    .leftJoin('attachments', 'attachments.messageId', 'messages.snowflakeId')
    .innerJoin('users', 'users.snowflakeId', 'messages.userId')
    .select([
      'messages.id',
      'messages.snowflakeId',
      'messages.content',
      'messages.createdAt',
      'users.id as authorId',
      'users.avatarUrl as authorAvatarUrl',
      'users.username as authorUsername',
      'users.isPublic as userIsPublic',
      'users.isModerator as userIsModerator',
      'users.snowflakeId as userID',
      sql<Attachment[]>`
        coalesce(json_agg(
          json_build_object(
            'id', attachments.id,
            'url', attachments.url,
            'name', attachments.name,
            'contentType', attachments."contentType"
          )
        ) filter (where attachments.id is not null), '[]'::json)
      `.as('attachments'),
    ])
    .where('postId', '=', postId)
    .where('messages.snowflakeId', '!=', postId)
    .groupBy(['messages.id', 'users.id'])
    .orderBy('messages.createdAt', 'asc')
    .execute()
}

// Since we have a lot of messages in a short period for posts, we will only revalidate it
// at most once every 60 seconds
export const dynamic = 'error'
export const revalidate = 60

export const generateMetadata = async ({
  params,
}: PostProps): Promise<Metadata> => {
  const post = await getPost(params.id)
  const postMessage = await getPostMessage(params.id)

  const title = post?.title
  const postMessageFormatted = await parseDiscordMessage(
    postMessage?.content || '',
    true,
  )
  const description = truncate(postMessageFormatted, 230)
  const url = getCanonicalPostUrl(params.id)

  return {
    title,
    description,
    alternates: {
      canonical: url,
    },
    openGraph: {
      title,
      description,
      url,
      type: 'website',
      siteName: 'Next.js Discord Forum',
    },
    twitter: {
      card: 'summary',
      title,
      description,
    },
  }
}

type PostProps = {
  params: { id: string }
}

const Post = async ({ params }: PostProps) => {
  const isIndexed = await isPostIndexed(params.id)
  if (!isIndexed) {
    notFound()
  }

  const post = await getPost(params.id)
  if (!post) {
    notFound()
  }

  const messages = await getMessages(params.id)
  const postMessage = await getPostMessage(params.id)
  const answerMessage = messages.find((m) => m.snowflakeId === post.answerId)
  const groupedMessages = groupMessagesByUser(messages, post.answerId)
  const hasAnswer =
    post.answerId && messages.some((m) => m.snowflakeId === post.answerId)
  const truncatedName = truncate(post.username, 32)

  const jsonLd: WithContext<QAPage> = {
    '@context': 'https://schema.org',
    '@type': 'QAPage',
    mainEntity: {
      '@type': 'Question',
      name: post.title,
      text: postMessage
        ? await parseDiscordMessage(postMessage?.content, true)
        : 'Original message was deleted.',
      dateCreated: post.createdAt.toJSON(),
      answerCount: messages.length,
      author: {
        '@type': 'Person',
        name: post.username,
      },
      acceptedAnswer:
        hasAnswer && answerMessage
          ? {
              '@type': 'Answer',
              text: await parseDiscordMessage(answerMessage.content, true),
              url: `${getCanonicalPostUrl(params.id)}#message-${
                answerMessage.snowflakeId
              }`,
              dateCreated: answerMessage.createdAt.toJSON(),
              author: {
                '@type': 'Person',
                name: answerMessage.authorUsername,
              },
              upvoteCount: 1,
            }
          : undefined,
      suggestedAnswer:
        !hasAnswer && messages[0]
          ? {
              '@type': 'Answer',
              text: await parseDiscordMessage(messages[0].content, true),
              url: `${getCanonicalPostUrl(params.id)}#message-${
                messages[0].snowflakeId
              }`,
              dateCreated: messages[0].createdAt.toJSON(),
              author: {
                '@type': 'Person',
                name: messages[0].authorUsername,
              },
            }
          : undefined,
    },
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <LayoutWithSidebar className="mt-4">
        <div>
          <h1 className="mb-4 font-semibold text-3xl">{post.title}</h1>

          <div className="flex flex-col sm:flex-row gap-2 sm:items-center justify-between">
            <div className="flex flex-wrap items-center gap-2">
              {hasAnswer ? (
                <div className="px-2.5 py-1 border border-green-400 text-green-400 rounded-full opacity-60">
                  Answered
                </div>
              ) : (
                <div className="px-2.5 py-1 border rounded-full opacity-50">
                  Unanswered
                </div>
              )}
              <div className="opacity-90">
                {post.userIsPublic ? (
                  <Link className="underline" href={`/user/${post.userID}`}>
                    {truncatedName}
                  </Link>
                ) : (
                  truncatedName
                )}{' '}
                posted this in{' '}
                <span className="opacity-80 font-semibold">
                  #{post.channelName}
                </span>
              </div>
            </div>

            <a
              href={`https://discord.com/channels/752553802359505017/${post.snowflakeId}/${post.snowflakeId}`}
              className="shrink-0 w-fit px-4 py-1.5 font-semibold text-white border-neutral-700 border rounded hover:bg-neutral-700 hover:no-underline transition-colors"
              target="_blank"
              rel="noopener noreferrer"
            >
              Open in Discord
            </a>
          </div>
        </div>

        <div className="mt-4 space-y-1">
          <MessageGroup isAnswer={false}>
            {postMessage ? (
              <Message
                snowflakeId={postMessage.id.toString()}
                createdAt={postMessage.createdAt}
                content={postMessage.content}
                author={{
                  username: postMessage.authorUsername,
                  avatarUrl: postMessage.authorAvatarUrl,
                  isPublic: postMessage.userIsPublic,
                  isOP: true,
                  isModerator: postMessage.userIsModerator,
                  userID: postMessage.userID,
                }}
                attachments={postMessage.attachments}
                isFirstRow
              />
            ) : (
              <span className="px-4 opacity-80">
                Original message was deleted.
              </span>
            )}
          </MessageGroup>

          {answerMessage && (
            <div className="p-2 sm:p-3 space-y-1.5 border border-green-400 rounded">
              <div className="flex space-x-2 items-center text-green-400">
                <CheckCircleSolidIcon />
                <div className="text-sm">
                  Answered by{' '}
                  <span className="font-semibold">
                    {answerMessage.authorUsername}
                  </span>
                </div>
              </div>

              <div
                className="max-h-32 overflow-hidden"
                style={{
                  WebkitMaskImage:
                    'linear-gradient(180deg, #000 80%, transparent)',
                  maskImage: 'linear-gradient(180deg, #000 80%, transparent)',
                }}
              >
                <MessageContent
                  content={answerMessage.content}
                  attachments={answerMessage.attachments}
                />
              </div>

              <a
                href={`#message-${answerMessage.snowflakeId}`}
                className="mt-2 opacity-80 font-semibold text-sm space-x-1"
              >
                <span>View full answer</span>
                <ArrowDownIcon size={4} />
              </a>
            </div>
          )}
        </div>

        <h2 className="my-4 text-lg font-semibold">
          {messages.length} {plur('Reply', messages.length)}
        </h2>

        <div className="space-y-2">
          {groupedMessages.map((group) => (
            <MessageGroup
              key={group.id}
              isAnswer={group.messages.some(
                (m) => m.snowflakeId === post.answerId,
              )}
            >
              {group.messages.map((message, i) => (
                <Message
                  key={message.id.toString()}
                  snowflakeId={message.snowflakeId}
                  createdAt={message.createdAt}
                  content={message.content}
                  isFirstRow={i === 0}
                  author={{
                    username: message.authorUsername,
                    avatarUrl: message.authorAvatarUrl,
                    isPublic: message.userIsPublic,
                    isOP: postMessage
                      ? message.authorId === postMessage.authorId
                      : false,
                    isModerator: message.userIsModerator,
                    userID: message.userID,
                  }}
                  attachments={message.attachments}
                />
              ))}
            </MessageGroup>
          ))}
        </div>
      </LayoutWithSidebar>
    </>
  )
}

export default Post
