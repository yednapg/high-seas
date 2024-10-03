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

      <div className="m-4 flex flex-col justify-center items-center mb-8">
        <p className="text-2xl mb-6 text-blue-500">Key locations:</p>
        <div className="text-white">
          <div className="mb-2 bg-blue-400 p-4 rounded-lg max-w-xl">
            <p className="text-2xl mb-2">The Keep</p>
            <p>Submit your projects here when they're done!</p>
          </div>
          <div className="mb-2 bg-blue-400 p-4 rounded-lg max-w-xl">
            <p className="text-2xl mb-2">Thunderdome</p>
            <p>Vote between projects others have made! After submitting
            your project, you must vote between project matchups in order to earn Scales. Note that the number of Scales you earn is based on the number of hours you've put in your own project, and how it competes against other projects. Everything is peer voted!</p>
          </div>
          <div className="mb-2 bg-blue-400 p-4 rounded-lg max-w-xl">
            <p className="text-2xl mb-2">Shoppe</p>
            <p>Spend all your scales here! Get items, ranging from Blahajs to
            Yubikeys. More items to come in the future!</p>
          </div>
        </div>
      </div>

      <div className="m-4 flex flex-col justify-center items-center">
        <p className="text-2xl mb-6 text-blue-500">Here are some example projects others have submitted!</p>
        <div className="text-white">

          <div className="mb-2 bg-blue-400 p-4 px-8 rounded-lg max-w-[36rem]">
            <p className="text-xl font-bold mb-2">Flip Slash Sprig Game</p>
            <div className="flex flex-row justify-center items-center text-center gap-8">
              <a href="https://github.com/kaj07/FLIP-SLASH--sprig-" target="_blank" rel="noopenner noreferrer" className="text-md text-pink-200">Project GitHub</a>
              <p className="text-md">Hours spent: 8</p>
              <p className="text-md">Scales earned: 4217</p>
            </div>

          </div>

          <div className="mb-2 bg-blue-400 p-4 px-8 rounded-lg max-w-[36rem]">
            <p className="text-xl font-bold mb-2">FRC Robotics Simulation Game</p>
            <div className="flex flex-row justify-center items-center text-center gap-8">
              <a href="https://github.com/Brainiac11/sim_game" target="_blank" rel="noopenner noreferrer" className="text-md text-pink-200">Project GitHub</a>
              <p className="text-md">Hours spent: 138</p>
              <p className="text-md">Scales earned: 207493</p>
            </div>
            
          </div>

        </div>
      </div>


    </motion.div>
  );
}
