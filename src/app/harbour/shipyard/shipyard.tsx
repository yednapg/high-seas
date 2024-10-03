import { LoadingSpinner } from "@/components/ui/loading_spinner";
import Ships from "./ships";

export default function Shipyard({ ships }: any) {
  if (!ships) {
    <LoadingSpinner />;
  } else {
    const pendingVotes = Boolean(
      ships.filter((ship: any) => !ship.voteRequirementMet).length > 0,
    );
    return (
      <div>
        <div className="text-center">
          <h1 className="font-heading text-4xl sm:text-5xl md:text-6xl font-bold text-indigo-600 dark:text-indigo-300 mb-4">
            The Keep
          </h1>
          <p className="text-xl mb-6 inline-block">Submit your ships!</p>
        </div>
        {pendingVotes && (
          <p>
            A recent project is pending until you vote on more matchups in the
            Thunderdome!
          </p>
        )}
        <Ships ships={ships} />



        <div className="m-4 flex flex-col justify-center items-center mt-12">
        <p className="text-2xl mb-8 text-blue-500">
          Here are some example projects others have submitted!
        </p>
        <div className="text-white">
          <div className="mb-2 bg-blue-400 p-4 rounded-lg max-w-xl">
            <p className="text-xl font-bold mb-2">Flip Slash Sprig Game</p>
            <div className="flex flex-row justify-center items-center text-center gap-8">
              <a
                href="https://github.com/kaj07/FLIP-SLASH--sprig-"
                target="_blank"
                rel="noopenner noreferrer"
                className="text-md text-pink-200"
              >
                Project GitHub
              </a>
              <p className="text-md">Hours spent: 8</p>
              <p className="text-md">Scales earned: 421</p>
            </div>
          </div>

          <div className="mb-2 bg-blue-400 p-4 rounded-lg max-w-xl">
            <p className="text-xl font-bold mb-2">
              COTL Music Player
            </p>
            <div className="flex flex-row justify-center items-center text-center gap-8">
              <a
                href="https://github.com/galexy727/cotl-music-player"
                target="_blank"
                rel="noopenner noreferrer"
                className="text-md text-pink-200"
              >
                Project GitHub
              </a>
              <p className="text-md">Hours spent: 5</p>
              <p className="text-md">Scales earned: 428</p>
            </div>
          </div>

          <div className="mb-2 bg-blue-400 p-4 rounded-lg max-w-xl">
            <p className="text-xl font-bold mb-2">
              Skeleton Summoner Game
            </p>
            <div className="flex flex-row justify-center items-center text-center gap-8">
              <a
                href="https://github.com/MONKEYFACE678/Programming-Theory-Repo"
                target="_blank"
                rel="noopenner noreferrer"
                className="text-md text-pink-200"
              >
                Project GitHub
              </a>
              <p className="text-md">Hours spent: 11</p>
              <p className="text-md">Scales earned: 731</p>
            </div>
          </div>

          <div className="mb-2 bg-blue-400 p-4 rounded-lg max-w-xl">
            <p className="text-xl font-bold mb-2">
              Portoise USB Hub
            </p>
            <div className="flex flex-row justify-center items-center text-center gap-8">
              <a
                href="https://github.com/Beenana02/Portoise_USB_Hub"
                target="_blank"
                rel="noopenner noreferrer"
                className="text-md text-pink-200"
              >
                Project GitHub
              </a>
              <p className="text-md">Hours spent: 15</p>
              <p className="text-md">Scales earned: 2121</p>
            </div>
          </div>








        </div>
      </div>
      </div>
    );
  }
}
