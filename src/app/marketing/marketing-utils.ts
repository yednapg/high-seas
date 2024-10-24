"use server";
import { headers } from "next/headers";
import { type NextRequest } from "next/server";
import Airtable from "airtable";
import { createWaka } from "../utils/waka";

const highSeasBase = () => {
  const highSeasBaseId = process.env.BASE_ID;
  if (!highSeasBaseId) throw new Error("No Base ID env var set");
  return Airtable.base(highSeasBaseId)("tblfTzYVqvDJlIYUB");
};

export async function handleEmailSubmission(
  email: string,
  request?: NextRequest,
) {
  // Validate email
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
  const personRecordId = await new Promise((resolve, reject) => {
    highSeasBase().create(
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
  const signup = await createWaka(email, null, null);

  if (!signup.ok) {
    console.error("Waka signup failed:");
    throw new Error("Failed to create HackaTime user");
  }

  const wakaResponseJson = await signup.json();

  return {
    ...wakaResponseJson,
    personRecordId,
  };
}

export async function markArrpheusReadyToInvite(id: string): Promise<void> {
  return new Promise((resolve, reject) => {
    highSeasBase().update(
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
