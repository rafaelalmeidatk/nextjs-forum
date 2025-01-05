import { createEnv } from '@t3-oss/env-core'
import { z } from 'zod'

export const env = createEnv({
  server: {
    // Node.js (set by the CLI)
    NODE_ENV: z
      .union([z.literal('development'), z.literal('production')])
      .default('production'),

    // Discord
    DISCORD_BOT_TOKEN: z.string(),
    DISCORD_CLIENT_ID: z.string(),
    DEV_GUILD_ID: z.string().optional(),
    PUBLIC_PROFILE_ROLE_ID: z.string().optional(),
    MODERATOR_ROLE_ID: z.string().optional(),
    HELPER_ROLE_ID: z.string().optional(),
    REGULAR_MEMBER_ROLE_ID: z.string().optional(),
    INDEXABLE_CHANNEL_IDS: z.string().transform((str) => str.split(',')),
    MOD_LOG_CHANNEL_ID: z.string().optional(),

    // Database
    DATABASE_URL: z.string(),

    // Web
    REVALIDATE_SECRET: z.string(),
    WEB_URL: z.string(),

    // Migrations (set by the CLI)
    MIGRATE_OP: z.union([z.literal('latest'), z.literal('down')]).optional(),
  },

  runtimeEnv: process.env,
})
