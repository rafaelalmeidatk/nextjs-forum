import {
  Kysely,
  sql,
  MysqlDialect,
  SelectExpression,
  Transaction,
} from 'kysely'
import { createPool } from 'mysql2'
import { DB } from './schema.js'

if (!process.env.DATABASE_URL) {
  throw new Error('DATABASE_URL is not defined')
}

export const db = new Kysely<DB>({
  dialect: new MysqlDialect({
    pool: createPool({
      // @ts-ignore: `uri` is an existing property
      uri: process.env.DATABASE_URL,
    }),
  }),
})

export const selectUuid = <SE extends SelectExpression<DB, keyof DB>>(
  selection: SE,
) => sql<string>`bin_to_uuid(${sql.ref(selection.toString())})`

export { sql } from 'kysely'

export type TransactionDB = Transaction<DB>
export type KyselyDB = Kysely<DB>
