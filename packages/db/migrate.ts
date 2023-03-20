import path from 'path'
import url from 'url'
import fs from 'fs/promises'
import { Migrator, FileMigrationProvider } from 'kysely'
import { db } from './node'

const op = process.env.MIGRATE_OP ?? 'latest'
const dirname = url.fileURLToPath(new URL('.', import.meta.url))

const migrator = new Migrator({
  db,
  provider: new FileMigrationProvider({
    fs,
    path,
    migrationFolder: path.join(dirname, './migrations'),
  }),
})

const { error, results } = await (op === 'latest'
  ? migrator.migrateToLatest()
  : migrator.migrateDown())

results?.forEach((it) => {
  if (it.status === 'Success') {
    console.log(
      `[${it.direction}] migration "${it.migrationName}" was executed successfully`
    )
  } else if (it.status === 'Error') {
    console.error(
      `[${it.direction}] failed to execute migration "${it.migrationName}"`
    )
  }
})

if (error) {
  console.error('failed to migrate')
  console.error(error)
  process.exit(1)
}

await db.destroy()
