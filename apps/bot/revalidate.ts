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
  return Promise.all([
    post('/api/revalidate-home'),
    post('/api/revalidate-sitemap'),
  ])
}
