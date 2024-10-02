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
    </motion.div>
  );
}
