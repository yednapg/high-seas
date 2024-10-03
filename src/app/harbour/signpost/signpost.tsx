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

      <div className="m-4 flex flex-col justify-center items-center">
        <p className="text-2xl mb-8 text-blue-500">Key locations:</p>
        <div className="text-white">
          <p className="mb-2 bg-blue-400 p-2 rounded-lg max-w-xl">
            {"The Keep: submit projects here when they're done!"}
          </p>
          <p className="mb-2 bg-blue-400 p-2 rounded-lg max-w-xl">
            Thunderdome: vote between projects others have made! After
            submitting your project, you must vote between project matchups in
            order to earn Scales. Note that the number of Scales you earn is
            based on the number of hours {"you've"} put in your own project, and
            how it competes against other projects. Everything is peer voted!
          </p>
          <p className="mb-2 bg-blue-400 p-2 rounded-lg max-w-xl">
            Shoppe: spend all your scales here! Get items, ranging from Blahajs
            to Yubikeys. More items to come in the future!
          </p>
        </div>
      </div>

      <div className="m-4 flex flex-col justify-center items-center">
        <p className="text-2xl mb-8 text-blue-500">
          Here are some example projects others have submitted!
        </p>
        <div className="text-white">
          <div className="mb-2 bg-blue-400 p-2 rounded-lg max-w-xl">
            <p className="text-xl font-bold">Flip Slash Sprig Game</p>
            <div className="flex flex-row gap-8">
              <a
                href="https://github.com/kaj07/FLIP-SLASH--sprig-"
                target="_blank"
                rel="noopenner noreferrer"
                className="text-md text-pink-200"
              >
                Project GitHub
              </a>
              <p className="text-md">Hours spent: 8</p>
              <p className="text-md">Scales earned: 4217</p>
            </div>
          </div>

          <div className="mb-2 bg-blue-400 p-2 rounded-lg max-w-xl">
            <p className="text-xl font-bold">FRC Robotics Simulation Game</p>
            <div className="flex flex-row gap-8">
              <a
                href="https://github.com/Brainiac11/sim_game"
                target="_blank"
                rel="noopenner noreferrer"
                className="text-md text-pink-200"
              >
                Project GitHub
              </a>
              <p className="text-md">Hours spent: 138</p>
              <p className="text-md">Scales earned: 207493</p>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
