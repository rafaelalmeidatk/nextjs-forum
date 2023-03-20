import { Message } from "discord.js";
import { db } from "../connection.js";

export const createOrUpdateMessage = (message: Message) => {
  return db
    .insertInto("messages")
    .values({
      id: message.id,
      content: message.content,
      createdAt: message.createdAt,
      editedAt: message.editedAt,
      userId: message.author.id,
      postId: message.channelId,
    })
    .onDuplicateKeyUpdate({
      content: message.content,
      editedAt: message.editedAt,
    })
    .executeTakeFirst();
};
