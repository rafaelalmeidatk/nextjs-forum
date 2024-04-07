<h1 align="center">
  <img src="https://camo.githubusercontent.com/f21f1fa29dfe5e1d0772b0efe2f43eca2f6dc14f2fede8d9cbef4a3a8210c91d/68747470733a2f2f6173736574732e76657263656c2e636f6d2f696d6167652f75706c6f61642f76313636323133303535392f6e6578746a732f49636f6e5f6c696768745f6261636b67726f756e642e706e67" alt="Next.js Logo" width="84">
  <br>
  Next.js Discord Forum
</h1>

<p align="center">The Next.js Discord server indexed in the web</p>

## Getting Started

This repo contains the code for both the Discord bot that index the posts and the front-end app

### Installing the dependencies

```sh
pnpm install
```

### Configuring the env vars

If you are developing locally, you need to create `.env` files in both the `apps/web` and `app/bot` folder. Refer to the table below for all the env vars in the project

#### Project: `apps/web`

| Name                   | Description                                                                                              | Required? |
| ---------------------- | -------------------------------------------------------------------------------------------------------- | --------- |
| `DATABASE_URL`         | The read-only connection string to connect to the DB, used to query the posts and messages               | ✔️        |
| `REVALIDATE_SECRET`    | The secret that allows remote revalidations to the app cache. This var should also be set in the bot app | ✔️        |
| `NEXT_PUBLIC_BASE_URL` | The URL where the app is hosted                                                                          | ❌        |

#### Project: `apps/bot`

| Name                     | Description                                                                                                             | Required? |
| ------------------------ | ----------------------------------------------------------------------------------------------------------------------- | --------- |
| `DISCORD_BOT_TOKEN`      | The token for the bot. If you don't have a bot yet, go to the bot project section for more details on how to create one | ✔️        |
| `DISCORD_CLIENT_ID`      | Client ID of the bot app                                                                                                | ✔️        |
| `DEV_GUILD_ID`           | The ID of the Discord server to register dev commands with `pnpm dev:register-commands`                                 | ❌        |
| `PUBLIC_PROFILE_ROLE_ID` | The ID of the role to make Discord profiles public in the database                                                      | ❌        |
| `HELPER_ROLE_ID`         | The ID of the role that allows for selecting answer on behalf of owner                                                  | ❌        |
| `MODERATOR_ROLE_ID`      | The ID of the role to set moderator status in the database (also can select answer)                                     | ❌        |
| `REGULAR_MEMBER_ROLE_ID` | The ID of the role to add to users when they reach the points milestone                                                 | ❌        |
| `INDEXABLE_CHANNEL_IDS`  | Comma-separated list of forum channels to index                                                                         | ✔️        |
| `MOD_LOG_CHANNEL_ID`     | The ID of the channel to log things for mods                                                                            | ❌        |
| `DATABASE_URL`           | The connection string to connect to the DB                                                                              | ✔️        |
| `REVALIDATE_SECRET`      | The same secret from the `web` project                                                                                  | ✔️        |
| `WEB_URL`                | The address of the web service, used to make the call to revalidate the cache                                           | ✔️        |

#### Project: `packages/db` (only necessary if you plan to run migrations)

| Name           | Description                                                                 | Required? |
| -------------- | --------------------------------------------------------------------------- | --------- |
| `DATABASE_URL` | The admin connection string to connect to the DB, used to modify the schema | ✔️        |

### Running the development projects

To run both the `web` and `bot` projects at the same time, use the following command:

```sh
pnpm dev
```

> **Note**: You don't need to run both projects always at the same time, they can work separately

## Creating your own bot instance

You will need your own bot to run the project locally, it is also recommended to create a new Discord server as a testing playground.

1. Go to https://discord.com/developers/applications and click on New Application
2. In the General Information page, copy the `APPLICATION ID`, this is the value of the `DISCORD_CLIENT_ID` env var
3. Go to the Bot page, click on Reset Token. Copy the new token and store it in the `DISCORD_BOT_TOKEN` env var. **DO NOT** share this token anywhere
4. In the "Privileged Gateway Intents" section, enable `SERVER MEMBERS INTENT` and `MESSAGE CONTENT INTENT`

To invite the bot to your own server, go to the OAuth2 > URL Generator page, select the `bot` scope and add the following permissions:

- Manage Roles
- Send Messages
- Send Messages in Threads
- Manage Message
- Manage Threads
- Embed Links
- Read Message History
- Add Reactions
- Use Slash Commands

Copy the Generated URL and open it in your browser

### Registering Discord commands

To use the context and slash commands you first need to register them in Discord. The easiest way to do that is by running this command:

```sh
pnpm dev:register-commands
```

Notice the `dev:` prefix in the command. Discord limits how many times you can register commands with their API, but by registering the command in a specific server you can do this as many times as you want. You need the `DEV_GUILD_ID` env var set to use this command

## Creating the database

This project uses PostgreSQL for the database, the easiest way to get it up and running is by using Docker. Start the database with this command:

```sh
docker compose up
```

And use this for the environment variable:

```sh
DATABASE_URL='postgresql://nextjsuser:nextjspassword@localhost:5432/nextjsforum'
```

If for some reason you want to start the database from scratch you can use the following command (this will erase all the data!):

```sh
docker compose down -v
```

### Running migrations

Once the database is running, add the previous `DATABASE_URL` variable to the `packages/db/.env` file and run this command:

```sh
pnpm migrate
```
