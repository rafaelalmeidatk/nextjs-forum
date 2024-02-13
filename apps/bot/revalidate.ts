import { env } from './env.js'

const post = (endpoint: string, body?: Record<string, unknown>) => {
  return fetch(`${env.WEB_URL}${endpoint}`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${env.REVALIDATE_SECRET}`,
      'Content-Type': 'application/json',
    },
    body: body ? JSON.stringify(body) : undefined,
  })
}

export const revalidateHomePage = () => {
  return post('/api/revalidate-home')
}

export const revalidatePost = (postId: string) => {
  return post(`/api/revalidate-post`, { postId })
}
