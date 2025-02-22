import { Kysely } from 'kysely'

export async function up(db: Kysely<any>): Promise<void> {
  await db.schema
    .alterTable('attachments')
    .alterColumn('messageId', (col) => col.setDataType('text'))
    .alterColumn('snowflakeId', (col) => col.setDataType('text'))
    .execute()

  await db.schema
    .alterTable('channels')
    .alterColumn('snowflakeId', (col) => col.setDataType('text'))
    .execute()

  await db.schema
    .alterTable('messages')
    .alterColumn('postId', (col) => col.setDataType('text'))
    .alterColumn('replyToMessageId', (col) => col.setDataType('text'))
    .alterColumn('snowflakeId', (col) => col.setDataType('text'))
    .alterColumn('userId', (col) => col.setDataType('text'))
    .execute()

  await db.schema
    .alterTable('posts')
    .alterColumn('answerId', (col) => col.setDataType('text'))
    .alterColumn('channelId', (col) => col.setDataType('text'))
    .alterColumn('snowflakeId', (col) => col.setDataType('text'))
    .alterColumn('userId', (col) => col.setDataType('text'))
    .execute()

  await db.schema
    .alterTable('users')
    .alterColumn('discriminator', (col) => col.setDataType('text'))
    .alterColumn('snowflakeId', (col) => col.setDataType('text'))
    .execute()
}

export async function down(db: Kysely<any>): Promise<void> {
  await db.schema
    .alterTable('attachments')
    .alterColumn('messageId', (col) => col.setDataType('varchar(40)'))
    .alterColumn('snowflakeId', (col) => col.setDataType('varchar(40)'))
    .execute()

  await db.schema
    .alterTable('channels')
    .alterColumn('snowflakeId', (col) => col.setDataType('varchar(40)'))
    .execute()

  await db.schema
    .alterTable('messages')
    .alterColumn('postId', (col) => col.setDataType('varchar(40)'))
    .alterColumn('replyToMessageId', (col) => col.setDataType('varchar(40)'))
    .alterColumn('snowflakeId', (col) => col.setDataType('varchar(40)'))
    .alterColumn('userId', (col) => col.setDataType('varchar(40)'))
    .execute()

  await db.schema
    .alterTable('posts')
    .alterColumn('answerId', (col) => col.setDataType('varchar(40)'))
    .alterColumn('channelId', (col) => col.setDataType('varchar(40)'))
    .alterColumn('snowflakeId', (col) => col.setDataType('varchar(40)'))
    .alterColumn('userId', (col) => col.setDataType('varchar(40)'))
    .execute()

  await db.schema
    .alterTable('users')
    .alterColumn('discriminator', (col) => col.setDataType('varchar(4)'))
    .alterColumn('snowflakeId', (col) => col.setDataType('varchar(40)'))
    .execute()
}
