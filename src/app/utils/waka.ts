"use server";

import { cookies, headers } from "next/headers";
import { redirect } from "next/navigation";
import { getSession } from "./auth";

const WAKA_API_KEY = process.env.WAKA_API_KEY;
export interface WakaSignupResponse {
  created: boolean;
  api_key: string;
}

export async function getWaka(): Promise<WakaSignupResponse | null> {
  let key = cookies().get("waka-key");
  if (!key) {
    const session = await getSession();
    if (!session?.email)
      throw new Error("You can't make a wakatime account without an email!");
    await createWaka(session.email, session?.name ?? null, session?.slackId);
    console.log("Created a wakatime account from getWaka. Session: ", session);
    key = cookies().get("waka-key");
    if (!key) return null;
  }

  return JSON.parse(key.value) as WakaSignupResponse;
}

async function setWaka(resp: WakaSignupResponse) {
  console.log("setting waka key: ", resp);

  cookies().set("waka-key", JSON.stringify(resp), {
    secure: process.env.NODE_ENV !== "development",
    httpOnly: true,
  });

  console.log("set the waka key!", cookies().get("waka-key"));
}

const errRedir = (err: any) => redirect("/slack-error?err=" + err.toString());

export async function createWaka(
  email: string,
  name: string | null,
  slackId: string | null,
) {
  const password = crypto.randomUUID();

  const payload: any = {
    location: "America/New_York",
    email,
    password,
    password_repeat: password,
  };

  if (name) payload["name"] = name;

  if (slackId) {
    payload["username"] = slackId;
  } else {
    payload["username"] =
      `$high-seas-provisional-${email.replace("+", "$plus$")}`;
  }

  const signup = await fetch("https://waka.hackclub.com/signup", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${WAKA_API_KEY}`,
    },
    body: new URLSearchParams(payload),
  });

  let signupResponse;
  try {
    signupResponse = await signup.json();
  } catch (e) {
    console.error(e);
    throw e;
  }

  console.log("created a new wakatime token: ", signupResponse);

  await setWaka(signupResponse);
  return { ...signupResponse, username: payload["username"] };
}

export async function getWakaSessions(): Promise<any> {
  const waka = await getWaka();
  if (!waka) {
    const err = new Error(
      "While getting sessions, no waka session could be found or created",
    );
    console.error(err);
    throw err;
  }

  const session = await getSession();
  if (!session)
    throw new Error(
      "No Slack OAuth session found while trying to get WakaTime sessions.",
    );

  const slackId = session.slackId;

  const summaryRes = await fetch(
    // TODO: this date needs to change dynamically and can't be too far in the future
    `https://waka.hackclub.com/api/summary?interval=low_skies&user=${slackId}&recompute=true`,
    {
      headers: {
        Authorization: `Bearer ${WAKA_API_KEY}`,
      },
    },
  );

  let summaryResJson;
  try {
    summaryResJson = await summaryRes.json();
  } catch (e) {
    console.error(e);
    throw e;
  }

  return summaryResJson;
}

export async function hasRecvFirstHeartbeat(): Promise<boolean> {
  try {
    const session = await getSession();
    if (!session)
      throw new Error(
        "No Slack OAuth session found while trying to get WakaTime sessions.",
      );

    const slackId = session.slackId;

    const hasDataRes: { hasData: boolean } = await fetch(
      `https://waka.hackclub.com/api/special/hasData/?user=${slackId}`,
      {
        headers: {
          Authorization: `Bearer ${WAKA_API_KEY}`,
        },
      },
    ).then((res) => res.json());

    return hasDataRes.hasData;
  } catch (e) {
    console.error(e);
    return false;
  }
}

export async function getWakaEmail(): Promise<string | null> {
  const session = await getSession();
  if (!session)
    throw new Error(
      "No Slack OAuth session found while trying to get WakaTime sessions.",
    );

  const slackId = session.slackId;

  const email: { email: string | null } = await fetch(
    `https://waka.hackclub.com/api/special/email/?user=${slackId}`,
    {
      headers: {
        Authorization: `Bearer ${WAKA_API_KEY}`,
      },
    },
  ).then((res) => res.json());

  return email.email;
}
