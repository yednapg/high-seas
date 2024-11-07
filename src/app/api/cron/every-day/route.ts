import Airtable from 'airtable'
import type { NextRequest } from 'next/server'

Airtable.configure({
  apiKey: process.env.AIRTABLE_API_KEY,
  endpointUrl: 'https://middleman.hackclub.com/airtable/v0',
})
const base = Airtable.base('appTeNFYcUiYfGcR6')

async function processDailyJobs() {
  // read all free sticker orders created in the last 24 hours
  const eligibleUsers = await base('people')
    .select({
      filterByFormula: `AND(
    has_ordered_free_stickers,
    verified_eligible,
    )`,
    })
    .all()

  const winner = new Array(eligibleUsers).sort(() => Math.random() - 0.5)[0]

  // create the order

  const order = await base('orders').create({
    shop_item: 'item_free_raspberry_pi_zero',
    recipient: [winner?.id],
  })

  // send a DM to the winner

  // post in the #high-seas channel
}

export async function GET(request: NextRequest) {
  await processDailyJobs()
  return Response.json({ success: true })
}

export const maxDuration = 60
export const fetchCache = 'force-no-store'
