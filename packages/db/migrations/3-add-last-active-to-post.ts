import { Kysely, sql } from 'kysely'

export async function up(db: Kysely<any>): Promise<void> {
  await db.schema
    .alterTable('posts')
    .addColumn('lastActiveAt', 'timestamptz', (col) =>
      col.notNull().defaultTo(sql`now()`),
    )
    .execute()
}

export async function down(db: Kysely<any>): Promise<void> {
  await db.schema.alterTable('posts').dropColumn('lastActiveAt').execute()
}
