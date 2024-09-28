import Link from "next/link";
import { buttonVariants } from "./ui/button";

export default function SignOut() {
  return (
    <Link className={buttonVariants({ variant: "outline" })} href="/signout">
      Sign out of Hack Club Slack
    </Link>
  );
}
