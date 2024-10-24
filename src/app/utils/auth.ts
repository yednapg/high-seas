"use server";

import { cookies, headers } from "next/headers";
import { getPersonBySlackId } from "../../../lib/battles/airtable";
import { getPersonByMagicToken } from "./airtable";

export interface HsSession {
  /// The Person record ID in the high seas base
  personId: string;

  authType: "slack-oauth" | "magic-link";
  slackId: string;
  name?: string;
  givenName?: string;
  email: string;
  picture?: string;
  sig?: string;
}

const sessionCookieName = "hs-session";

function parseJwt(token: string) {
  var base64Url = token.split(".")[1];
  var base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
  var jsonPayload = decodeURIComponent(
    atob(base64)
      .split("")
      .map(function (c) {
        return "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2);
      })
      .join(""),
  );

  return JSON.parse(jsonPayload);
}

async function hashSession(session: HsSession) {
  const str = [
    session.personId,
    session.authType,
    session.slackId,
    session.name || "",
    session.givenName || "",
    session.email,
    session.picture || "",
  ].join("|");

  const authSecret = process.env.AUTH_SECRET;
  if (!authSecret) throw new Error("Env AUTH_SECRET is not set");

  // Convert string and key to Uint8Array
  const encoder = new TextEncoder();
  const data = encoder.encode(str);
  const keyData = encoder.encode(authSecret);

  // Import the secret key
  const key = await crypto.subtle.importKey(
    "raw",
    keyData,
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"],
  );

  // Generate HMAC
  const hashBuffer = await crypto.subtle.sign("HMAC", key, data);

  // Convert hash to hex string
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  const hashHex = hashArray
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");

  return hashHex;
}

async function signAndSet(session: HsSession) {
  session.sig = await hashSession(session);

  cookies().set(sessionCookieName, JSON.stringify(session), {
    secure: process.env.NODE_ENV !== "development",
    httpOnly: true,
    maxAge: 60 * 60 * 24 * 7,
  });
}

export async function verifySession(
  session: HsSession,
): Promise<HsSession | null> {
  const hashCheck = await hashSession(session);

  if (session.sig === hashCheck) {
    return session;
  } else {
    return null;
  }
}

export async function createSlackSession(slackOpenidToken: string) {
  try {
    const payload = parseJwt(slackOpenidToken);

    if (!payload) throw new Error("Failed to decode the Slack OpenId JWT");

    const person = (await getPersonBySlackId(payload.sub as string)) as any;
    if (!person) {
      throw new Error(`Failed to look up Person by Slack ID: ${payload.sub}`);
    }

    const sessionData: HsSession = {
      personId: person.id,
      authType: "slack-oauth",
      slackId: payload.sub as string,
      email: payload.email as string,
      name: payload.name as string,
      givenName: payload.given_name as string,
      picture: payload.picture as string,
    };

    await signAndSet(sessionData);
  } catch (error) {
    console.error("Error creating Slack session:", error);
    throw error;
  }
}

export async function constructMagicSession(
  magicCode: string,
): Promise<HsSession> {
  const partialPersonData = await getPersonByMagicToken(magicCode);
  if (!partialPersonData)
    throw new Error(`Failed to look up Person by magic code: ${magicCode}`);

  const { id, email, slackId } = partialPersonData;

  console.log("SOTNRESTNSREINTS", { id, email, slackId });

  const session: HsSession = {
    personId: id,
    authType: "magic-link",
    slackId,
    email,
  };

  session.sig = await hashSession(session);

  return session;
}

export async function getSession(): Promise<HsSession | null> {
  try {
    const sessionCookie = cookies().get(sessionCookieName);
    if (!sessionCookie) return null;

    const unsafeSession = JSON.parse(sessionCookie.value);
    return verifySession(unsafeSession);
  } catch (error) {
    console.error("Error verifying session:", error);
    return null;
  }
}

export async function deleteSession() {
  cookies().delete(sessionCookieName);
  cookies().delete("waka-key");
}

export async function getRedirectUri(): Promise<string> {
  const headersList = headers();
  const host = headersList.get("host") || "";
  const proto = headersList.get("x-forwarded-proto") || "http";
  const uri = encodeURIComponent(`${proto}://${host}/api/slack_redirect`);

  return uri;
}
