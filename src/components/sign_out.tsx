"use client"

import { buttonVariants } from "./ui/button";
import { LogOut } from "lucide-react";

export default function SignOut() {
  const handleOnClick = () => {
    localStorage.removeItem('cache.wakaToken')
    localStorage.removeItem('cache.hasWakaHb')
    localStorage.removeItem('cache.wakaEmail')
  }

  return (
    <a 
      className={`${buttonVariants({ variant: "outline" })} flex items-center justify-center sm:justify-start`} 
      onClick={handleOnClick} 
      href="/signout"
    >
      <LogOut className="w-5 h-5 mr-2 sm:hidden" />
      <span className="hidden sm:inline">Sign out of Hack Club Slack</span>
      <span className="sm:hidden">Sign Out</span>
    </a>
  );
}
