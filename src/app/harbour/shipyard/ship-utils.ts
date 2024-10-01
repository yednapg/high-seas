"use server";

import { getSession } from "@/app/utils/auth";
import Airtable from "airtable";

const peopleTableName = "people";
const shipsTableName = "ships";

const base = () => {
  const baseId = process.env.BASE_ID;
  if (!baseId) throw new Error("No Base ID env var set");

  return Airtable.base(baseId);
};

async function getSelfPersonId(slackId: string) {
  const page = await base()(peopleTableName)
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
  // doubloonsPaid?: number;
  hours: number;
}

export async function getUserShips(slackId: string): Promise<Ship[]> {
  const ships: Ship[] = [];
  const personId = await getSelfPersonId(slackId);

  return new Promise((resolve, reject) => {
    base()(shipsTableName)
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
        (err) => {
          console.log(ships);
          return err ? reject(err) : resolve(ships);
        },
      );
  });
}

export async function createShip(formData: FormData) {
  const session = await getSession();
  if (!session) {
    const error = new Error(
      "Tried to submit a ship with no Slack OAuth session",
    );
    console.log(error);
    throw error;
  }

  const slackId = session.payload.sub;
  const entrantId = await getSelfPersonId(slackId);

  console.log(formData, slackId, entrantId);

  base()(shipsTableName).create(
    [
      {
        fields: {
          title: formData.get("title"),
          hours: Number(formData.get("hours")),
          entrant: [entrantId],
          repo_url: formData.get("repo_url"),
          readme_url: formData.get("readme_url"),
          deploy_url: formData.get("deploy_url"),
          screenshot_url: formData.get("screenshot_url"),
        },
      },
    ],
    function (err, records) {
      if (err) {
        console.error(err);
        return;
      }
      if (!records) {
        console.error("No records!");
      } else {
        records.forEach(function (record) {
          console.log(record.getId());
        });
      }
    },
  );
}
