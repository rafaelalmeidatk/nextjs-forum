import { Kysely } from 'kysely'

export async function up(db: Kysely<any>): Promise<void> {
  await db.schema
    .alterTable('users')
    .addColumn('joinedAt', 'timestamptz')
    .execute()

  // Drop the existing index if it exists
  await db.schema.dropIndex('users_answersCount_idx').ifExists().execute()

  await db.schema
    .createIndex('users_answersCount_idx')
    .on('users')
    .columns(['answersCount desc', 'snowflakeId desc'])
    .execute()
}

export async function down(db: Kysely<any>): Promise<void> {
  await db.schema.alterTable('users').dropColumn('joinedAt').execute()

  await db.schema.dropIndex('users_answersCount_idx').execute()
}
