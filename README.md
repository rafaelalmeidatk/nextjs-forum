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
yarn install
```

### Configuring the env vars

If you are developing locally, you need to create `.env` files in both the `apps/web` and `app/bot` folder. Refer to the table below for all the env vars in the project

#### Project: `apps/web`

| Name                | Description                                                                                              | Required? |
| ------------------- | -------------------------------------------------------------------------------------------------------- | --------- |
| `DATABASE_URL`      | The read-only connection string to connect to the DB, used to query the posts and messages               | ✔️        |
| `REVALIDATE_SECRET` | The secret that allows remote revalidations to the app cache. This var should also be set in the bot app | ✔️        |

#### Project: `apps/bot`

| Name                     | Description                                                                                                             | Required? |
| ------------------------ | ----------------------------------------------------------------------------------------------------------------------- | --------- |
| `DISCORD_BOT_TOKEN`      | The token for the bot. If you don't have a bot yet, go to the bot project section for more details on how to create one | ✔️        |
| `DISCORD_CLIENT_ID`      | Client ID of the bot app                                                                                                | ✔️        |
| `DEV_GUILD_ID`           | The ID of the Discord server to register dev commands with `yarn dev:register-commands`                                 | ❌        |
| `PUBLIC_PROFILE_ROLE_ID` | The ID of the role to make Discord profiles public in the database                                                      | ❌        |
| `INDEXABLE_CHANNEL_IDS`  | Comman-separated list of forum channels to index                                                                        | ✔️        |
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
yarn dev
```

> **Info**
> You don't need to run both projects always at the same time, they can work separately

## Creating your own bot instance

You will need your own bot to run the project locally, it is also recommended to create a new Discord server as a testing playground.

1. Go to https://discord.com/developers/applications and click on New Application
2. In the General Information page, copy the `APPLICATION ID`, this is the value of the `DISCORD_CLIENT_ID` env var
3. Go to the Bot page, click on Reset Token. Copy the new token and store it in the `DISCORD_BOT_TOKEN` env var. **DO NOT** share this token anywhere
4. In the "Privileged Gateway Intents" section, enable `SERVER MEMBERS INTENT` and `MESSAGE CONTENT INTENT`

To invite the bot to your own server, go to the OAuth2 > URL Generator page, select the `bot` scope and add the following permissions:

- Send Messages
- Send Messages in Threads
- Manage Message
- Manage Threads
- Embed Links
- Read Message History
- Add Reactions
- Use Slash Commands

Copy the Generated URL and open it in your browser

## Creating the database

This project uses PlanetScale as the DB provider, you can create a free account at https://planetscale.com. To create the database, follow these steps:

1. Create a new database in your dashboard
2. Click on the "Get connection strings" button
3. Add a name to this password and set the Role to `Read/write`
4. Click on Create Password, the next screen should give you the `DATABASE_URL` env var to be copied to the `.env` file of both `web` and `bot` projects

### Running migrations

To run migrations you need a password with the `Admin` role, follow the previous steps to create one. Add the generated database URL to the `packages/db/.env` file and run this command:

```sh
yarn migrate
```
