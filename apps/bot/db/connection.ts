import { Kysely, MysqlDialect } from "kysely";
import { createPool } from "mysql2";
import { env } from "../env.js";

export const db = new Kysely<any>({
  dialect: new MysqlDialect({
    pool: createPool({
      // @ts-ignore: `uri` is an existing property
      uri: env.DATABASE_URL,
    }),
  }),
});
