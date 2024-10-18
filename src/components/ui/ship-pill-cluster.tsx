import type { Ship } from "@/app/harbour/shipyard/ship-utils";
import Pill from "./pill";

import ScalesImage from "/public/scales.svg";
import Image from "next/image";

export default function ShipPillCluster({ ship }: { ship: Ship }) {
  return (
    <>
      <Pill msg={`${ship.hours ?? 0} hr`} glyph="clock" />

      {ship.shipStatus === "shipped" &&
        (ship.voteRequirementMet ? (
          ship.doubloonPayout ? (
            <Pill
              msg={`${ship.doubloonPayout} Scales`}
              color="green"
              glyphImage={<Image src={ScalesImage} alt="scales" height={20} />}
            />
          ) : (
            <Pill
              msg={"Pending: hang tight- we're counting the votes!"}
              color="blue"
              glyph="event-add"
            />
          )
        ) : (
          <Pill msg={"Pending: Vote to unlock"} color="blue" glyph="enter" />
        ))}

      {ship.shipType === "update" ? (
        <Pill
          msg={"Ship update"}
          color="purple"
          glyph="reply"
          glyphStyles={{ transform: "scaleX(-1)" }}
        />
      ) : null}
    </>
  );
}
