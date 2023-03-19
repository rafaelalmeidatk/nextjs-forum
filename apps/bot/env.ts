import dotenv from "dotenv";
import { z, ZodError } from "zod";

const envVars = z.object({
  DISCORD_BOT_TOKEN: z.string(),
  FORUM_CHANNEL_ID: z.string(),
});

dotenv.config();

let env: z.infer<typeof envVars>;
try {
  env = envVars.parse(process.env);
} catch (err) {
  if (err instanceof ZodError) {
    let message = "Failed to load environment variables:";
    for (const zodError of err.errors) {
      message += `\n[${zodError.path}]: ${zodError.message}`;
    }
    throw new Error(message);
  }
  throw err;
}

export { env };
