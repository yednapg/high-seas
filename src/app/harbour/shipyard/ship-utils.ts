"use server";

import Airtable from "airtable";

const base = () => {
  const baseId = process.env.BASE_ID;
  if (!baseId) throw new Error("No Base ID env var set");

  return Airtable.base(baseId);
};

async function getSelfPersonId(slackId: string) {
  const page = await base()("people")
    .select({ filterByFormula: `{slack_id} = '${slackId}'` })
    .firstPage();

  if (page.length < 1)
    throw new Error(`No people found with Slack ID ${slackId}`);

  return page[0].id;
}

export interface Ship {
  id: string;
  title: string;
  repoUrl: string;
  readmeUrl: string;
  screenshotUrl: string;
  rating: number;
  hours: number;
}

export async function getUserShips(slackId: string): Promise<Ship[]> {
  const ships: Ship[] = [];
  const personId = await getSelfPersonId(slackId);

  return new Promise((resolve, reject) => {
    base()("ships")
      .select({
        // filterByFormula: `SEARCH('${personId}', {entrant})`,
        view: "Grid view",
      })
      .eachPage(
        (records, fetchNextPage) => {
          records.forEach((record) => {
            const entrant = record.get("entrant") as string[];
            if (entrant && entrant.includes(personId)) {
              ships.push({
                id: record.get("id") as string,
                title: record.get("title") as string,
                repoUrl: record.get("repo_url") as string,
                readmeUrl: record.get("readme_url") as string,
                screenshotUrl: record.get("screenshot_url") as string,
                rating: record.get("rating") as number,
                hours: record.get("hours") as number,
              });
            }
          });
          fetchNextPage();
        },
        (err) => (err ? reject(err) : resolve(ships)),
      );
  });
}
