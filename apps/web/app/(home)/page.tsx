import { PostsList } from '@/components/posts-list'

export const dynamic = 'error'
export const revalidate = 60

const Home = async () => {
  // @ts-expect-error: async component
  return <PostsList page={1} />
}

export default Home
