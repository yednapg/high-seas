import React, { useState, useEffect } from "react";
import {
  SinglePlatform,
  osFromAgent,
  type Os,
} from "@/app/utils/wakatime-setup/tutorial-utils.client";
import { AnimatePresence, motion } from "framer-motion";

export default function Platforms({ wakaKey }: { wakaKey: string }) {
  const [showAllPlatforms, setShowAllPlatforms] = useState(false);
  const [userOs, setUserOs] = useState<Os>("unknown");

  useEffect(() => {
    const os = osFromAgent();
    setUserOs(os);
    setShowAllPlatforms(os === "unknown");
  }, []);

  return (
    <AnimatePresence mode="wait">
      {showAllPlatforms ? (
        <motion.div
          key={0}
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: "fit-content", opacity: 1 }}
          exit={{ height: 0, opacity: 0 }}
        >
          <SinglePlatform os={"windows"} wakaKey={wakaKey} />
          <SinglePlatform os={"macos"} wakaKey={wakaKey} />
          <SinglePlatform os={"linux"} wakaKey={wakaKey} />
          <hr />
          <p>
            Script not working? High Seas is wakatime-compatible and you can
            configure wakatime plugins using the following:
          </p>
          <code className="block bg-gray-800 p-2 rounded-md mt-2">
            <pre>
              {`# ~/.wakatime.cfg

[settings]
api_url = https://waka.hackclub.com/api
api_key = ${wakaKey}`}
            </pre>
          </code>
          {/* biome-ignore lint/a11y/useKeyWithClickEvents: <explanation> */}
          <p
            className="text-xs mt-1 underline cursor-pointer"
            onClick={() => setShowAllPlatforms(false)}
          >
            Nevermind
          </p>
        </motion.div>
      ) : (
        <motion.div
          key={1}
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: "fit-content", opacity: 1 }}
          exit={{ height: 0, opacity: 0 }}
        >
          <SinglePlatform os={userOs} wakaKey={wakaKey} />
          <p>
            In case you are worried about us installing malware on your computer
            (and rightly so! you should never trust a random script someone
            tells you to run) rest assured that the script{" "}
            <b className="font-black italic">does not</b> need admin permission
            and you can view exactly what the script does via the source link
            above :)
          </p>
          <video
            src={
              userOs === "windows"
                ? "/videos/WakaSetupScriptWindows.mp4"
                : userOs === "macos"
                ? "/videos/WakaSetupScriptMacOS.mp4"
                : "/videos/WakaSetupScriptLinux.mp4"
            }
            autoPlay={true}
            muted={true}
            loop
            playsInline
            className="mt-8 rounded shadow"
          />
          <p className="text-xs mt-1">
            Not using {userOs}?{" "}
            {/* biome-ignore lint/a11y/useKeyWithClickEvents: <explanation> */}
            <span
              className="underline cursor-pointer"
              onClick={() => setShowAllPlatforms(true)}
            >
              View instructions for all platforms
            </span>
          </p>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
