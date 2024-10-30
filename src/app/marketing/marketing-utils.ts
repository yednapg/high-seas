"use server";
import { headers } from "next/headers";
import Airtable from "airtable";
import { createWaka } from "../utils/waka";
import { getSession } from "../utils/auth";

import { sendInviteJob } from "./invite-job.js";

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
  personRecordId: string;
} | null> {
  if (!email) throw new Error("No email supplied to handleEmailSubmission");
  if (!userAgent)
    throw new Error("No user agent supplied to handleEmailSubmission");

  const ipAddress = headers().get("x-forwarded-for");
  await sendInviteJob({ email, userAgent });

  // Create HackaTime user
  const session = await getSession();
  let signup;
  try {
    signup = await createWaka(
      email,
      session?.name ?? null,
      session?.slackId ?? null,
    );
    console.log(signup);
  } catch (e) {
    console.log(e);
    throw e;
    // const error = new Error("Failed to create HackaTime user:", e);
    // console.error(e);
    // throw error;
  }
  console.log("handleEmailSubmission Step 4:", signup);

  const { username, key } = signup;

  // Create person record (email & IP) in High Seas base
  const personRecordId: any = await new Promise((resolve, reject) => {
    highSeasPeopleTable().create(
      [
        {
          fields: {
            email,
            ip_address: ipAddress,
            email_submitted_on_mobile: isMobile,
          },
        },
      ],
      (err: Error, records: any) => {
        if (err) {
          console.error(err);
          reject(err);
        } else if (!records || records.length < 1) {
          const error = new Error("No person record was created");
          console.error(error);
          reject(error);
        } else {
          const id = records[0].id;
          if (!id) {
            const error = new Error("Person record ID is missing");
            console.error(error);
            reject(error);
          } else {
            resolve(id);
          }
        }
      },
    );
  });

  console.log("handleEmailSubmission Step 3:", personRecordId);

  return {
    username,
    key,
    personRecordId,
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
