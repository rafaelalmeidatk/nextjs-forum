import { NextApiRequest, NextApiResponse } from 'next'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method Not Allowed' })
  }

  const secret = req.headers.authorization?.split(' ')[1]
  if (secret !== process.env.REVALIDATE_SECRET) {
    return res.status(401).json({ message: 'Invalid token' })
  }

  const { postId } = req.body
  if (!postId) {
    return res.status(400).json({ message: 'Missing the post ID' })
  }

  try {
    await Promise.all([res.revalidate('/'), res.revalidate(`/post/${postId}`)])
    res.json({ revalidated: true })
  } catch (err) {
    res.status(500).json({ error: 'Error revalidating' })
  }
}
