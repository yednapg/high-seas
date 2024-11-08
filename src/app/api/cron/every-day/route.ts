import Airtable from 'airtable'
import type { NextRequest } from 'next/server'

Airtable.configure({
  apiKey: process.env.AIRTABLE_API_KEY,
  endpointUrl: 'https://middleman.hackclub.com/airtable/v0',
})

const base = Airtable.base('appTeNFYcUiYfGcR6')

const highSeasChannelId = 'C07PZMBUNDS'

async function processDailyJobs() {
  const startingMessage = base('arrpheus_message_requests').create({
    message_text: `Each day, a newly signed up user will win a free Raspberry Pi Zero! Today's winner is...`,
    target_slack_id: highSeasChannelId,
    requester_identifier: 'cron-job',
  })

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
  const order = base('orders').create({
    shop_item: 'item_free_raspberry_pi_zero',
    recipient: [winner?.id],
  })

  // send a DM to the winner
  const dmMessage = base('arrpheus_message_requests').create({
    message_text: `Congratulations to <@${winner?.fields['slack_id']}> for winning a free Raspberry Pi Zero! 🎉`,
    target_slack_id: winner?.fields['slack_id'],
    requester_identifier: 'cron-job',
  })

  // post in the #high-seas channel
  const publicMessage = base('arrpheus_message_requests').create({
    message_text: `Congratulations to <@${winner?.fields['slack_id']}> for winning a free Raspberry Pi Zero! 🎉`,
    target_slack_id: highSeasChannelId,
    requester_identifier: 'cron-job',
  })

  await Promise.all([order, dmMessage, publicMessage])
}

export async function GET(request: NextRequest) {
  await processDailyJobs()
  return Response.json({ success: true })
}

export const maxDuration = 60
export const fetchCache = 'force-no-store'
