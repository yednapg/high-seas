"use server";
import { headers } from "next/headers";
import Airtable from "airtable";
import { createWaka } from "../utils/waka";
import { getSession } from "../utils/auth";

import createBackgroundJob from "../api/cron/every-minute/create-background-job";

const highSeasPeopleTable = () => {
  const highSeasBaseId = process.env.BASE_ID;
  if (!highSeasBaseId) throw new Error("No Base ID env var set");
  return Airtable.base(highSeasBaseId)("tblfTzYVqvDJlIYUB");
};

export async function handleEmailSubmission(
  email: string,
  isMobile: boolean,
  userAgent: string,
): Promise<{
  username: string;
  key: string;
} | null> {
  if (!email) throw new Error("No email supplied to handleEmailSubmission");
  if (!userAgent)
    throw new Error("No user agent supplied to handleEmailSubmission");

  const ipAddress = headers().get("x-forwarded-for");

  const [
    session,
    _backgroundJob
  ] = await Promise.all([
    getSession(),
    createBackgroundJob('invite', { email, ipAddress, userAgent, isMobile }),
  ])

  const slackId = session?.slackId

  const signup = await createWaka( email, null, slackId );
  const { username, key } = signup

  if (username) {
    await createBackgroundJob('create_person', { email, ipAddress, isMobile, username });
  }

  return {
    username,
    key,
  };
}

export async function markArrpheusReadyToInvite(id: string): Promise<void> {
  console.log("Marking arrpheus ready to invite for", id);

  return new Promise((resolve, reject) => {
    highSeasPeopleTable().update(
      [
        {
          id,
          fields: {
            arrpheus_ready_to_invite: true,
          },
        },
      ],
      (err: Error, records: any) => {
        if (err) {
          console.error(err);
          reject(err);
        } else {
          resolve();
        }
      },
    );
  });
}
