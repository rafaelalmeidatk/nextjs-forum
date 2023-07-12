import { Kysely } from 'kysely'

export async function up(db: Kysely<any>): Promise<void> {
  await db.schema
    .alterTable('users')
    .addColumn('answersCount', 'integer', (col) => col.notNull().defaultTo(0))
    .execute()

  await db.schema
    .createIndex('users_answersCount_idx')
    .on('users')
    .column('answersCount')
    .execute()
}

export async function down(db: Kysely<any>): Promise<void> {
  await db.schema.alterTable('users').dropColumn('answersCount').execute()
}
