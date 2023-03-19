import { Kysely } from "kysely";
import { SnowflakeDataType } from "../migrations-utils.js";

export async function up(db: Kysely<any>): Promise<void> {
  // --- Users
  await db.schema
    .createTable("users")
    .addColumn("id", SnowflakeDataType, (col) => col.primaryKey())
    .addColumn("username", "varchar(32)", (col) => col.notNull())
    .addColumn("discriminator", "varchar(4)", (col) => col.notNull())
    .execute();

  // -- Posts
  await db.schema
    .createTable("posts")
    .addColumn("id", SnowflakeDataType, (col) => col.primaryKey())
    .addColumn("title", "text", (col) => col.notNull())
    .addColumn("isLocked", "boolean", (col) => col.notNull())
    .addColumn("createdAt", "datetime", (col) => col.notNull())
    .addColumn("updatedAt", "datetime", (col) => col.notNull())
    .addColumn("userId", SnowflakeDataType, (col) => col.notNull())
    .execute();

  await db.schema
    .createIndex("posts_userId_idx")
    .on("posts")
    .column("userId")
    .execute();

  // -- Messages
  await db.schema
    .createTable("messages")
    .addColumn("id", SnowflakeDataType, (col) => col.primaryKey())
    .addColumn("content", "text")
    .addColumn("createdAt", "datetime", (col) => col.notNull())
    .addColumn("updatedAt", "datetime", (col) => col.notNull())
    .addColumn("userId", SnowflakeDataType, (col) => col.notNull())
    .execute();

  await db.schema
    .createIndex("messages_userId_idx")
    .on("messages")
    .column("userId")
    .execute();
}

export async function down(db: Kysely<any>): Promise<void> {
  await db.schema.dropTable("messages").execute();
  await db.schema.dropTable("posts").execute();
  await db.schema.dropTable("users").execute();
}
