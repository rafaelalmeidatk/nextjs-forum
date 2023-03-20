import { Kysely, MysqlDialect } from 'kysely'
import { createPool } from 'mysql2'
import { DB } from './schema'

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

export default db
