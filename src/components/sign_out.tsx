"use client";

import { Button, buttonVariants } from "./ui/button";

export default function SignOut() {
  const handleOnClick = () => {
    localStorage.removeItem("cache.wakaToken");
    localStorage.removeItem("cache.hasWakaHb");
    localStorage.removeItem("cache.wakaEmail");
  };

  return (
    <a onClick={handleOnClick} href="/signout">
      <Button className={buttonVariants({ variant: "outline" })}>
        Sign out of Hack Club Slack
      </Button>
    </a>
  );
}
