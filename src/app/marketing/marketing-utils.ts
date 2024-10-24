"use server";

import { headers } from "next/headers";
import { type NextRequest } from "next/server";
import Airtable from "airtable";

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

  // Crate row in Slack Join Requests base (high seas table)
  Airtable.base("appaqcJtn33vb59Au")("tblQORJfOQcm4CoWn").create(
    [
      {
        fields: {
          Email: email,
          "Form Submission IP": ip,
        },
      },
    ],
    (err: Error, records: any) => {
      if (err) console.error(err);
    },
  );

  // Create person record (email & IP) in High Seas base
  const highSeasBaseId = process.env.BASE_ID;
  if (!highSeasBaseId) throw new Error("No Base ID env var set");

  Airtable.base(highSeasBaseId)("tblfTzYVqvDJlIYUB").create(
    [
      {
        fields: {
          email,
          ip_address: ip,
        },
      },
    ],
    (err: Error, records: any) => {
      if (err) console.error(err);
    },
  );

  // Create HackaTime user
  const username = `$high-seas-provisional-${email.replace("+", "$plus$")}`;

  const password = crypto.randomUUID();
  const signup = await fetch("https://waka.hackclub.com/signup", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${process.env.WAKA_API_KEY}`,
    },
    body: new URLSearchParams({
      location: "America/New_York",
      username,
      email,
      password: password,
      password_repeat: password,
    }),
  });

  return await signup.json();
}
