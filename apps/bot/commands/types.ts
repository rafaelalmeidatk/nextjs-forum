import {
  ContextMenuCommandBuilder,
  MessageContextMenuCommandInteraction,
} from 'discord.js'

export type ContextMenuCommand = {
  data: ContextMenuCommandBuilder
  execute: (
    interaction: MessageContextMenuCommandInteraction
  ) => void | Promise<void>
}
