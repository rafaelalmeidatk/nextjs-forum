import discord, { Events, GatewayIntentBits, Partials } from "discord.js";
import { db } from "./db/connection.js";
import { env } from "./env.js";
import { isMessageInForumChannel, isThreadInForumChannel } from "./utils.js";

const client = new discord.Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
  ],
  partials: [Partials.Message],
});

client.once(Events.ClientReady, (c) => {
  console.log(`Ready! Logged in as ${c.user.tag}`);
});

client.on(Events.MessageCreate, (message) => {
  if (!isMessageInForumChannel(message.channel)) return;

  // TODO: upsert message in db
  console.log("new message", message.content);
});

client.on(Events.MessageUpdate, (_, newMessage) => {
  if (!isMessageInForumChannel(newMessage.channel)) return;

  // TODO: upsert message in db
  console.log("updated message", newMessage.content);
});

client.on(Events.ThreadCreate, (thread) => {
  if (!isThreadInForumChannel(thread)) return;

  // TODO: upsert thread in db
  console.log("created thread", thread.name);
});

client.on(Events.ThreadUpdate, (thread) => {
  if (!isThreadInForumChannel(thread)) return;

  // TODO: upsert thread in db
  console.log("updated thread", thread.name);
});

client.login(env.DISCORD_BOT_TOKEN);
