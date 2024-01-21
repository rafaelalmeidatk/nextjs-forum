import { Kysely } from 'kysely'

export async function up(db: Kysely<any>): Promise<void> {
  await db.schema
    .alterTable('users')
    .addColumn('points', 'integer', (col) => col.notNull().defaultTo(0))
    .execute()

  await db.schema
    .createIndex('users_points_idx')
    .on('users')
    .column('points')
    .execute()
}

export async function down(db: Kysely<any>): Promise<void> {
  await db.schema.alterTable('users').dropColumn('points').execute()
}
