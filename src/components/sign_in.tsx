import { buttonVariants } from "@/components/ui/button";
import Link from "next/link";
import { headers } from "next/headers";

export default function SignIn() {
  // Function to get the origin, works on both server and client
  const getOrigin = () => {
    if (typeof window !== "undefined") {
      // Client-side
      return window.location.origin;
    } else {
      // Server-side
      const headersList = headers();
      const host = headersList.get("host") || "";
      const proto = headersList.get("x-forwarded-proto") || "http";
      return `${proto}://${host}`;
    }
  };

  const slackAuthUrl = `https://slack.com/oauth/v2/authorize?scope=&user_scope=openid%2Cprofile%2Cemail&redirect_uri=${getOrigin()}/api/slack_redirect&client_id=2210535565.7780087007589`;

  return (
    <div className="backdrop-blur w-full h-full">
      <p>Sign in with the Hack Club Slack</p>
      <Link
        className={buttonVariants({ variant: "outline" })}
        href={slackAuthUrl}
      >
        Add to Slack
      </Link>
    </div>
  );
}
