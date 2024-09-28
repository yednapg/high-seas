"use server";

import Airtable from "airtable";

const base = () => {
  const baseId = process.env.BASE_ID;
  if (!baseId) throw new Error("No Base ID env var set");

  return Airtable.base(baseId);
};

export interface ShopItem {
  id: string;
  name: string;
  subtitle: string | null;
  imageUrl: string | null;
}

export async function getShop(): Promise<ShopItem[]> {
  const items: ShopItem[] = [];

  return new Promise((resolve, reject) => {
    base()("shop_items")
      .select({ view: "Grid view" })
      .eachPage(
        (records, fetchNextPage) => {
          records.forEach((record) => {
            items.push({
              id: record.get("identifier") as string,
              name: record.get("name") as string,
              subtitle: record.get("subtitle") as string | null,
              imageUrl: record.get("image_url") as string | null,
            });
          });

          fetchNextPage();
        },
        (err) => (err ? reject(err) : resolve(items)),
      );
  });

  //
  // return new Promise((resolve, reject) => {
  //   base()("shop").select({
  //     // filterByFormula: `SEARCH('${personId}', {entrant})`,
  //     // view: "Grid view",
  //   });

  // .eachPage(
  //   (records, fetchNextPage) => {
  //     records.forEach((record) => {
  //       const entrant = record.get("entrant") as string[];
  //       if (entrant && entrant.includes(personId)) {
  //         ships.push({
  //           id: record.get("id") as string,
  //           title: record.get("title") as string,
  //           repoUrl: record.get("repo_url") as string,
  //           readmeUrl: record.get("readme_url") as string,
  //           screenshotUrl: record.get("screenshot_url") as string,
  //           rating: record.get("rating") as number,
  //           hours: record.get("hours") as number,
  //         });
  //       }
  //     });
  //     fetchNextPage();
  //   },
  //   (err) => (err ? reject(err) : resolve(ships)),
  // );
  // });
}
