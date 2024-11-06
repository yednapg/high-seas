// Import necessary modules and components
import Link from "next/link";
import { createShip, createShipUpdate } from "./ship-utils";
import type { Ship } from "@/app/utils/data";
import { Button } from "@/components/ui/button";
import JSConfetti from "js-confetti";
import { useCallback, useEffect, useRef, useState } from "react";
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
import { AnimatePresence, motion } from "framer-motion";
import Icon from "@hackclub/icons";

export default function NewUpdateForm({
  shipToUpdate,
  canvasRef,
  closeForm,
  session,
}: {
  shipToUpdate: Ship;
  canvasRef: any;
  closeForm: any;
  session: any;
}) {
  const [staging, setStaging] = useState(false);
  const confettiRef = useRef<JSConfetti | null>(null);
  const [projectHours, setProjectHours] = useState<number>(0);

  // Initialize confetti on mount
  useEffect(() => {
    confettiRef.current = new JSConfetti({ canvas: canvasRef.current });
  }, [canvasRef.current]);

  // Fetch projects from the API using the Slack ID
  const fetchWakaSessions = useCallback(async (scope = undefined) => {
    try {
      return await getWakaSessions(scope);
    } catch (error) {
      console.error("Error fetching Waka sessions:", error);
      return null;
    }
  }, []);

  const calculateCreditedTime = useCallback(
    (
      projects: {
        key: string;
        total: number;
      }[]
    ): number => {
      const project = projects.find((p) =>
        (shipToUpdate.wakatimeProjectNames || []).includes(p.key)
      );

      if (!project) return 0;

      const creditedTime =
        project.total / 3600 - (shipToUpdate.total_hours || 0);
      return Math.round(creditedTime * 1000) / 1000;
    },
    [shipToUpdate]
  );

  useEffect(() => {
    async function fetchAndSetProjectHours() {
      const res = await fetchWakaSessions();

      if (res && shipToUpdate.total_hours) {
        let creditedTime = calculateCreditedTime(res.projects);

        if (creditedTime < 0) {
          const anyScopeRes = await fetchWakaSessions("any");
          if (anyScopeRes) {
            creditedTime = calculateCreditedTime(anyScopeRes.projects);
          }
        }

        setProjectHours(creditedTime);
        console.log("Project hours:", creditedTime);
      }
    }

    fetchAndSetProjectHours();
  }, [fetchWakaSessions, calculateCreditedTime, shipToUpdate]);

  const handleForm = async (formData: FormData) => {
    setStaging(true);
    // // Append the selected project's hours to the form data
    // if (selectedProject) {
    //   formData.append("hours", selectedProject.key.toString());
    // }

    await createShipUpdate(shipToUpdate.id, projectHours, formData);
    confettiRef.current?.addConfetti();
    closeForm();
    setStaging(false);
  };

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-2">
        Ship an update to {shipToUpdate.title}
      </h1>

      <p className="mb-2">
        You are adding {projectHours} hours of work to this project
      </p>

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
        />

        <Button type="submit" className="w-full" disabled={staging}>
          {staging ? (
            <>
              <Icon glyph="more" />
              Staging!
            </>
          ) : (
            "Stage my Ship!"
          )}
        </Button>
      </form>
    </div>
  );
}
