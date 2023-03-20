import { db } from 'db/node'

const getPosts = async () => {
  return await db.selectFrom('posts').selectAll().execute()
}

const Home = async () => {
  const posts = await getPosts()

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="text-lg">Posts:</div>
      {posts.map((post) => (
        <div key={post.id}>{post.title}</div>
      ))}
    </div>
  )
}

export default Home
