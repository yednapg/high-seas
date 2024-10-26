// Import necessary modules and components
import Link from "next/link";
import { createShip, createShipUpdate, Ship } from "./ship-utils";
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

export default function NewUpdateForm({
  shipToUpdate,
  canvasRef,
}: {
  shipToUpdate: Ship;
  canvasRef: any;
}) {
  const [open, setOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const confettiRef = useRef<JSConfetti | null>(null);

  useEffect(() => {
    confettiRef.current = new JSConfetti({ canvas: canvasRef.current });
  }, [canvasRef.current]);

  // Fetch projects from the API using the Slack ID
  // useEffect(() => {
  //   async function fetchProjects() {
  //     try {
  //       const slackId = session.payload.sub;
  //       const res = await getWakaSessions();
  //       const shippedShips = ships
  //         .filter((s) => s.shipStatus !== "deleted")
  //         .map((s) => s.wakatimeProjectName)
  //         .filter((n) => n);
  //       setProjects(
  //         res.projects.filter(
  //           (p) => p.key != "<<LAST_PROJECT>>" && !shippedShips.includes(p.key),
  //         ),
  //       );

  //       console.log(res);
  //     } catch (error) {
  //       console.error("Error fetching projects:", error);
  //     }
  //   }
  //   fetchProjects();
  // }, [session.payload.sub]);

  const handleForm = async (formData: FormData) => {
    setSubmitting(true);
    // // Append the selected project's hours to the form data
    // if (selectedProject) {
    //   formData.append("hours", selectedProject.key.toString());
    // }

    confettiRef.current?.addConfetti();
    await createShipUpdate(shipToUpdate.id, formData);

    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="primary" onClick={(e) => e.stopPropagation()}>
          Ship an update
        </Button>
      </DialogTrigger>

      <DialogContent>
        <DialogHeader>
          <DialogTitle> Ship an update to {shipToUpdate.title}</DialogTitle>
        </DialogHeader>

        <form action={handleForm} className="space-y-3">
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
        </form>
      </DialogContent>
    </Dialog>
  );
}
