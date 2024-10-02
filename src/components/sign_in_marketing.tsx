"use server";

import { buttonVariants } from "@/components/ui/button";
import Link from "next/link";
import { headers } from "next/headers";

export default async function SignIn() {
  const headersList = headers();
  const host = headersList.get("host") || "";
  const proto = headersList.get("x-forwarded-proto") || "http";
  const origin = encodeURIComponent(`${proto}://${host}`);

  const slackAuthUrl = `https://slack.com/oauth/v2/authorize?scope=&user_scope=openid%2Cprofile%2Cemail&redirect_uri=${origin}/api/slack_redirect&client_id=${process.env.SLACK_CLIENT_ID}`;

  return (
    <Link
      className="bg-green-400 p-2 px-6 inline-block w-96 rounded-lg text-2xl linkPop"
      href={slackAuthUrl}
    >
      Sign in with Hack Club Slack
    </Link>
  );
}