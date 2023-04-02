import { env } from './env.js'

export const revalidateHomePage = () => {
  return fetch(`${env.WEB_URL}/api/revalidate-home`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${env.REVALIDATE_SECRET}`,
    },
  })
}
