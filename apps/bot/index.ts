import discord, { Events, GatewayIntentBits, Partials } from 'discord.js'
import { syncMessage } from './db/actions/messages.js'
import { syncPost } from './db/actions/posts.js'
import { env } from './env.js'
import { baseLog } from './log.js'
import { isMessageInForumChannel, isThreadInForumChannel } from './utils.js'

const client = new discord.Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
  ],
  partials: [Partials.Message],
})

client.once(Events.ClientReady, (c) => {
  baseLog(`Ready! Logged in as ${c.user.tag}`)
})

client.on(Events.MessageCreate, async (message) => {
  if (!isMessageInForumChannel(message.channel)) return
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
    await syncMessage(message)
    baseLog('Updated a message in post %s', message.channelId)
  } catch (err) {
    console.error('Failed to update message:', err)
  }
})

client.on(Events.ThreadCreate, async (thread) => {
  if (!isThreadInForumChannel(thread)) return
  try {
    await syncPost(thread)
    baseLog('Created a new post (%s)', thread.id)
  } catch (err) {
    console.error('Failed to create thread:', err)
  }
})

client.on(Events.ThreadUpdate, async (_, newThread) => {
  if (!isThreadInForumChannel(newThread)) return
  try {
    await syncPost(newThread)
    baseLog('Updated a post (%s)', newThread.id)
  } catch (err) {
    console.error('Failed to update thread:', err)
  }
})

client.login(env.DISCORD_BOT_TOKEN)
