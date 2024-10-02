"use server";

import { cookies, headers } from "next/headers";
import { redirect } from "next/navigation";
import { getSession } from "./auth";

export interface WakaSignupResponse {
  created: boolean;
  api_key: string;
}

export async function getWaka(): Promise<WakaSignupResponse | null> {
  let key = cookies().get("waka-key");
  if (!key) {
    await createWaka();
    key = cookies().get("waka-key");
    if (!key) return null;
  } else {
    console.log("there was alr a waka key: ", key);
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

async function createWaka() {
  const newSession = await getSession();
  if (!newSession) return errRedir("No session was set");

  const slackId: string = newSession.payload.sub;
  if (!slackId) return errRedir("No Slack ID in session OpenID payload");

  const slackEmail: string = newSession.payload.email;
  if (!slackEmail) return errRedir("No Slack email in session OpenID payload");

  const password = crypto.randomUUID();
  const signup = await fetch("https://waka.hackclub.com/signup", {
    method: "POST",
    headers: {
      Authorization: "Bearer blahaji_rulz_da_world",
    },
    body: new URLSearchParams({
      location: "America/New_York",
      username: slackId,
      email: slackEmail,
      password: password,
      password_repeat: password,
    }),
  });

  const signupResponse = await signup.json();

  console.log("created a new wakatime token: ", signupResponse);

  await setWaka(signupResponse);
}
