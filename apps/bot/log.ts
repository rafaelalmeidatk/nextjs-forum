import debug from 'debug'

debug.enable('discord,discord:*')

// @ts-expect-error: https://github.com/debug-js/debug/issues/922#issuecomment-1374524350
debug.useColors = () => true

export const baseLog = debug('discord')
