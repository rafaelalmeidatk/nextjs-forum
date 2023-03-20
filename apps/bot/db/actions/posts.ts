import { AnyThreadChannel } from "discord.js";
import { db } from "../connection.js";

export const createOrUpdatePost = (thread: AnyThreadChannel) => {
  const now = new Date();
  return db
    .insertInto("posts")
    .values({
      id: thread.id,
      title: thread.name,
      createdAt: thread.createdAt ?? now,
      editedAt: thread.createdAt ?? now,
      isLocked: thread.locked ? 1 : 0,
      userId: thread.ownerId,
    })
    .onDuplicateKeyUpdate({
      title: thread.name,
      editedAt: now,
      isLocked: thread.locked ? 1 : 0,
    })
    .executeTakeFirst();
};
