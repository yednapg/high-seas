import { getWakaSessions } from "@/app/utils/waka";
import { hasRecvFirstHeartbeat } from "../../utils/waka";
import { motion } from "framer-motion";
import { wakaSessions } from "./help";
import { useEffect } from "react";

export default function SignPost({ wakaToken }: { wakaToken: string | null }) {
  useEffect(() => {
    hasRecvFirstHeartbeat().then(console.log);
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="container mx-auto px-4 py-8 text-center"
    >
      <h1 className="font-heading text-4xl sm:text-5xl md:text-6xl font-bold text-indigo-600 dark:text-indigo-300 mb-4">
        Welcome to the signpost
      </h1>

      <p>
        {typeof wakaToken !== "string"
          ? "Fetching WakaTime token..."
          : `WAZZUP! Your WakaTime token is ${wakaToken}`}
      </p>

      <div className="m-4 max-w-xl text-white">
        <p className="text-2xl mb-8">Key locations:</p>
        <p className="mb-2 bg-blue-400 p-2 rounded-lg">{"The Keep: submit projects here when they're done!"}</p>
        <p className="mb-2 bg-blue-400 p-2 rounded-lg">
          Thunderdome: vote between projects others have made! After submitting
          your project, you must vote here in order to earn Scales.
        </p>
        <p className="mb-2 bg-blue-400 p-2 rounded-lg">
          Shoppe: spend all your scales here! Get items, ranging from Blahajs to
          Yubikeys.
        </p>
      </div>
    </motion.div>
  );
}
