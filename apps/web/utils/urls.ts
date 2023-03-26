export const getBaseUrl = () => {
  if (process.env.NEXT_PUBLIC_VERCEL_URL) {
    return `https://${process.env.NEXT_PUBLIC_VERCEL_URL}`
  }
  return 'http://localhost:3000'
}

export const getCanonicalPostUrl = (postId: string) => {
  return `${getBaseUrl()}/post/${postId}`
}
