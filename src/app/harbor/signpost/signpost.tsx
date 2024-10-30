"use client";

import { motion } from "framer-motion";
import React, { useEffect, useMemo } from "react";
import Link from "next/link";
import { getSelfPerson, getSignpostUpdates } from "../../utils/airtable";
import Verification from "./verification";
import useLocalStorageState from "../../../../lib/useLocalStorageState";
import Platforms from "@/app/utils/wakatime-setup/platforms";
import JaggedCard from "../../../components/jagged-card";
import { fetchSignpostFeed, fetchWaka, SignpostFeedItem } from "@/app/utils/data";

export default function SignPost({ session }: { session: any }) {
  const [wakaKey, setWakaKey] = useLocalStorageState("cache.wakaKey", "");
  const motionProps = useMemo(
    () => ({
      initial: { opacity: 0 },
      animate: { opacity: 1 },
    }),
    [],
  );

  const [verification, setVerification] = useLocalStorageState(
    "cache.verification",
    "",
  );
  const [reason, setReason] = useLocalStorageState("cache.reason", "");
  const [signpostUpdates, setSignpostUpdates] = useLocalStorageState<SignpostFeedItem[]>("cache.signpost", []);

  useEffect(() => {
    fetchWaka().then(({ key }) => setWakaKey(key));

    getSignpostUpdates().then((data) => {setSignpostUpdates(data)});

    getSelfPerson(session.slackId).then((data) => {
      setVerification(
        data?.["fields"]?.["verification_status"]?.[0]?.toString() || "",
      );
      setReason(data?.["fields"]?.["Rejection Reason"] || "");
    });
  }, [session.slackId]);

  return (
    <motion.div
      {...motionProps}
      className="container mx-auto px-4 py-8 max-w-prose"
    >
      <h1 className="font-heading text-5xl font-bold text-white mb-6 text-center">
        The Signpost
      </h1>
      <Verification status={verification} reason={reason} />

      {signpostUpdates
        ? signpostUpdates.map(
            (update: any, index: number) =>
              update.visible && (
                <JaggedCard
                  key={index}
                  className={`text-[${update.textColor}]`}
                  bgColor={update.backgroundColor}
                >
                  <span className="text-bold">{update.title}</span>
                  <p>{update.content}</p>
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
