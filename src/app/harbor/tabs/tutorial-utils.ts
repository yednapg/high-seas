"use server";

import { getSession } from "../../utils/auth";

export async function hasHb(username: string, key: string): Promise<boolean> {
  const res = await fetch(
    `https://waka.hackclub.com/api/special/hasData?user=${username}`,
    { headers: { Authorization: `Bearer ${key}` } },
  ).then((d) => d.json());
  return res.hasData === true;
}

export async function markAcademyComplete() {
  const session = await getSession();
  if (!session) throw new Error("Mark academy complete not worky! :(");

  const res = await fetch(
    `https://api.airtable.com/v0/appTeNFYcUiYfGcR6/people`,
    {
      method: "PATCH",
      headers: {
        Authorization: `Bearer ${process.env.AIRTABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        records: [
          {
            id: session.personId,
            fields: { academy_completed: true },
          },
        ],
      }),
    },
  ).then((d) => d.json());
  console.log("RSNOTOESRNTESRNTITSRTF##33", res);
}
