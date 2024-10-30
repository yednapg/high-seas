'use client'

import { AlertCircle } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import Link from "next/link";
import { useMemo } from "react";
import { reportError } from "./report-error";

export default function SlackAuthErrorPage({
  searchParams,
}: {
  searchParams: { err?: string };
}) {
  const { err } = searchParams;
  useMemo(() => {
    reportError(err)
  }, [])

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#4A154B]">
      <div className="w-fit bg-white p-8 rounded-lg shadow-lg text-center">
        <AlertCircle
          className="mx-auto h-12 w-12 text-red-500 mb-4"
          aria-hidden="true"
        />
        <h1 className="text-2xl font-bold text-gray-900 mb-2">
          Going overboard!
        </h1>
        <p className="text-gray-600 mb-6 text-sm">
          We're over capacity right now, but we got your request to join the crew– we'll reach out once we figure out how to keep this ship from capsizing.
          {err || "An error occurred during Slack authentication."}
        </p>

        <Link className={buttonVariants({ variant: "outline" })} href="/">
          Go home
        </Link>
      </div>
    </div>
  );
}
