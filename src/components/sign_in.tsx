"use server";

import { buttonVariants } from "@/components/ui/button";
import Link from "next/link";
import { headers } from "next/headers";

export default async function SignIn() {
  const headersList = headers();
  const host = headersList.get("host") || "";
  const proto = headersList.get("x-forwarded-proto") || "http";
  const origin = `${proto}://${host}`;

  const slackAuthUrl = `https://slack.com/oauth/v2/authorize?scope=&user_scope=openid%2Cprofile%2Cemail&redirect_uri=${origin}/api/slack_redirect&client_id=2210535565.7780087007589`;

  return (
    <Link
      className={buttonVariants({ variant: "outline" })}
      href={slackAuthUrl}
    >
      Sign in with Hack Club Slack
    </Link>
  );
}
