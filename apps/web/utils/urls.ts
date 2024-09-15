export const getBaseUrl = () => {
  return process.env.NEXT_PUBLIC_BASE_URL ?? 'http://localhost:3000'
}

export const getCanonicalPostUrl = (postId: string) => {
  return `${getBaseUrl()}/post/${postId}`
}

export const getCanonicalUserUrl = (discordId: string) => {
  return `${getBaseUrl()}/user/${discordId}`
}
