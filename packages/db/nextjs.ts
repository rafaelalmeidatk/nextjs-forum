import { Kysely } from 'kysely'
import { PlanetScaleDialect } from 'kysely-planetscale'
import { DB } from './schema'

if (!process.env.DATABASE_URL) {
  throw new Error('DATABASE_URL is not defined')
}

// Dialect using the PlanetScale Serverless Driver
export const db = new Kysely<DB>({
  dialect: new PlanetScaleDialect({
    url: process.env.DATABASE_URL,
  }),
})
