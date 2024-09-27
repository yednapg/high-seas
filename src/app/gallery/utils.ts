"use server";

import Airtable from "airtable";
import { Ship } from "../shipyard/ship-utils";

const base = () => {
  const baseId = process.env.BASE_ID;
  if (!baseId) throw new Error("No Base ID env var set");

  return Airtable.base(baseId);
};

export async function getShips(offset: string | undefined): Promise<{
  ships: Ship[];
  offset: string | undefined;
}> {
  const res = await fetch(
    `https://api.airtable.com/v0/appTeNFYcUiYfGcR6/ships?view=Grid%20view${offset ? `&offset=${offset}` : ""}`,
    { headers: { Authorization: `Bearer ${process.env.AIRTABLE_API_KEY}` } },
  );
  const data = await res.json();

  // TODO: Error checking
  const ships = data.records.map((r: any) => {
    return {
      id: r.id,
      title: r.fields.title,
      readmeUrl: r.fields.readme_url,
      hours: r.fields.hours,
      repoUrl: r.fields.repo_url,
      screenshotUrl: r.fields.screenshot_url,
      rating: r.fields.rating,
    };
  });

  return {
    ships,
    offset: data.offset,
  };

  // base()("ships")
  // .select({
  //   view: "Grid view",
  //   pageSize: 10,
  // })
  // .eachPage((records, _fetchNextPage) => {
  //   // if (err) {
  //   //   console.error("Error fetching ships:", err);
  //   //   reject(err);
  //   //   return;
  //   // }
  //   if (!records) {
  //     console.error("No records!");
  //     reject();
  //     return;
  //   }
  //   console.log(records);
  //   records.forEach((record) => {
  //     console.log("Gallery ship:", record.get("title"));
  //     ships.push({
  //       id: record.get("id") as string,
  //       title: record.get("title") as string,
  //       repoUrl: record.get("repo_url") as string,
  //       readmeUrl: record.get("readme_url") as string,
  //       screenshotUrl: record.get("screenshot_url") as string,
  //       rating: record.get("rating") as number,
  //       hours: record.get("hours") as number,
  //     });
  //   });
  //   resolve(ships);
  // });
}
