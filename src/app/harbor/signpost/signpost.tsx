"use client";

import { motion } from "framer-motion";
import React, { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { getSelfPerson, getSignpostUpdates } from "../../utils/airtable";
import Verification from "./verification";
import useLocalStorageState from "../../../../lib/useLocalStorageState";
import Platforms from "@/app/utils/wakatime-setup/platforms";
import JaggedCard from "../../../components/jagged-card";
import { fetchWaka, SignpostFeedItem } from "@/app/utils/data";
import { getWakaSessions } from "@/app/utils/waka";
export default function SignPost({ session }: { session: any }) {
  const [wakaKey, setWakaKey] = useLocalStorageState("cache.wakaKey", "");
  const [trackedHours, setTrackedHours] = useState<number>();
  const motionProps = useMemo(
    () => ({
      initial: { opacity: 0 },
      animate: { opacity: 1 },
    }),
    [],
  );

  const [verification, setVerification] = useLocalStorageState(
    "cache.verification",
    "Eligible L1",
  );
  const [reason, setReason] = useLocalStorageState("cache.reason", "");
  const [signpostUpdates, setSignpostUpdates] = useLocalStorageState<SignpostFeedItem[]>("cache.signpost", []);
  const [lastSignpostUpdate, setLastSignpostUpdate] = useLocalStorageState("cache.lastSignpostUpdate", new Date(0));

  useEffect(() => {
    fetchWaka().then(({ key }) => setWakaKey(key));
    const initHours = async () => {
      const sessions = await getWakaSessions();
      const totalSeconds = sessions.projects.reduce((acc, project) => acc + project.total, 0);
      const totalHours = totalSeconds / 3600;
      setTrackedHours(totalHours);
    };
    initHours();

    if ((new Date()).getTime() - lastSignpostUpdate > 1000 * 60 * 15) {
      getSignpostUpdates().then((data) => {
        setSignpostUpdates(data)
        setLastSignpostUpdate(new Date())
      });
    }

    if (session?.slackId) {
      getSelfPerson(session.slackId).then((data) => {
        setVerification(
          data?.["fields"]?.["verification_status"]?.[0]?.toString() || "",
        );
        setReason(data?.["fields"]?.["Rejection Reason"] || "");
      });
    }
  }, [session.slackId]);

  return (
    <motion.div
      {...motionProps}
      className="container mx-auto px-4 py-8 max-w-prose"
    >
      <h1 className="font-heading text-5xl font-bold text-white mb-2 text-center">
        The Signpost
      </h1>
      
      <div className="flex justify-center my-6">
        <div className="flex items-center gap-1 text-white bg-opacity-20 bg-white px-4 py-2 rounded-lg border border-white/20 backdrop-blur-sm">
          <span className="text-xs">⏱️</span>
          <span className="font-medium">{trackedHours?.toFixed(1) || "-"}</span>
          <span className="sm:inline">hours logged in Hackatime</span>
        </div>
      </div>

      <Verification status={verification} reason={reason} />

      {signpostUpdates
      ? signpostUpdates.map(
        (update: any, index: number) =>
          update?.["fields"]?.["visible"] && (
          <JaggedCard
            key={index}
            className={`text-[${update?.["fields"]?.["text_color"]}}]`}
            bgColor={update?.["fields"]?.["background_color"]}
          >
            <span className="text-bold text-xl">{update?.["fields"]?.["title"]}</span>
            <p>{update?.["fields"]?.["content"]}</p>
          </JaggedCard>
          ),
        )
      : null}

      <JaggedCard className="text-white">
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
    </motion.div>
  );
}
