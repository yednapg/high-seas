import type { NextRequest } from 'next/server'
import { processBackgroundJobs } from './process-background-jobs'

export async function GET(request: NextRequest) {
  const authHeader = request.headers.get('authorization')
  const isDev = process.env.NODE_ENV === 'development'
  if (!isDev && authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return new Response('Unauthorized', {
      status: 401,
    })
  }

  await processBackgroundJobs()

  return Response.json({ success: true })
}

export const maxDuration = 60
export const fetchCache = 'force-no-store'
