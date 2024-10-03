"use server";

import Airtable from "airtable";

export const base = () => {
  const baseId = process.env.BASE_ID;
  if (!baseId) throw new Error("No Base ID env var set");

  return Airtable.base(baseId);
};

export const getSelfPerson = async (slackId: string) => {
  const peopleTableName = "people";
  const b = await base()
  console.log({b})
  const page = await b(peopleTableName)
    .select({ filterByFormula: `{slack_id} = '${slackId}'` })
    .firstPage();

  if (page.length < 1)
    throw new Error(`No people found with Slack ID ${slackId}`);

  return page[0];
}

export const getPersonTicketBalance = async (slackId: string) => {
  const person = await getSelfPerson(slackId);
  console.log({slackId, settled: person.get("settled_tickets")});
  return person.get("settled_tickets") as number;
}