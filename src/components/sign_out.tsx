"use client"

import { buttonVariants } from "./ui/button";

export default function SignOut() {
  const handleOnClick = () => {
    localStorage.removeItem('cache.wakaToken')
    localStorage.removeItem('cache.hasWakaHb')
    localStorage.removeItem('cache.wakaEmail')
  }

  return (
    <a className={buttonVariants({ variant: "outline" })} onClick={handleOnClick} href="/signout" prefetch={false}>
      Sign out of Hack Club Slack
    </a>
  );
}
