import type { ColumnType } from 'kysely'

export type Generated<T> = T extends ColumnType<infer S, infer I, infer U>
  ? ColumnType<S, I | undefined, U>
  : ColumnType<T, T | undefined, T>

export type Timestamp = ColumnType<Date, Date | string, Date | string>

export interface Attachments {
  contentType: string | null
  id: Generated<string>
  messageId: string
  name: string
  snowflakeId: string
  url: string
}

export interface Channels {
  id: Generated<string>
  name: string
  snowflakeId: string
  topic: string
  type: number
}

export interface Messages {
  content: string
  createdAt: Timestamp
  editedAt: Timestamp | null
  id: Generated<string>
  postId: string
  replyToMessageId: string | null
  snowflakeId: string
  userId: string
}

export interface Posts {
  answerId: string | null
  channelId: string | null
  createdAt: Timestamp
  editedAt: Timestamp | null
  id: Generated<string>
  isIndexed: Generated<boolean>
  isLocked: boolean
  lastActiveAt: Generated<Timestamp>
  snowflakeId: string
  title: string
  userId: string | null
}

export interface Users {
  answersCount: Generated<number>
  avatarUrl: string
  discriminator: string
  id: Generated<string>
  isModerator: Generated<boolean>
  isPublic: Generated<boolean>
  joinedAt: Timestamp | null
  points: Generated<number>
  snowflakeId: string
  username: string
}

export interface DB {
  attachments: Attachments
  channels: Channels
  messages: Messages
  posts: Posts
  users: Users
}
