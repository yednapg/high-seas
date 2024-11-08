export const dynamic = 'force-dynamic'

import { processBackgroundJobs } from './process-background-jobs';

export async function GET() {
  await processBackgroundJobs()

  return Response.json({ success: true });
}