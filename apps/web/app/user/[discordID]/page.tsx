import { CalendarPlusIcon } from '@/components/icons/calender-plus'
import { HeartIcon } from '@/components/icons/heart'
import { MedalIcon } from '@/components/icons/medal'
import { Post } from '@/components/post'
import { getCanonicalUserUrl } from '@/utils/urls'
import { Metadata } from 'next'

const userData = {
  id: 'cb3c89d5-8039-4da7-9fd6-70d5acb1a692',
  snowflakeId: '1274730311514722431',
  username: 'Arinji',
  userAvatar: 'https://cdn.arinji.com/u/qTJndN.png',
  leaderBoardPosition: 5,
  joinedAt: '2023-03-01',
  totalAnswerCount: 150,
}
export const generateMetadata = async ({
  params,
}: UserProps): Promise<Metadata> => {
  // const userData = await getUserData(params.discordID)

  const title = userData?.username
  const description = `${userData?.username}'s profile on the Next.js Discord Forum`
  const url = getCanonicalUserUrl(params.discordID)

  return {
    title,
    description,
    alternates: {
      canonical: url,
    },
    openGraph: {
      title,
      description,
      url,
      type: 'website',
      siteName: 'Next.js Discord Forum',
    },
    twitter: {
      card: 'summary',
      title,
      description,
    },
  }
}

type UserProps = {
  params: { discordID: string }
}
const UserInfo = async ({ params }: UserProps) => {
  //   const isPublic = await getIsPublic(params.discordID)
  //   if (!isPublic) {
  //     notFound()
  //   }

  const isPublic = true

  // const userData = await getUserData(params.discordID)

  //const recentPosts = await getUserPosts(params.discordID)

  const recentPosts = [
    {
      id: 'cb3c89d5-8039-4da7-9fd6-70d5acb1a692',
      snowflakeId: '1274730311514722431',
      title: 'This is the first post made by me',
      createdAt: new Date(),
      username: 'Arinjii',
      userAvatar: 'https://cdn.arinji.com/u/qTJndN.png',
      hasAnswer: true,
      messagesCount: '3',
    },
    {
      id: 'cb3c89d5-8039-4da7-9fd6-70d5acb1a6',
      snowflakeId: '1274730311514722434',
      title: 'This is the second post made by me',
      createdAt: new Date(),
      username: 'Arinjii',
      userAvatar: 'https://cdn.arinji.com/u/qTJndN.png',
      hasAnswer: true,
      messagesCount: '3',
    },
    {
      id: 'cb3c89d5-8039-4da7-9fd6-70d5acb1a692',
      snowflakeId: '1274730311514722431',
      title: 'This is the third post made by me',
      createdAt: new Date(),
      username: 'Arinjii',
      userAvatar: 'https://cdn.arinji.com/u/qTJndN.png',
      hasAnswer: true,
      messagesCount: '3',
    },
    {
      id: 'cb3c89d5-8039-4da7-9fd6-70d5acb1a6',
      snowflakeId: '1274730311514722434',
      title: 'This is the fourth post made by me',
      createdAt: new Date(),
      username: 'Arinjii',
      userAvatar: 'https://cdn.arinji.com/u/qTJndN.png',
      hasAnswer: true,
      messagesCount: '3',
    },
    {
      id: 'cb3c89d5-8039-4da7-9fd6-70d5acb1a692',
      snowflakeId: '1274730311514722431',
      title: 'This is the fifth post made by me',
      createdAt: new Date(),
      username: 'Arinjii',
      userAvatar: 'https://cdn.arinji.com/u/qTJndN.png',
      hasAnswer: true,
      messagesCount: '3',
    },
  ]

  return (
    <main className="w-full h-full flex flex-col items-center justify-center">
      <section className="w-full h-full flex flex-col xl:flex-row items-stretch justify-center max-w-7xl px-4 py-12 xl:py-16 gap-4 xl:gap-10">
        <div className="w-fit min-w-[20%] md:max-w-[50%] xl:max-w-[30%] flex flex-row items-stretch justify-start gap-4 shrink-0">
          <img
            className="size-16 rounded-full"
            src={userData.userAvatar}
            alt={`User Avatar of ${userData.username}`}
          />
          <div className="w-fit   h-auto flex flex-col items-start justify-start gap-1 ">
            <h1 className="text-xl md:text-2xl font-semibold text-white line-clamp-1">
              {userData.username}
            </h1>
            <div className=" flex flex-row items-center justify-center gap-1 w-fit h-fit opacity-80 pt-1 ">
              <MedalIcon size={4} className="mb-[1px]" />{' '}
              <p className="text-sm h-fit">
                Leaderboard Position:{' '}
                <span className="opacity-60">
                  {userData.leaderBoardPosition}
                </span>
              </p>
            </div>

            <div className=" flex flex-row items-center justify-center gap-1 w-fit h-fit opacity-80 ">
              <CalendarPlusIcon size={4} className="mb-[1px]" />{' '}
              <p className="text-sm h-fit">
                Joined: <span className="opacity-60">{userData.joinedAt}</span>
              </p>
            </div>
            <div className=" flex flex-row items-center justify-center gap-1 w-fit h-fit opacity-80 ">
              <HeartIcon size={4} className="mb-[1px]" />{' '}
              <p className="text-sm h-fit">
                Total Answers:{' '}
                <span className="text-green-500">
                  {userData.totalAnswerCount}
                </span>
              </p>
            </div>
          </div>
        </div>
        <div className="w-full h-[1px] xl:w-[1px] bg-white/10 xl:h-auto mt-3 xl:mt-0"></div>
        <div className="w-full h-fit flex flex-col items-stretch justify-start gap-4  xl:py-0">
          {recentPosts.map((post) => (
            <Post
              key={post.id}
              id={post.snowflakeId}
              title={post.title}
              createdAt={post.createdAt}
              messagesCount={parseInt(post.messagesCount ?? '0', 10)}
              hasAnswer={post.hasAnswer}
              author={{ avatar: post.userAvatar, username: post.username }}
            />
          ))}
        </div>
      </section>
    </main>
  )
}

export default UserInfo
