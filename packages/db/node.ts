import { Kysely, PostgresDialect, Transaction } from 'kysely'
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

export { sql } from 'kysely'

export type TransactionDB = Transaction<DB>
export type KyselyDB = Kysely<DB>
