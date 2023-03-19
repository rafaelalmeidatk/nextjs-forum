import discord, { Events, GatewayIntentBits, Partials } from "discord.js";
import { env } from "./env.js";
import { isMessageInForumChannel } from "./utils.js";

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
  console.log("new message", message.content);
});

client.on(Events.MessageUpdate, (_, newMessage) => {
  if (!isMessageInForumChannel(newMessage.channel)) return;
  console.log("updated message", newMessage.content);
});

client.login(env.DISCORD_BOT_TOKEN);
