import { getRedirectUri, getSession, setSession } from "@/app/utils/auth";
import { setWaka } from "@/app/utils/waka";
import { redirect } from "next/navigation";
import { NextRequest } from "next/server";

const errRedir = (err: any) => redirect("/slack-error?err=" + err.toString());

export async function GET(request: NextRequest) {
  const code = request.nextUrl.searchParams.get("code");

  const redirectUri = await getRedirectUri();

  const exchangeUrl = `https://slack.com/api/openid.connect.token?code=${code}&client_id=${process.env.SLACK_CLIENT_ID}&client_secret=${process.env.SLACK_CLIENT_SECRET}&redirect_uri=${redirectUri}`;
  console.log("exchanging by posting to", exchangeUrl);

  const res = await fetch(exchangeUrl, { method: "POST" });

  if (res.status !== 200) return errRedir("Bad Slack OpenId response status");

  const data = await res.json();
  if (!data || !data.ok) {
    console.error(data);
    return errRedir("Bad Slack OpenID response");
  }

  try {
    setSession(data.id_token);
  } catch (e) {
    return errRedir(e);
  }

  console.log();

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

  await setWaka(signupResponse);

  // const userInfoUrl = `https://slack.com/api/openid.connect.userInfo`;
  // const userInfo = await fetch(userInfoUrl, {
  //   headers: { Authorization: `Bearer ${data.access_token}` },
  // }).then((d) => d.json());

  redirect("/");
}
