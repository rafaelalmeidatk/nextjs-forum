import discord, { Events, GatewayIntentBits, Partials } from 'discord.js'
import { env } from './env.js'
import { deleteMessage, syncMessage } from './db/actions/messages.js'
import { deletePost, syncPost } from './db/actions/posts.js'
import { baseLog } from './log.js'
import {
  isMessageInForumChannel,
  isMessageSupported,
  isThreadInForumChannel,
  isThreadSupported,
} from './utils.js'
import { contextMenuCommands } from './commands/context/index.js'
import { usersCache } from './lib/cache.js'
import { syncUser } from './db/actions/users.js'

const client = new discord.Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.GuildMembers,
    GatewayIntentBits.MessageContent,
  ],
  partials: [Partials.Message],
})

client.once(Events.ClientReady, (c) => {
  baseLog(`Ready! Logged in as ${c.user.tag}`)
})

client.on(Events.MessageCreate, async (message) => {
  if (
    !isMessageInForumChannel(message.channel) ||
    !isMessageSupported(message)
  ) {
    return
  }

  try {
    await syncMessage(message)
    baseLog('Created a new message in post %s', message.channelId)
  } catch (err) {
    console.error('Failed to create message:', err)
  }
})

client.on(Events.MessageUpdate, async (_, newMessage) => {
  if (!isMessageInForumChannel(newMessage.channel)) return

  try {
    const message = await newMessage.fetch()
    if (!isMessageSupported(message)) return

    await syncMessage(message)
    baseLog('Updated a message in post %s', message.channelId)
  } catch (err) {
    console.error('Failed to update message:', err)
  }
})

client.on(Events.MessageDelete, async (message) => {
  if (!isMessageInForumChannel(message.channel)) return

  try {
    await deleteMessage(message.id)
    baseLog('Deleted a message in post %s', message.channelId)
  } catch (err) {
    console.error('Failed to delete message:', err)
  }
})

client.on(Events.ThreadCreate, async (thread) => {
  if (!isThreadInForumChannel(thread) || !isThreadSupported(thread)) return

  try {
    await syncPost(thread)
    baseLog('Created a new post (%s)', thread.id)
  } catch (err) {
    console.error('Failed to create thread:', err)
  }
})

client.on(Events.ThreadUpdate, async (_, newThread) => {
  if (!isThreadInForumChannel(newThread) || !isThreadSupported(newThread)) {
    return
  }

  try {
    await syncPost(newThread)
    baseLog('Updated a post (%s)', newThread.id)
  } catch (err) {
    console.error('Failed to update thread:', err)
  }
})

client.on(Events.ThreadDelete, async (thread) => {
  if (!isThreadInForumChannel(thread) || !isThreadSupported(thread)) return

  try {
    await deletePost(thread.id)
    baseLog('Deleted a post (%s)', thread.id)
  } catch (err) {
    console.error('Failed to delete thread:', err)
  }
})

client.on(Events.GuildMemberUpdate, async (oldMember, newMember) => {
  if (!env.PUBLIC_PROFILE_ROLE_ID) return

  const hadRole = oldMember.roles.cache.has(env.PUBLIC_PROFILE_ROLE_ID)
  const hasRole = newMember.roles.cache.has(env.PUBLIC_PROFILE_ROLE_ID)

  // If the user changed the public profile role, trigger a resync
  if ((hadRole && !hasRole) || (!hadRole && hasRole)) {
    usersCache.delete(newMember.user.id)
    await syncUser(newMember.user, newMember)
  }
})

client.on(Events.InteractionCreate, async (interaction) => {
  if (interaction.isMessageContextMenuCommand()) {
    contextMenuCommands
      .find((c) => c.data.name === interaction.commandName)
      ?.execute(interaction)
  }
})

client.login(env.DISCORD_BOT_TOKEN)
