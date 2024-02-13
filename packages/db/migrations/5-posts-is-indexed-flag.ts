import { Kysely } from 'kysely'

export async function up(db: Kysely<any>): Promise<void> {
  await db.schema
    .alterTable('posts')
    .addColumn('isIndexed', 'boolean', (col) => col.notNull().defaultTo(true))
    .execute()

  await db.schema
    .createIndex('posts_isIndexed_idx')
    .on('posts')
    .column('isIndexed')
    .execute()
}

export async function down(db: Kysely<any>): Promise<void> {
  await db.schema.alterTable('posts').dropColumn('isIndexed').execute()
}
