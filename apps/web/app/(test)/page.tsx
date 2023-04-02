import { db, selectUuid, sql } from 'db/node'
import { Post } from '@/components/post'

const getPosts = async () => {
  return await db
    .selectFrom('posts')
    .innerJoin('users', 'users.snowflakeId', 'posts.userId')
    .leftJoin('messages', 'messages.snowflakeId', 'posts.answerId')
    .select([
      selectUuid('posts.id').as('id'),
      'posts.snowflakeId',
      'posts.title',
      'posts.createdAt',
      'users.username',
      'users.avatarUrl as userAvatar',
      sql<number>`if (messages.id is null, 0, 1)`.as('hasAnswer'),
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
    <div className="space-y-2">
      {posts.map((post) => (
        <Post
          key={post.id.toString()}
          id={post.snowflakeId}
          title={post.title}
          createdAt={post.createdAt}
          messagesCount={post.messagesCount}
          hasAnswer={post.hasAnswer === 1}
          author={{ avatar: post.userAvatar, username: post.username }}
        />
      ))}
    </div>
  )
}

export default Home
