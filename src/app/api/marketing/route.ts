// run every minute, trigger a job to invite new users

import { processPendingInviteJobs } from '@/app/marketing/invite-job';
import type { NextRequest } from 'next/server';

async function process() {
  await Promise.all([
    processPendingInviteJobs(),
    new Promise((resolve) => setTimeout(resolve, 1000 * 20))
  ])
}
 
export async function GET(request: NextRequest) {
  const authHeader = request.headers.get('authorization');
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return new Response('Unauthorized', {
      status: 401,
    });
  }

  await process();
  await process();
  await process();


  return Response.json({ success: true });
}

export const fetchCache = 'force-no-store'