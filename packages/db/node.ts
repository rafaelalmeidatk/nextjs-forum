import {
  Kysely,
  sql,
  PostgresDialect,
  SelectExpression,
  Transaction,
} from 'kysely'
import pg from 'pg'
import { DB } from './schema.js'

if (!process.env.DATABASE_URL) {
  throw new Error('DATABASE_URL is not defined')
}

const { Pool } = pg

export const db = new Kysely<DB>({
  dialect: new PostgresDialect({
    pool: new Pool({
      connectionString: process.env.DATABASE_URL,
    }),
  }),
})

export const selectUuid = <SE extends SelectExpression<DB, keyof DB>>(
  selection: SE,
) => sql<string>`bin_to_uuid(${sql.ref(selection.toString())})`

export { sql } from 'kysely'

export type TransactionDB = Transaction<DB>
export type KyselyDB = Kysely<DB>
