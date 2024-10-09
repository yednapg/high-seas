import { LoadingSpinner } from "@/components/ui/loading_spinner";
import Ships from "./ships";
import type { Ship } from "./ship-utils";

const exampleShips: Ship[] = [
  {
    id: "example_ship_1",
    title: "Flip Slash Sprig Game",
    repoUrl: "https://github.com/kaj07/FLIP-SLASH--sprig-",
    deploymentUrl: "https://sprig.hackclub.com/share/FNUdELr7n4CvmavQAr8d",
    screenshotUrl:
      "https://cloud-hkx2soawz-hack-club-bot.vercel.app/0image.png",
    readmeUrl:
      "https://raw.githubusercontent.com/kaj07/FLIP-SLASH--sprig-/refs/heads/main/README.md",
    hours: 8,
    voteRequirementMet: true,
    doubloonPayout: 421,
  },
  {
    id: "example_ship_2",
    title: "COTL Music Player",
    repoUrl: "https://github.com/galexy727/cotl-music-player",
    deploymentUrl:
      "https://github.com/GalexY727/cotl-music-player/releases/tag/V1.0",
    screenshotUrl:
      "https://cloud-pfbh20k1i-hack-club-bot.vercel.app/0image.png",
    readmeUrl:
      "https://github.com/GalexY727/cotl-music-player/blob/main/README.md",
    hours: 5,
    voteRequirementMet: true,
    doubloonPayout: 428,
  },
  {
    id: "example_ship_3",
    title: "Portoise USB Hub",
    repoUrl: "https://github.com/Beenana02/Portoise_USB_Hub",
    deploymentUrl: "",
    screenshotUrl:
      "https://cloud-ma98mn299-hack-club-bot.vercel.app/0image.png",
    readmeUrl:
      "https://github.com/Beenana02/Portoise_USB_Hub/blob/main/README.md",
    hours: 15,
    voteRequirementMet: true,
    doubloonPayout: 2121,
  },
  {
    id: "example_ship_4",
    title: "Skeleton Summoner Game",
    repoUrl: "https://github.com/MONKEYFACE678/Programming-Theory-Repo",
    deploymentUrl: "",
    screenshotUrl:
      "https://cloud-j29zpdbig-hack-club-bot.vercel.app/0image.png",
    readmeUrl:
      "https://github.com/MONKEYFACE678/Programming-Theory-Repo/blob/main/ReadMe.txt",
    hours: 11,
    voteRequirementMet: true,
    doubloonPayout: 731,
  },
];

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

          <Ships ships={exampleShips} />
        </div>
      </div>
    );
  }
}
