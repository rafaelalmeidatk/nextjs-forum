import { db, selectUuid } from 'db/node'
import { Post } from '../components/post'
import { LayoutWithSidebar } from '../components/layout-with-sidebar'

const getPosts = async () => {
  return await db
    .selectFrom('posts')
    .innerJoin('users', 'users.snowflakeId', 'posts.userId')
    .select([
      selectUuid('posts.id').as('id'),
      'posts.snowflakeId',
      'posts.title',
      'posts.createdAt',
      'users.username',
      'users.avatarUrl as userAvatar',
      (eb) =>
        eb
          .selectFrom('messages')
          .select(eb.fn.countAll<number>().as('count'))
          .where('messages.postId', '=', eb.ref('posts.snowflakeId'))
          .where('messages.snowflakeId', '!=', eb.ref('posts.snowflakeId'))
          .as('messagesCount'),
    ])
    .orderBy('createdAt', 'desc')
    .execute()
}

const Home = async () => {
  const posts = await getPosts()

  return (
    <>
      <div className="py-12 border-b border-neutral-800 bg-gradient-to-t from-neutral-900 to-neutral-800">
        <div className="container max-w-7xl mx-auto flex items-center">
          <div className="flex-1 flex flex-col space-y-4">
            <h2 className="font-semibold text-5xl max-w-2xl leading-[1.1]">
              The Next.js Discord server indexed in the web
            </h2>
            <a
              href="https://nextjs.org/discord"
              target="_blank"
              rel="noopener"
              className="text-xl"
            >
              Join the server ➔
            </a>
          </div>

          <div className="bg-slate-900 w-[200px] h-[200px]" />
        </div>
      </div>

      <LayoutWithSidebar>
        <div className="space-y-2">
          {posts.map((post) => (
            <Post
              key={post.id.toString()}
              id={post.snowflakeId}
              title={post.title}
              createdAt={post.createdAt}
              messagesCount={post.messagesCount}
              hasAnswer={post.messagesCount > 2}
              author={{ avatar: post.userAvatar, username: post.username }}
            />
          ))}
        </div>
      </LayoutWithSidebar>
    </>
  )
}

export default Home
