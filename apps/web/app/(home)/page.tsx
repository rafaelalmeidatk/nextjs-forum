import { PostsList } from '@/components/posts-list'

// We will revalidate the home page when a new post is created
export const dynamic = 'error'

const Home = async () => {
  // @ts-expect-error: async component
  return <PostsList page={1} />
}

export default Home
