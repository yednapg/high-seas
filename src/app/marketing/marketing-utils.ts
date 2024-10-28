"use server";
import { headers } from "next/headers";
import { type NextRequest } from "next/server";
import Airtable from "airtable";
import { createWaka } from "../utils/waka";

const highSeasPeopleTable = () => {
  const highSeasBaseId = process.env.BASE_ID;
  if (!highSeasBaseId) throw new Error("No Base ID env var set");
  return Airtable.base(highSeasBaseId)("tblfTzYVqvDJlIYUB");
};

export async function handleEmailSubmission(email: string) {
  // Look up email
  const url = `https://api.airtable.com/v0/appTeNFYcUiYfGcR6/people/reccn503lZoH3jzUL?filterByFormula={email}='${email}'`;
  const res = await fetch(url, {
    headers: { Authorization: `Bearer ${process.env.AIRTABLE_API_KEY}` },
  });

  if (email.length < 2) {
    const error = new Error("Email is invalid");
    console.error(error);
    throw error;
  }

  const ip = headers().get("x-forwarded-for");

  // Create row in Slack Join Requests base (high seas table)
  await new Promise((resolve, reject) => {
    Airtable.base("appaqcJtn33vb59Au")("tblQORJfOQcm4CoWn").create(
      [
        {
          fields: {
            Email: email,
            "Form Submission IP": ip,
          },
        },
      ],
      (err: Error) => {
        if (err) {
          console.error(err);
          reject(err);
        } else {
          resolve(null);
        }
      },
    );
  });

  // Create person record (email & IP) in High Seas base
  const personRecordId: any = await new Promise((resolve, reject) => {
    highSeasPeopleTable().create(
      [
        {
          fields: {
            email,
            ip_address: ip,
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

  // Create HackaTime user
  let signup;
  try {
    signup = await createWaka(email, null, null);
  } catch (e) {
    const error = new Error("Failed to create HackaTime user:", e);
    console.error(error);
    throw error;
  }

  const apiKey = signup.api_key;
  const created = signup.created;
  const username = signup.username;

  return {
    apiKey,
    created,
    personRecordId,
    username,
  };
}

export async function markArrpheusReadyToInvite(id: string): Promise<void> {
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
