'use server'

import { sql } from "@vercel/postgres";

async function processPendingInviteJobs() {

  const { rows } = await sql`SELECT * FROM background_job WHERE type = 'invite' AND status = 'pending' LIMIT 10`;

  if (rows.length === 0) { return }

  console.log(`Processing ${rows.length} invite jobs`)

  const fields = rows.map(row => ({
    'fields': {
      'Email': row.args.email,
      'Form Submission IP': row.args.ipAddress,
      'User Agent': row.args.userAgent,
    }
  }))

  const { records } = await fetch('https://middleman.hackclub.com/airtable/v0/appaqcJtn33vb59Au/High Seas', {
    cache: "no-cache",
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${process.env.AIRTABLE_API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ records: fields }),
  }).then(r => r.json())

  // update the status of the jobs
  await Promise.all(records.map(async (record) => {
    return await sql`
    UPDATE background_job
    SET status='completed',
      output=${JSON.stringify(record)}
      WHERE args->>'email' = ${record.fields.Email}
      AND type='invite'
      AND status='pending'`
  }))
}

async function processPendingPersonInitJobs() {
  const { rows } = await sql`
  SELECT DISTINCT ON (args->>'email') 
    args->>'email' AS email, 
    args->>'ipAddress' AS ipAddress, 
    args->>'isMobile' AS isMobile,
    args->>'username' AS username
  FROM background_job
  WHERE type = 'create_person'
  AND status = 'pending'
  ORDER BY args->>'email', created_at DESC
  LIMIT 10;
  `

  if (rows.length === 0) { return }

  console.log(`Processing ${rows.length} create_person jobs`)

  const fields = rows.map(row => ({
    'fields': {
      'email': row.email,
      'ip_address': row.ipAddress,
      'email_submitted_on_mobile': row.isMobile,
      'arrpheus_ready_to_invite': true,
    }
  }))

  console.log(
    "Creating person"
  )
  const upsertBody = {
    records: fields,
    "performUpsert": {
      "fieldsToMergeOn": [
        "email"
      ]
    },
  }
  console.log(JSON.stringify(upsertBody, null, 2))
  const result = await fetch('https://middleman.hackclub.com/airtable/v0/appTeNFYcUiYfGcR6/tblfTzYVqvDJlIYUB', {
    cache: "no-cache",
    method: 'PATCH',
    headers: {
      'Authorization': `Bearer ${process.env.AIRTABLE_API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      records: fields,
      "performUpsert": {
        "fieldsToMergeOn": [ "email" ]
      }
    }),
  }).then(r => r.json()).catch(console.error)
  console.log(result)
  const records = result?.records || []
  console.log("Person created", records)

  await Promise.all(records.map(async (record) => {
    return await sql`
    UPDATE background_job
    SET status='completed',
      output=${JSON.stringify(record)}
      WHERE args->>'email' = ${record.fields.email}
      AND type='create_person'
      AND status='pending'`
  }))
}

export async function processBackgroundJobs() {
  await Promise.all([
    processPendingInviteJobs(),
    // processPendingPersonInitJobs()
  ])
}