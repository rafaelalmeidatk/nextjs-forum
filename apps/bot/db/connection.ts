import { Kysely, MysqlDialect } from "kysely";
import { createPool } from "mysql2";
import { DB } from "./schema.js";
import { env } from "../env.js";

export const db = new Kysely<DB>({
  dialect: new MysqlDialect({
    pool: createPool({
      // @ts-ignore: `uri` is an existing property
      uri: env.DATABASE_URL,
    }),
  }),
});
