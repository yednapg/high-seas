import Image from "next/image";
import { motion } from "framer-motion";
import Signpost from "/public/signpost.png";

export default function SignPost({ wakaToken }: { wakaToken: string | null }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="container mx-auto px-4 py-8 text-center"
    >
      <h1 className="text-3xl font-bold mb-6">Welcome to the signpost</h1>

      <p>
        {typeof wakaToken !== "string"
          ? "Fetching WakaTime token..."
          : `WAZZUP! Your WakaTime token is ${wakaToken}`}
      </p>
    </motion.div>
  );
}
