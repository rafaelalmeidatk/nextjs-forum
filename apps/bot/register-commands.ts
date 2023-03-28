import { REST, Routes } from 'discord.js'
import { env } from './env.js'
import { contextMenuCommands } from './commands/context/index.js'

const isDevRegister = env.NODE_ENV === 'development'
const guildId = env.DEV_GUILD_ID

if (isDevRegister && !guildId) {
  throw new Error(
    'The DEV_GUILD_ID env variable should be set to register commands in dev'
  )
}

const commands = contextMenuCommands.map((file) => file.data.toJSON())

const rest = new REST({ version: '10' }).setToken(env.DISCORD_BOT_TOKEN)

console.log(`Started refreshing ${commands.length} application commands.`)

const data = (await rest.put(
  isDevRegister
    ? Routes.applicationGuildCommands(env.DISCORD_CLIENT_ID, guildId ?? '')
    : Routes.applicationCommands(env.DISCORD_CLIENT_ID),
  { body: commands }
)) as unknown[]

console.log(`Successfully reloaded ${data.length} application commands.`)
