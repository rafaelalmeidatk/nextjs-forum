import { db } from 'db/node'
import Image from 'next/image'
import plur from 'plur'

const getPosts = async () => {
  return await db
    .selectFrom('posts')
    .innerJoin('users', 'users.id', 'posts.userId')
    .select([
      'posts.id',
      'posts.title',
      'users.username',
      'users.avatarUrl as userAvatar',
      (eb) =>
        eb
          .selectFrom('messages')
          .select(eb.fn.countAll<number>().as('count'))
          .where('messages.postId', '=', eb.ref('posts.id'))
          .as('messagesCount'),
    ])
    .orderBy('createdAt', 'desc')
    .execute()
}

const Home = async () => {
  const posts = await getPosts()

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl">Next.js Discord Forum</h1>
      <div className="mt-4">
        <div className="text-2xl">Posts:</div>
        <div className="mt-2 space-y-2">
          {posts.map((post) => (
            <div key={post.id} className="p-4 border border-gray-50 rounded">
              <div className="text-lg">{post.title}</div>
              <div className="flex items-center space-x-2">
                <Image
                  src={post.userAvatar}
                  alt={`${post.username}'s avatar`}
                  width={48}
                  height={48}
                  className="rounded-full w-5 h-5"
                />
                <div className="text-sm">
                  {post.username} · {post.messagesCount}{' '}
                  {plur('Message', post.messagesCount)}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default Home
