import type { NextRequest } from 'next/server'
import { db, sql } from '@nextjs-forum/db/node'

export async function GET(request: NextRequest) {
  const authHeader = request.headers.get('authorization')
  if (
    process.env.CRON_SECRET &&
    authHeader !== `Bearer ${process.env.CRON_SECRET}`
  ) {
    return new Response('Unauthorized', {
      status: 401,
    })
  }

  // Update all user ranks in a single query using raw SQL for efficiency
  await sql`WITH ranked AS (
      SELECT
        "snowflakeId",
        RANK() OVER (ORDER BY COALESCE("answersCount", 0) DESC, "snowflakeId" DESC) AS position
      FROM users
    )
    UPDATE users
    SET rank = ranked.position
    FROM ranked
    WHERE users."snowflakeId" = ranked."snowflakeId"`.execute(db)

  return Response.json({ success: true })
}
