import { Kysely } from 'kysely'

export async function up(db: Kysely<any>): Promise<void> {
    // --- add moderator to users
    await db.schema
        .alterTable('users')
        .addColumn('isModerator', 'boolean', (col) => col.notNull().defaultTo(false))
        .execute()
}

export async function down(db: Kysely<any>): Promise<void> {
    await db.schema
        .alterTable('users')
        .dropColumn('isModerator')
        .execute()
}
