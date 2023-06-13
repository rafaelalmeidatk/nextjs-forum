import { Kysely } from 'kysely'
import {
    SnowflakeDataType,
    UuidDataType,
    uuidColumnBuilder,
} from '../migrations-utils.js'

export async function up(db: Kysely<any>): Promise<void> {
    // --- add instructions message id to posts
    await db.schema
        .alterTable('posts')
        .addColumn('instructionsMessageId', SnowflakeDataType)
        .execute()

}

export async function down(db: Kysely<any>): Promise<void> {
    await db.schema
        .alterTable('posts')
        .dropColumn('instructionsMessageId')
        .execute()
}
