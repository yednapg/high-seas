import { motion } from "framer-motion";

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

      <div className="gap-8 m-4">
        <p className="text-2xl">Key locations:</p>
        <p>{"The Keep: submit projects here when they're done!"}</p>
        <p>
          Thunderdome: vote between projects others have made! After submitting
          your project, you must vote here in order to earn Scales.
        </p>
        <p>
          Shoppe: spend all your scales here! Get items, ranging from Blahajs to
          Yubikeys.
        </p>
      </div>
    </motion.div>
  );
}
