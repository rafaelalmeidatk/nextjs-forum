import { PostsList } from '@/components/posts-list'

const Home = async () => {
  // @ts-expect-error: async component
  return <PostsList page={1} />
}

export default Home
