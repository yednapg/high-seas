"use client";

import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import Verification from "./verification";
import Platforms from "@/app/utils/wakatime-setup/platforms";
import JaggedCard from "../../../components/jagged-card";
import Cookies from "js-cookie";
import FeedItems from "./feed-items";

export default function Signpost() {
  let wakaKey: string | null = null;
  let hasHb: boolean | null = null;
  const wakaCookie = Cookies.get("waka");
  if (wakaCookie) {
    try {
      const parsedCookie = JSON.parse(wakaCookie);
      if (Object.hasOwn(parsedCookie, "key")) {
        wakaKey = parsedCookie.key;
      } else {
        throw new Error(
          "The parsed waka cookie has no key 'key' (the waka api key)",
        );
      }

      if (Object.hasOwn(parsedCookie, "hasHb")) {
        hasHb = parsedCookie.hasHb;
      } else {
        throw new Error("The parsed waka cookie has no key 'hasHb'");
      }
    } catch (e) {
      console.error("Couldn't JSON parse the waka cookie: ", e);
    }
  }

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      <h1 className="font-heading text-5xl font-bold text-white mb-6 text-center">
        The Signpost
      </h1>

      <Verification />

      <JaggedCard className="text-white" shadow={false}>
        {wakaKey ? (
          <Platforms wakaKey={wakaKey} />
        ) : (
          <p>Loading Hakatime token...</p>
        )}
      </JaggedCard>

      <p className="mt-4 text-center text-white">
        Have questions? Need help? Reach out to us in{" "}
        <Link
          className="text-blue-500"
          href="https://hackclub.slack.com/archives/C07PZNMBPBN"
        >
          #high-seas-help
        </Link>
        !
      </p>

      <h2 className="mt-12 font-heading text-2xl font-bold text-white mb-4 text-center">
        What's happening?
      </h2>
      <FeedItems />
    </motion.div>
  );
}
