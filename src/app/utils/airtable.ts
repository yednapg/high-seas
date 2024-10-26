"use server";
import { getSession } from "./auth";

export const getSelfPerson = async (slackId: string) => {
  const url = `https://api.airtable.com/v0/${process.env.BASE_ID}/people`;
  const filterByFormula = encodeURIComponent(`{slack_id} = '${slackId}'`);
  const response = await fetch(`${url}?filterByFormula=${filterByFormula}`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${process.env.AIRTABLE_API_KEY}`,
      "Content-Type": "application/json",
    },
  });

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  let data;
  try {
    data = await response.json();
  } catch (e) {
    console.error(e, await response.text());
    throw e;
  }
  return data.records[0];
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
    const err = new Error(`Airtable API error: ${await response.text()}`);
    console.error(err);
    throw err;
  }

  const data = await response.json();
  if (!data.records || data.records.length === 0) return null;

  const id = data.records[0].id;
  const email = data.records[0].fields.email;
  const slackId = data.records[0].fields.slack_id;

  if (!id || !email || !slackId) return null;

  return { id, email, slackId };
}

export async function getSelfPersonIdentifier(slackId: string) {
  const person = await getSelfPerson(slackId);
  return person.fields.identifier;
}

export const getPersonTicketBalance = async (slackId: string) => {
  const person = await getSelfPerson(slackId);
  return person.fields.settled_tickets as number;
};

export async function getVotesRemainingForNextPendingShip(slackId: string) {
  const person = await getSelfPerson(slackId);
  return person.fields.votes_remaining_for_next_pending_ship as number;
}
