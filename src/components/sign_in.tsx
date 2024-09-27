import { buttonVariants } from "@/components/ui/button";
import Link from "next/link";

export default function SignIn() {
  return (
    <div className="backdrop-blur w-full h-full">
      <p>Sign in with the Hack Club Slack</p>

      <Link
        className={buttonVariants({ variant: "outline" })}
        href="https://slack.com/oauth/v2/authorize?scope=&amp;user_scope=openid%2Cprofile%2Cemail&amp;redirect_uri=https://1582-149-88-98-71.ngrok-free.app/api/slack_redirect&amp;client_id=2210535565.7780087007589"
      >
        Add to Slack
      </Link>
    </div>
  );
}
