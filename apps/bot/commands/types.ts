import {
  ChatInputCommandInteraction,
  ContextMenuCommandBuilder,
  MessageContextMenuCommandInteraction,
  type SlashCommandOptionsOnlyBuilder,
} from 'discord.js'

export type ContextMenuCommand = {
  data: ContextMenuCommandBuilder
  execute: (
    interaction: MessageContextMenuCommandInteraction,
  ) => void | Promise<void>
}

export type SlashCommand = {
  data: SlashCommandOptionsOnlyBuilder
  execute: (interaction: ChatInputCommandInteraction) => void | Promise<void>
}
