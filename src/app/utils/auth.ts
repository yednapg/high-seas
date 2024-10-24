"use server";

import { sign, decode, verify, JwtPayload, Jwt } from "jsonwebtoken";
import { cookies, headers } from "next/headers";
import { getPersonBySlackId } from "../../../lib/battles/airtable";
import { getPersonByMagicToken } from "./airtable";

export interface HsSession {
  /// The Person record ID in the high seas base
  id: string;

  authType: "slack-oauth" | "magic-link";
  slackId: string;
  name?: string;
  givenName?: string;
  email: string;
  picture?: string;
}

const sessionCookieName = "hs-session";

function signAndSet(session: HsSession) {
  const authSecret = process.env.AUTH_SECRET;
  if (!authSecret) throw new Error("Env AUTH_SECRET is not set");

  const signedToken = sign(session, authSecret, { expiresIn: "7d" });
  cookies().set(sessionCookieName, signedToken, {
    secure: process.env.NODE_ENV !== "development",
    httpOnly: true,
    maxAge: 60 * 60 * 24 * 7,
  });
}
function verifySessionCookie() {
  const authSecret = process.env.AUTH_SECRET;
  if (!authSecret) throw new Error("Env AUTH_SECRET is not set");

  const sessionCookie = cookies().get(sessionCookieName);
  if (!sessionCookie) return null;

  return verify(sessionCookie.value, authSecret, {
    complete: true,
    algorithms: ["HS256"],
  });
}

export async function createSlackSession(slackOpenidToken: string) {
  const decoded = decode(slackOpenidToken, { complete: true }) as any;
  if (!decoded) throw new Error("Failed to decode the Slack OpenId JWT");

  const person = getPersonBySlackId(decoded.payload.sub) as any;
  if (!person)
    throw new Error(
      "Failed to look up Person by Slack ID",
      decoded.payload.sub,
    );

  const sessionData: HsSession = {
    id: person.id,
    authType: "slack-oauth",
    slackId: decoded.payload.sub,
    email: decoded.payload.email,
    name: decoded.payload.name,
    givenName: decoded.payload.given_name,
    picture: decoded.payload.picture,
  };

  signAndSet(sessionData);
}

async function createMagicSession(magicCode: string) {
  const partialPersonData = await getPersonByMagicToken(magicCode);
  if (!partialPersonData)
    throw new Error(`Failed to look up Person by magic code: ${magicCode}`);

  const { id, email, slackId } = partialPersonData;

  const sessionData: HsSession = {
    id,
    authType: "magic-link",
    slackId,
    email,
  };

  signAndSet(sessionData);
}

export async function getSession(): Promise<Jwt | null> {
  const sessionCookie = verifySessionCookie();
  if (sessionCookie) return sessionCookie;

  const magicCookie = cookies().get("magic-auth-token"); // From middleware. Temporary.
  if (magicCookie) {
    await createMagicSession(magicCookie.value);

    const sessionCookie = verifySessionCookie();
    if (sessionCookie) return sessionCookie;
  }

  return null;
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
