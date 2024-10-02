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

      <div className="m-4 text-white">
        <p className="text-2xl mb-8 text-blue-500">Key locations:</p>
        <div>
                  <p className="mb-2 bg-blue-400 p-2 rounded-lg max-w-xl">{"The Keep: submit projects here when they're done!"}</p>
        <p className="mb-2 bg-blue-400 p-2 rounded-lg max-w-xl">
          Thunderdome: vote between projects others have made! After submitting
          your project, you must vote here in order to earn Scales.
        </p>
        <p className="mb-2 bg-blue-400 p-2 rounded-lg max-w-xl">
          Shoppe: spend all your scales here! Get items, ranging from Blahajs to
          Yubikeys.
        </p>
        </div>

      </div>
    </motion.div>
  );
}
