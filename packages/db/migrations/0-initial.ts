import { Kysely } from 'kysely'
import { SnowflakeDataType, uuidColumnBuilder } from '../migrations-utils.js'

export async function up(db: Kysely<any>): Promise<void> {
  // --- Users
  await db.schema
    .createTable('users')
    .addColumn('id', 'uuid', uuidColumnBuilder)
    .addColumn('snowflakeId', SnowflakeDataType, (col) =>
      col.notNull().unique(),
    )
    .addColumn('isPublic', 'boolean', (col) => col.notNull().defaultTo(false))
    .addColumn('username', 'text', (col) => col.notNull())
    .addColumn('discriminator', 'varchar(4)', (col) => col.notNull())
    .addColumn('avatarUrl', 'text', (col) => col.notNull())
    .execute()

  await db.schema
    .createIndex('users_snowflakeId_idx')
    .on('users')
    .column('snowflakeId')
    .execute()

  // -- Channels
  await db.schema
    .createTable('channels')
    .addColumn('id', 'uuid', uuidColumnBuilder)
    .addColumn('snowflakeId', SnowflakeDataType, (col) =>
      col.notNull().unique(),
    )
    .addColumn('name', 'text', (col) => col.notNull())
    .addColumn('type', 'int2', (col) => col.notNull())
    .addColumn('topic', 'text', (col) => col.notNull())
    .execute()

  // -- Posts
  await db.schema
    .createTable('posts')
    .addColumn('id', 'uuid', uuidColumnBuilder)
    .addColumn('snowflakeId', SnowflakeDataType, (col) =>
      col.notNull().unique(),
    )
    .addColumn('title', 'text', (col) => col.notNull())
    .addColumn('isLocked', 'boolean', (col) => col.notNull())
    .addColumn('createdAt', 'timestamptz', (col) => col.notNull())
    .addColumn('editedAt', 'timestamptz')
    .addColumn('userId', SnowflakeDataType)
    .addColumn('channelId', SnowflakeDataType)
    .addColumn('answerId', SnowflakeDataType)
    .execute()

  await db.schema
    .createIndex('posts_snowflakeId_idx')
    .on('posts')
    .column('snowflakeId')
    .execute()

  await db.schema
    .createIndex('posts_userId_idx')
    .on('posts')
    .column('userId')
    .execute()

  await db.schema
    .createIndex('posts_channelId_idx')
    .on('posts')
    .column('channelId')
    .execute()

  // -- Messages
  await db.schema
    .createTable('messages')
    .addColumn('id', 'uuid', uuidColumnBuilder)
    .addColumn('snowflakeId', SnowflakeDataType, (col) =>
      col.notNull().unique(),
    )
    .addColumn('content', 'text', (col) => col.notNull())
    .addColumn('createdAt', 'timestamptz', (col) => col.notNull())
    .addColumn('editedAt', 'timestamptz')
    .addColumn('userId', SnowflakeDataType, (col) => col.notNull())
    .addColumn('postId', SnowflakeDataType, (col) => col.notNull())
    .addColumn('replyToMessageId', SnowflakeDataType)
    .execute()

  await db.schema
    .createIndex('messages_snowflakeId_idx')
    .on('messages')
    .column('snowflakeId')
    .execute()

  await db.schema
    .createIndex('messages_userId_idx')
    .on('messages')
    .column('userId')
    .execute()

  await db.schema
    .createIndex('messages_postId_idx')
    .on('messages')
    .column('postId')
    .execute()

  await db.schema
    .createIndex('messages_replyToMessageId_idx')
    .on('messages')
    .column('replyToMessageId')
    .execute()

  // -- Attachments
  await db.schema
    .createTable('attachments')
    .addColumn('id', 'uuid', uuidColumnBuilder)
    .addColumn('snowflakeId', SnowflakeDataType, (col) =>
      col.notNull().unique(),
    )
    .addColumn('url', 'text', (col) => col.notNull())
    .addColumn('name', 'text', (col) => col.notNull())
    .addColumn('contentType', 'text')
    .addColumn('messageId', SnowflakeDataType, (col) => col.notNull())
    .execute()

  await db.schema
    .createIndex('attachments_snowflakeId_idx')
    .on('attachments')
    .column('snowflakeId')
    .execute()

  await db.schema
    .createIndex('attachments_messageId_idx')
    .on('attachments')
    .column('messageId')
    .execute()
}

export async function down(db: Kysely<any>): Promise<void> {
  await db.schema.dropTable('attachments').execute()
  await db.schema.dropTable('messages').execute()
  await db.schema.dropTable('posts').execute()
  await db.schema.dropTable('channels').execute()
  await db.schema.dropTable('users').execute()
}
