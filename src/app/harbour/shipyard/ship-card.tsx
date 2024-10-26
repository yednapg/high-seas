import React from "react";
import Link from "next/link";
import {
  createShip,
  createShipUpdate,
  Ship,
  stagedToShipped,
} from "./ship-utils";
import { Button } from "@/components/ui/button";
import JSConfetti from "js-confetti";
import { useEffect, useRef, useState } from "react";
import { Check, ChevronsUpDown } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { getWakaSessions } from "@/app/utils/waka";
import { Checkbox } from "@/components/ui/checkbox";
import { AnimatePresence, motion } from "framer-motion";
import Icon from "@hackclub/icons";

import NoImgDino from "/public/no-img-dino.png";
import {
  Dialog,
  // DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import ShipPillCluster from "../../../components/ui/ship-pill-cluster";

export default function NewUpdateForm({
  ship,
  shipChains,
}: {
  ship: Ship;
  shipChains: Map<string, string[]>;
}) {
  const [open, setOpen] = useState(false);

  if (!ship) return;

  const shipShip = async (e) => {
    e.stopPropagation();
    await stagedToShipped(ship);
    location.reload();
  };

  const exampleShip = ship.id.startsWith("xX_$EXAMPLESHIP$_Xx");

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <div className="relative text-white">
          <img
            src="/faqbkgr.svg"
            alt="banner backing"
            className="w-full h-full absolute -z-10"
          />

          <div className="px-[3vw] w-full h-24 flex flex-col items-start sm:gap-2 sm:flex-row sm:items-center">
            <div className="flex gap-4 items-center">
              <div className="w-16 h-16 relative mb-4 sm:mb-0 sm:mr-4 flex-shrink-0">
                <img
                  src={ship.screenshotUrl}
                  alt={`Screenshot of ${ship.title}`}
                  className="object-cover w-full h-full absolute top-0 left-0 rounded"
                  onError={({ target }: { target: any }) => {
                    target.src = NoImgDino.src;
                  }}
                />
              </div>
              <h2 className="text-xl font-semibold text-left mb-2 sm:hidden block">
                {ship.title}
              </h2>
            </div>
            <div className="flex-grow">
              <h2 className="text-xl font-semibold text-left mb-2 sm:block hidden">
                {ship.title}
              </h2>

              <div className="flex flex-wrap items-start gap-2 text-sm">
                <ShipPillCluster ship={ship} shipChains={shipChains} />
              </div>
            </div>

            {exampleShip ? null : (
              <div className="mt-4 sm:mt-0 sm:ml-auto">
                {ship.shipStatus === "staged" ? (
                  <Button id="ship-ship" onClick={shipShip}>
                    SHIP SHIP!
                  </Button>
                ) : (
                  <NewUpdateForm ship={ship} shipChains={shipChains} />
                )}
              </div>
            )}
          </div>
        </div>
      </DialogTrigger>

      <DialogContent>
        <DialogHeader>
          <DialogTitle>{ship.title}</DialogTitle>
          <DialogDescription>{ship.wakatimeProjectName}</DialogDescription>
        </DialogHeader>

        {/* <form action={handleForm} className="space-y-3">
          <label htmlFor="update_description">Description of the update</label>
          <textarea
            id="update_description"
            name="update_description"
            rows={4}
            cols={50}
            minLength={10}
            required
            className="w-full p-2 border rounded"
          ></textarea>

          <Button type="submit" className="w-full" disabled={submitting}>
            {submitting ? (
              <>
                <Icon glyph="more" />
                Submitting!
              </>
            ) : (
              "Ship update!"
            )}
          </Button>
        </form> */}
      </DialogContent>
    </Dialog>
  );
}
