import { processBackgroundJobs } from '../process-background-jobs'

export const dynamic = 'force-dynamic'
export const fetchCache = 'force-no-store'

export async function GET() {
  await processBackgroundJobs()

  return Response.json({ success: true })
}
