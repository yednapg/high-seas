import { LoadingSpinner } from "@/components/ui/loading_spinner";
import Ships from "./ships";

export default function Shipyard({ ships }: any) {
  if (!ships) {
    <LoadingSpinner />
  } else {
    const pendingVotes = Boolean(ships.filter((ship: any) => !ship.voteRequirementMet).length > 0);
    return (
      <div>
        <div className="text-center">
          <h1 className="font-heading text-4xl sm:text-5xl md:text-6xl font-bold text-indigo-600 dark:text-indigo-300 mb-4">
            The Keep
          </h1>
          <p className="text-xl animate-pulse mb-6 inline-block">Submit your ships!</p>
        </div>
        {pendingVotes && (
          <p>A recent project is pending until you vote on more matchups in the Thunderdome!</p>
        )}
        <Ships ships={ships} />
      </div>
    );
  }
}
