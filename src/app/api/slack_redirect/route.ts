import { setSession } from "@/app/utils/auth";
import { redirect } from "next/navigation";
import { NextRequest } from "next/server";

const errRedir = (err) => redirect("/slack-error?err=" + err.toString());

export async function GET(request: NextRequest) {
  const code = request.nextUrl.searchParams.get("code");

  const exchangeUrl = `https://slack.com/api/openid.connect.token?code=${code}&client_id=${process.env.SLACK_CLIENT_ID}&client_secret=${process.env.SLACK_CLIENT_SECRET}`;
  const res = await fetch(exchangeUrl, { method: "POST" });

  if (res.status !== 200) return errRedir("Bad Slack OpenId response status");

  const data = await res.json();
  if (!data || !data.ok) return errRedir("Bad Slack OpenID response");

  try {
    setSession(data.id_token);
  } catch (e) {
    return errRedir(e);
  }

  // const userInfoUrl = `https://slack.com/api/openid.connect.userInfo`;
  // const userInfo = await fetch(userInfoUrl, {
  //   headers: { Authorization: `Bearer ${data.access_token}` },
  // }).then((d) => d.json());

  redirect("/");
}
