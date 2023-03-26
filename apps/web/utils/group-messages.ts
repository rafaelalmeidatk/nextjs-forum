import { randomUUID } from 'crypto'

type RequiredMessageFields = {
  id: string
  authorId: string
  createdAt: Date
}

type GroupedMessages<T> = Array<{
  id: string
  messages: T[]
}>

export const groupMessagesByUser = <T extends RequiredMessageFields>(
  messages: T[]
) => {
  return messages.reduce<GroupedMessages<T>>((acc, message) => {
    const lastGroup = acc[acc.length - 1]

    if (!lastGroup) {
      return [{ id: randomUUID(), messages: [message] }]
    }

    const lastMessage = lastGroup.messages.at(-1)
    if (!lastMessage || lastMessage.authorId !== message.authorId) {
      acc.push({ id: randomUUID(), messages: [message] })
      return acc
    }

    const secondsFromLastMessage =
      (message.createdAt.getTime() - lastMessage.createdAt.getTime()) / 1000

    if (secondsFromLastMessage > 60 * 5) {
      acc.push({ id: randomUUID(), messages: [message] })
      return acc
    }

    lastGroup.messages.push(message)
    return acc
  }, [])
}
