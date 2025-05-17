import { Kysely } from 'kysely'

export async function up(db: Kysely<any>) {
  await db.schema.alterTable('users').addColumn('rank', 'integer').execute()
}

export async function down(db: Kysely<any>) {
  await db.schema.alterTable('users').dropColumn('rank').execute()
}
