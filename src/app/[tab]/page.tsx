"use client";

import { redirect, notFound } from "next/navigation";
import Harbour from "../harbour/tabs/tabs";
import { createMagicSession, getSession, verifySession } from "../utils/auth";
import { Card } from "@/components/ui/card";
import { SoundButton } from "../../components/sound-button.js";
import { useEffect, useState } from "react";

export default function Page({
  params,
  searchParams,
}: {
  params: { tab: string };
  searchParams: any;
}) {
  const [session, setSession] = useState(null);

  const { tab } = params;
  const validTabs = ["signpost", "the-keep", "thunderdome", "shop"];
  if (!validTabs.includes(tab)) return notFound();

  const { magic_auth_token } = searchParams;

  if (magic_auth_token) {
    console.info("maigc auth token:", magic_auth_token);
    // First check for is_full_user, if so, redirect to slack auth
    // const person =

    createMagicSession(magic_auth_token).then(
      () => (window.location.href = window.location.pathname),
    );
  }

  useEffect(() => {
    getSession().then((s) => setSession(s));
  }, []);

  if (!session) return <div>Loading session...</div>;

  return (
    <>
      <div
        className="fixed inset-0 z-[-1]"
        style={{
          backgroundImage: "url(/bg.svg)",
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      />
      <div className="w-full min-h-screen pt-14 flex items-start justify-center p-8">
        <SoundButton />
        <Card className="w-full max-w-4xl flex flex-col" type={"cardboard"}>
          <Harbour session={session} currentTab={tab} />
        </Card>
      </div>
    </>
  );
}
