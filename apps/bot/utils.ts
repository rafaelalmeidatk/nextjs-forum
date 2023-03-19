import { Channel, AnyThreadChannel } from "discord.js";
import { env } from "./env.js";

export const isMessageInForumChannel = (
  channel: Channel
): channel is AnyThreadChannel<true> => {
  return channel.isThread() && channel.parentId === env.FORUM_CHANNEL_ID;
};
