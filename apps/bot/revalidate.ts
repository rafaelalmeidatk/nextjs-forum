import { env } from './env.js'

const post = (endpoint: string) => {
  return fetch(`${env.WEB_URL}${endpoint}`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${env.REVALIDATE_SECRET}`,
    },
  })
}

export const revalidateHomePage = () => {
  return post('/api/revalidate-home')
}
