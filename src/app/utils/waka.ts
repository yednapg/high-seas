"use server";

import { cookies, headers } from "next/headers";

export interface WakaSignupResponse {
  created: boolean;
  api_key: string;
}

export async function setWaka(resp: WakaSignupResponse) {
  console.log("setting waka key: ", resp);

  cookies().set("waka-key", JSON.stringify(resp), {
    secure: process.env.NODE_ENV !== "development",
    httpOnly: true,
  });

  console.log("set the waka key!", cookies().get("waka-key"));
}

export async function getWaka(): Promise<WakaSignupResponse | null> {
  const key = cookies().get("waka-key");
  if (!key) return null;

  return JSON.parse(key.value) as WakaSignupResponse;
}
