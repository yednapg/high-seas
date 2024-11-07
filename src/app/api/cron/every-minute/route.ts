import type { NextRequest } from 'next/server'
import { processBackgroundJobs } from './process-background-jobs'

export async function GET(request: NextRequest) {
  await processBackgroundJobs()

  return Response.json({ success: true })
}

export const maxDuration = 60
export const fetchCache = 'force-no-store'
