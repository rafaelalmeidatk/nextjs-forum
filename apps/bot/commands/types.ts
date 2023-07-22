import {
  ChatInputCommandInteraction,
  ContextMenuCommandBuilder,
  MessageContextMenuCommandInteraction,
  SlashCommandBuilder,
} from 'discord.js'

export type ContextMenuCommand = {
  data: ContextMenuCommandBuilder
  execute: (
    interaction: MessageContextMenuCommandInteraction,
  ) => void | Promise<void>
}

export type SlashCommand = {
  data: SlashCommandBuilder
  execute: (interaction: ChatInputCommandInteraction) => void | Promise<void>
}
