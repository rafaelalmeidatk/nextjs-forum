import { db, selectUuid } from 'db/node'
import Image from 'next/image'
import plur from 'plur'
import { CheckCircleSolidIcon } from '../components/icons/check-circle-solid'
import { Post } from '../components/post'

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

      <div className="container max-w-7xl mx-auto px-4 py-8">
        <div className="flex space-x-8">
          <div className="flex-1 mt-2 space-y-2">
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

          <div className="w-[300px]">
            <div className="text-lg font-semibold">Most Helpful</div>

            <div className="mt-2 grid grid-cols-1 divide-y divide-neutral-800">
              {Array.from({ length: 5 }).map((_, i) => (
                <div key={i} className="flex justify-between py-2">
                  <div className="flex space-x-2 items-center">
                    <img
                      src="http://localhost:3000/_next/image?url=https%3A%2F%2Fcdn.discordapp.com%2Favatars%2F258390283127881728%2Fa_1f3f829c00186303e146b8aee9a20608.gif%3Fsize%3D256&w=48&q=75"
                      alt="Avatar"
                      className="w-4 h-4 rounded-full"
                    />
                    <div className="opacity-90">rafaelalmeidatk</div>
                  </div>
                  <div className="flex items-center space-x-1 opacity-90">
                    <CheckCircleSolidIcon size={5} />
                    <span className="text-sm ">2</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default Home
