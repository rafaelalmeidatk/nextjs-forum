import './load-env.js'
import path from 'path'
import url from 'url'
import fs from 'fs/promises'
import { FileMigrationProvider, Migrator } from 'kysely'
import { db } from './node.js'

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

if (op === 'list') {
  const migrations = await migrator.getMigrations()
  for (const migration of migrations) {
    console.log(`${migration.name} - Executed at: ${migration.executedAt}`)
  }

  await db.destroy()
  process.exit(0)
}

const { error, results } = await (op === 'latest'
  ? migrator.migrateToLatest()
  : migrator.migrateDown())

results?.forEach((it) => {
  if (it.status === 'Success') {
    console.log(
      `[${it.direction}] migration "${it.migrationName}" was executed successfully`,
    )
  } else if (it.status === 'Error') {
    console.error(
      `[${it.direction}] failed to execute migration "${it.migrationName}"`,
    )
  }
})

if (error) {
  console.error('Failed to migrate:')
  console.error(error)
  process.exit(1)
}

await db.destroy()
