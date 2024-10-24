import { Card } from "@/components/ui/card";
import Icon from "@hackclub/icons";
import { AnimatePresence, motion } from "framer-motion";
import useLocalStorageState from "../../../../lib/useLocalStorageState";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";

export default function WakatimeSetupTutorialModal({
  isOpen,
  setIsOpen,
  wakaKey,
}: {
  isOpen: any;
  setIsOpen: any;
  wakaKey: string;
}) {
  const [userOS, setUserOS] = useState<
    "windows" | "macos" | "linux" | "unknown"
  >("unknown");
  const [isCopied, setIsCopied] = useState(false);
  const [showAllPlatforms, setShowAllPlatforms] = useState(false);

  const { toast } = useToast();

  useEffect(() => {
    const ua = window.navigator.userAgent.toLowerCase();
    if (ua.includes("win")) {
      setUserOS("windows");
    } else if (ua.includes("mac")) {
      setUserOS("macos");
    } else if (ua.includes("linux")) {
      setUserOS("linux");
    }
  }, []);

  const getInstallCommand = (platform: string) => {
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
        setShowAllPlatforms(true);
    }
  };

  const installInfo = getInstallCommand(userOS);

  const handleCommandCopy = (plat: any) => {
    navigator.clipboard.writeText(plat.command);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2_500);
    toast({
      title: "Copied WakaTime setup script",
      description: "Now go and paste it in your terminal!",
    });
  };

  const SinglePlatform = ({ platform }: { platform: any }) => {
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
            onClick={() => handleCommandCopy(platform)}
          >
            {isCopied ? "Copied" : "Copy"}
            <Icon glyph={isCopied ? "copy-check" : "copy"} size={26} />
          </Button>
        </div>
      </div>
    );
  };

  return (
    <AnimatePresence>
      {isOpen && wakaKey && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
          onClick={() => setIsOpen(false)}
        >
          <Card
            className="relative w-full max-w-2xl max-h-[80vh] overflow-y-auto text-left"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-4">
              <h1 className="text-2xl font-bold mb-4">
                {"You're on your way to sail the seas!"}
              </h1>
              <p className="text-base mb-4">
                In order to get rewarded for your time spent coding, we need to
                know when {"you're"} coding! We will do this with an{" "}
                <i>arrsome</i> extension in your code editor!
              </p>

              {showAllPlatforms ? (
                <div>
                  <SinglePlatform platform={getInstallCommand("windows")} />
                  <SinglePlatform platform={getInstallCommand("macos")} />
                  <SinglePlatform platform={getInstallCommand("linux")} />
                  <p onClick={() => setShowAllPlatforms(false)}>nevermind</p>
                </div>
              ) : (
                <>
                  <SinglePlatform platform={installInfo} />
                  <p className="text-xs mt-1">
                    Not using {installInfo?.label}?{" "}
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
                className="mt-8 rounded"
              />
            </div>

            <motion.button
              className="absolute top-2 right-2 p-1 rounded-full bg-white shadow-md z-20"
              onClick={() => setIsOpen(false)}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              <Icon glyph="view-close" />
            </motion.button>
          </Card>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
