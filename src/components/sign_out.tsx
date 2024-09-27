"use client";
import { Button } from "@/components/ui/button";
import { create } from "./actions";

export default function SignOut() {
  return <Button onClick={() => create()}>Sign out of Slack</Button>;
}
