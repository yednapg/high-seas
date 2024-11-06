"use server";

/* @malted says:
 * Hi! Welcome to `data.ts` :)
 * These are critical functions primarily used by `middleware.ts`.
 *
 * If you need the user's ships for example, you should not be here.
 * You should instead use the cookie, which is set by `middleware.ts`.
 *
 * Do not use any libraries here.
 * This module is imported into the Vercel edge runtime
 * You've been warned.
 */

import { getSession } from "./auth";
import { createWaka } from "./waka";
import { cookies } from "next/headers";

//#region Ships
export type ShipType = "project" | "update";
export type ShipStatus = "shipped" | "staged" | "deleted";
export interface Ship {
  id: string; // The Airtable row's ID.
  title: string;
  repoUrl: string;
  deploymentUrl?: string;
  readmeUrl: string;
  screenshotUrl: string;
  // doubloonsPaid?: number;
  matchups_count: number;
  hours: number | null;
  credited_hours: number | null;
  total_hours: number | null;
  voteRequirementMet: boolean;
  voteBalanceExceedsRequirement: boolean;
  doubloonPayout: number;
  shipType: ShipType;
  shipStatus: ShipStatus;
  wakatimeProjectNames: string[];
  createdTime: string;
  updateDescription: string | null;
  reshippedFromId: string | null;
  reshippedToId: string | null;
  reshippedAll: string[] | null;
  paidOut: boolean;
}

export async function fetchShips(slackId: string): Promise<Ship[]> {
  const filterFormula = `AND(
    TRUE(),
    '${slackId}' = {entrant__slack_id},
    {project_source} = 'high_seas',
    {ship_status} != 'deleted'
  )`;

  const url = `https://middleman.hackclub.com/airtable/v0/appTeNFYcUiYfGcR6/ships?filterByFormula=${encodeURIComponent(
    filterFormula
  )}`;
  const res = await fetch(url, {
    headers: {
      Authorization: `Bearer ${process.env.AIRTABLE_API_KEY}`,
      "Content-Type": "application/json",
      "User-Agent": "highseas.hackclub.com (fetchShips)",
    },
  }).then((data) => data.json());

  return res.records.map((r: any) => {
    const reshippedToIdRaw = r["fields"]["reshipped_to"] as [string] | null;
    const reshippedToId = reshippedToIdRaw ? reshippedToIdRaw[0] : null;

    const reshippedFromIdRaw = r["fields"]["reshipped_from"] as [string] | null;
    const reshippedFromId = reshippedFromIdRaw ? reshippedFromIdRaw[0] : null;
    const reshippedAll = r["fields"]["reshipped_all"] as [string] | null;

    const wakatimeProjectNameRaw = r["fields"]["wakatime_project_name"] as
      | string
      | null;
    const wakatimeProjectNames = wakatimeProjectNameRaw
      ? wakatimeProjectNameRaw.split("$$xXseparatorXx$$")
      : [];

    const ship: Ship = {
      id: r.id as string,
      title: r["fields"]["title"] as string,
      repoUrl: r["fields"]["repo_url"] as string,
      deploymentUrl: r["fields"]["deploy_url"] as string,
      readmeUrl: r["fields"]["readme_url"] as string,
      screenshotUrl: r["fields"]["screenshot_url"] as string,
      voteRequirementMet: Boolean(r["fields"]["vote_requirement_met"]),
      voteBalanceExceedsRequirement: Boolean(
        r["fields"]["vote_balance_exceeds_requirement"]
      ),
      matchups_count: r["fields"]["matchups_count"] as number,
      doubloonPayout: r["fields"]["doubloon_payout"] as number,
      shipType: r["fields"]["ship_type"] as ShipType,
      shipStatus: r["fields"]["ship_status"] as ShipStatus,
      wakatimeProjectNames,
      hours: r["fields"]["hours"] as number | null,
      credited_hours: r["fields"]["credited_hours"] as number | null,
      total_hours: r["fields"]["total_hours"] as number | null,
      createdTime: r["fields"]["created_time"] as string,
      updateDescription: r["fields"]["update_description"] as string | null,
      reshippedFromId,
      reshippedToId,
      reshippedAll,
      paidOut: Boolean(r["fields"]["paid_out"]),
    };

    return ship;
  });
}
//#endregion

//#region Person
export async function person(): Promise<any> {
  return new Promise(async (resolve, reject) => {
    const session = await getSession();
    if (!session) return reject("No session present");

    const record = await fetch(
      `https://middleman.hackclub.com/airtable/v0/appTeNFYcUiYfGcR6/people/${session.personId}`,
      {
        headers: {
          Authorization: `Bearer ${process.env.AIRTABLE_API_KEY}`,
          "Content-Type": "application/json",
          "User-Agent": "highseas.hackclub.com (person)",
        },
      }
    ).then((d) => d.json());
    if (!record) return reject("Person not found");

    resolve(record);
  });
}
//#endregion

//#region Wakatime
export async function hasHbData(username: string): Promise<boolean> {
  const res = await fetch(
    `https://waka.hackclub.com/api/special/hasData/?user=${encodeURIComponent(
      username
    )}`,
    {
      headers: {
        Authorization: `Bearer ${process.env.WAKA_API_KEY}`,
        accept: "application/json",
      },
    }
  ).then((res) => res.json());

  return res.hasData;
}
export async function fetchWaka(): Promise<{
  username: string;
  key: string;
  hasHb: boolean;
}> {
  const { slack_id, email, full_name, preexisting_user } = await person().then(
    (p) => p["fields"]
  );

  const { username, key } = await createWaka(
    email,
    preexisting_user ? full_name : null,
    preexisting_user ? slack_id : null
  );

  const hasHb = await hasHbData(username);

  return { username, key, hasHb };
}
//#endregion

//#region Signpost
export interface SignpostFeedItem {
  id: string;
  createdTime: Date;
  title: string;
  content: string;
  autonumber: number;
  category: "update" | "announcement" | "sale" | "alert";
  backgroundColor: string;
  textColor: string;
}
export async function fetchSignpostFeed(): Promise<SignpostFeedItem[]> {
  const result = await fetch(
    "https://middleman.hackclub.com/airtable/v0/appTeNFYcUiYfGcR6/signpost",
    {
      headers: {
        Authorization: `Bearer ${process.env.AIRTABLE_API_KEY}`,
        "User-Agent": "highseas.hackclub.com (fetchSignpostFeed)",
      },
    }
  ).then((d) => d.json());

  const records = result.records;

  //TODO: Pagination.
  return records
    .filter((r: any) => r["fields"].visible === true)
    .map((r: any) => ({
      id: r.id,
      createdTime: new Date(r.createdTime),
      title: r["fields"].title,
      content: r["fields"].content,
      autonumber: Number(r["fields"].autonumber),
      category: r["fields"].category,
      backgroundColor: r["fields"].background_color,
      textColor: r["fields"].text_color,
    }));
}
//#endregion
