"use server";

import Airtable from "airtable";
import { getSession } from "./auth";

const at = () => new Airtable({ apiKey: process.env.AIRTABLE_API_KEY });

export const base = async () => {
  const baseId = process.env.BASE_ID;
  if (!baseId) throw new Error("No Base ID env var set");

  return at().base(baseId);
};

export const getSelfPerson = async (slackId: string) => {
  const peopleTableName = "people";
  const b = await base();
  const page = await b(peopleTableName)
    .select({ filterByFormula: `{slack_id} = '${slackId}'` })
    .firstPage();

  if (page.length < 1) {
    const session = await getSession();
    if (!session) {
      const error = new Error(
        "No session found when creating user after no person found in airtable during slackid-> person row id lookup",
      );
      console.error(error);
      throw error;
    }

    const { email, given_name, family_name } = session.payload;

    // Create user in Airtable
    const createResult = await b(peopleTableName).create({
      first_name: given_name,
      last_name: family_name,
      email,
      slack_id: slackId,
    });

    console.log(
      `Couldn't find person with Slack ID ${slackId} in the people base when translating slackId->person so created one: ${JSON.stringify(createResult)}`,
    );

    return createResult;
  } else {
    return page[0];
  }
};

export async function getPersonByMagicToken(token: string): Promise<{
  id: string;
  email: string;
  slackId: string;
} | null> {
  const baseId = process.env.BASE_ID;
  const apiKey = process.env.AIRTABLE_API_KEY;
  const table = "people";

  const url = `https://api.airtable.com/v0/${baseId}/${table}?filterByFormula={magic_auth_token}='${encodeURIComponent(token)}'`;

  const response = await fetch(url, {
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
  });

  if (!response.ok) {
    console.error("Airtable API error:", await response.text());
    return null;
  }

  const data = await response.json();
  if (!data.records || data.records.length === 0) return null;

  const id = data.records[0].id;
  const email = data.records[0].fields.email;
  const slackId = data.records[0].fields.slack_id;

  if (!id || !email || !slackId) return null;

  return { id, email, slackId };
}

export async function getSelfPersonId(slackId: string) {
  const person = await getSelfPerson(slackId);
  return person.get("identifier");
}

export const getPersonTicketBalance = async (slackId: string) => {
  const person = await getSelfPerson(slackId);
  return person.get("settled_tickets") as number;
};

export async function getVotesRemainingForNextPendingShip(slackId: string) {
  const person = await getSelfPerson(slackId);
  return person.get("votes_remaining_for_next_pending_ship") as number;
}
