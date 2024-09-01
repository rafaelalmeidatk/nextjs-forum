import { notFound } from 'next/navigation'
import { db } from '@nextjs-forum/db/node'
const getUser = async (id: string) => {
  return await db
    .selectFrom('users')
    .select(['username'])
    .where('snowflakeId', '=', id)
    .executeTakeFirst()
}

const getPostsByUserWithAnswer = async (userId: string) => {
  return await db.transaction().execute(async (trx) => {
    return await trx
      .selectFrom('posts')
      .innerJoin('messages', 'posts.answerId', 'messages.snowflakeId')
      .select(['posts.title']) // Select More As needed
      .where('messages.userId', '=', userId)
      .limit(5)
      .execute()
  })
}

type UserProps = {
  params: { id: string }
}

const Post = async ({ params }: UserProps) => {
  if (!params.id) {
    notFound()
  }
  const user = await getUser(params.id)
  const post = await getPostsByUserWithAnswer(params.id)

  console.log(user, post)
  return <div>{user?.username}</div>
}

export default Post
