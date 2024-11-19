'use server'

import { redirect } from 'next/navigation'
import { NextRequest } from 'next/server'

export async function GET(
  _request: NextRequest,
  { params }: { params: { slackId: string } },
) {

  redirect('/?slackId=' + params.slackId)
}