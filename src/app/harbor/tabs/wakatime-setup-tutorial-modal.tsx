import React, { useEffect, useRef, useState } from "react";
import { Card } from "@/components/ui/card";
import Icon from "@hackclub/icons";
import { AnimatePresence, motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { hasHb } from "./tutorial-utils";
import { buttonVariants } from "../../../components/ui/button";
import {
  handleEmailSubmission,
  markArrpheusReadyToInvite,
} from "../../marketing/marketing-utils";
import JSConfetti from "js-confetti";

type Os = "windows" | "macos" | "linux" | "unknown";
const getInstallCommand = (platform: string, wakaKey: string) => {
  switch (platform) {
    case "windows":
      return {
        label: "Windows PowerShell",
        command: "irm https://wakatime.com/install.ps1 | iex",
        lang: "powershell",
      };
    case "macos":
      return {
        label: "macOS Terminal",
        command: `export BEARER_TOKEN="${wakaKey}" && curl -fsSL https://hack.club/waka-setup.sh | sh`,
        lang: "bash",
      };
    case "linux":
      return {
        label: "Linux Terminal",
        command: `export BEARER_TOKEN="${wakaKey}" && curl -fsSL https://hack.club/waka-setup.sh | sh`,
        lang: "bash",
      };
    default:
      return {
        label: "Unknown Platform",
        command: `export BEARER_TOKEN="${wakaKey}" && curl -fsSL https://hack.club/waka-setup.sh | sh`,
        lang: "bash",
      };
  }
};
const osFromAgent = (): Os => {
  const ua = window.navigator.userAgent.toLowerCase();
  if (ua.includes("win")) {
    return "windows";
  } else if (ua.includes("mac")) {
    return "macos";
  } else if (ua.includes("linux")) {
    return "linux";
  } else {
    return "unknown";
  }
};

export default function WakatimeSetupTutorialModal({
  isOpen,
  setIsOpen,
  email,
  isSubmitting,
  setIsSubmitting,
}: {
  isOpen: boolean;
  setIsOpen: any;
  email: string;
  isSubmitting: boolean;
  setIsSubmitting: any;
}) {
  const [userOs, setUserOS] = useState<Os>("unknown");
  const [showAllPlatforms, setShowAllPlatforms] = useState(false);
  const [hasRecvHb, setHasRecvHb] = useState(false);
  const [wakaKey, setWakaKey] = useState<string | null>(null);
  const [instructions, setInstructions] = useState<any | null>(null);

  const [personRecId, setPersonRecId] = useState<string | null>(null);
  const confettiRef = useRef<JSConfetti | null>(null);

  const triggerConfetti = () => {
    confettiRef.current?.addConfetti({
      emojis: ["🌟", "✨", "💫", "🎉"],
      emojiSize: 50,
      confettiNumber: 50,
    });
  };

  const handleContinueFromModal = async () => {
    // Prevent multiple submissions
    if (isSubmitting) return;
    console.log("running handleContinueFromModal");
    setIsSubmitting(true);

    try {
      if (!personRecId) throw new Error("No person record ID set yet!");

      await markArrpheusReadyToInvite(personRecId);
      triggerConfetti();
    } catch (err) {
      console.error("Error while handling modal continue:", err);
    } finally {
      setIsSubmitting(false);
    }
  };

  useEffect(() => {
    confettiRef.current = new JSConfetti();

    const os = osFromAgent();
    setUserOs(os);
    setShowAllPlatforms(os === "unknown");

    (async () => {
      const { created, apiKey, personRecordId, username } =
        await handleEmailSubmission(email);
      setPersonRecId(personRecordId);
      setWakaKey(apiKey);
      setInstructions(getInstallCommand(userOS, apiKey));

      if (!username) {
        console.error("no username while");
        return;
      }

      while (true) {
        const hasData = await hasHb(username, apiKey);
        if (hasData && !isSubmitting) {
          await handleContinueFromModal();
          setHasRecvHb(true);
          break;
        }

        await new Promise((r) => setTimeout(r, 1_000));
      }
    })();
  }, []);

  const SinglePlatform = ({ os }: { os: Os }) => {
    if (!wakaKey) return;

    const platform = getInstallCommand(os, wakaKey);
    return (
      <div>
        <p className="mb-1 inline-flex items-end gap-2">
          <Icon glyph="terminal" size={26} />
          <span>Install instructions for {platform.label}</span>
        </p>
        <div className="flex flex-col sm:flex-row items-stretch gap-2">
          <pre className="text-sm bg-gray-200 rounded-lg p-5 overflow-x-auto w-full flex-grow relative">
            <span className="absolute left-1.5 top-0.5 text-xs opacity-40 select-none pointer-events-none">
              {platform.lang}
            </span>
            <code>{platform.command}</code>
          </pre>
          <Button
            className="h-full px-8"
            onClick={() => navigator.clipboard.writeText(platform.command)}
          >
            Copy
            <Icon glyph="copy" size={26} />
          </Button>
        </div>
      </div>
    );
  };

  const InstallInstructions = () => (
    <>
      <div>
        <h1 className="text-2xl font-bold mb-4">
          {"You're on your way to sail the seas!"}
        </h1>
        <p className="text-base mb-4">
          In order to get rewarded for your time spent coding, we need to know
          when {"you're"} coding! We will do this with an <i>arrsome</i>{" "}
          extension in your code editor!
        </p>

        {showAllPlatforms ? (
          <div>
            <SinglePlatform os={"windows"} />
            <SinglePlatform os={"macos"} />
            <SinglePlatform os={"linux"} />
            <p onClick={() => setShowAllPlatforms(false)}>nevermind</p>
          </div>
        ) : (
          <>
            <SinglePlatform os={userOs} />
            <p className="text-xs mt-1">
              Not using {userOs}?{" "}
              <span
                onClick={() => setShowAllPlatforms(true)}
                className="underline text-blue-500 cursor-pointer"
              >
                View instructions for all platforms
              </span>
            </p>
          </>
        )}

        <video
          src="/videos/Waka Setup Script.mp4"
          autoPlay
          loop
          playsInline
          className="mt-8 rounded"
        />
      </div>

      <p className="text-center mt-2 text-base">
        Waiting for the setup script to be pasted into your terminal...
        <br />
        <br />
        <Button
          className={`${buttonVariants({ variant: "outline" })}`}
          disabled={isSubmitting}
          onClick={async () => {
            await handleContinueFromModal();
            setHasRecvHb(true);
          }}
        >
          or, skip for now
        </Button>
      </p>
    </>
  );

  const CheckUrEmail = () => {
    return (
      <div>
        <p className="text-3xl mb-2">Check your email!</p>
        <p>You should see an invite to the Hack Club Slack.</p>

        <img
          src="/party-orpheus.svg"
          alt="a partying dinosaur"
          className="mt-8 mx-auto w-1/2"
        />

        <Button onClick={() => setIsOpen(false)} className="float-end">
          Dismiss
        </Button>
      </div>
    );
  };

  return (
    <AnimatePresence>
      {isOpen ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
        >
          <Card
            className="relative w-full max-w-2xl max-h-[80vh] overflow-y-auto text-left p-4"
            onClick={(e) => e.stopPropagation()}
          >
            {hasRecvHb ? <CheckUrEmail /> : <InstallInstructions />}
          </Card>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}
