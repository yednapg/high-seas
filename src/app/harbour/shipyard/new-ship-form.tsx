// Import necessary modules and components
import Link from "next/link";
import { createShip } from "./ship-utils";
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

export default function NewShipForm({
  canvasRef,
  closeForm,
  session,
}: {
  canvasRef: any;
  closeForm: any;
  session: any;
}) {
  const confettiRef = useRef<JSConfetti | null>(null);
  const [projects, setProjects] = useState<{ key: string; total: number }[]>(
    [],
  );
  const [selectedProject, setSelectedProject] = useState<{
    key: string;
    total: number;
  } | null>(null);
  const [open, setOpen] = useState(false);

  // Initialize confetti on mount
  useEffect(() => {
    confettiRef.current = new JSConfetti({ canvas: canvasRef.current });
  }, [canvasRef.current]);

  // Fetch projects from the API using the Slack ID
  useEffect(() => {
    async function fetchProjects() {
      try {
        const slackId = session.payload.sub;
        const res = await getWakaSessions();
        setProjects(res.projects);

        console.log(res);
      } catch (error) {
        console.error("Error fetching projects:", error);
      }
    }
    fetchProjects();
  }, [session.payload.sub]);

  const handleForm = (formData: FormData) => {
    // Append the selected project's hours to the form data
    if (selectedProject) {
      formData.append("hours", selectedProject.key.toString());
    }
    createShip(formData);
    confettiRef.current?.addConfetti();
    closeForm();
    alert(
      "Great! Now that you've submitted a project. Now, go to the battles tab and vote on 10 projects.",
    );
  };

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">New Ship</h1>
      <form action={handleForm} className="space-y-3">
        <div>
          {/* Title Input */}
          <label htmlFor="title">Title</label>
          <input
            type="text"
            id="title"
            name="title"
            required
            className="w-full p-2 border rounded"
          />
        </div>

        {/* Project Dropdown */}
        <div>
          <label htmlFor="project">Select Project</label>
          <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                role="combobox"
                aria-expanded={open}
                className="w-full justify-between"
              >
                {selectedProject
                  ? `${selectedProject.key} (${(selectedProject.total / 60 / 60).toFixed(1)} hrs)`
                  : "Select project..."}
                <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-full p-0">
              <Command>
                <CommandInput placeholder="Search projects..." />
                <CommandList>
                  <CommandEmpty>No WakaTime projects found 😭</CommandEmpty>
                  <CommandGroup>
                    {projects.map((project) => (
                      <CommandItem
                        key={project.key}
                        value={(project.total / 60 / 60).toFixed(2)}
                        onSelect={() => {
                          setSelectedProject(project);
                          setOpen(false);
                        }}
                      >
                        <Check
                          className={cn(
                            "mr-2 h-4 w-4",
                            selectedProject &&
                              selectedProject.key === project.key
                              ? "opacity-100"
                              : "opacity-0",
                          )}
                        />
                        {project.key} ({(project.total / 60 / 60).toFixed(1)}{" "}
                        hrs)
                      </CommandItem>
                    ))}
                  </CommandGroup>
                </CommandList>
              </Command>
            </PopoverContent>
          </Popover>
          {/* Hidden input to include in formData */}
          {selectedProject && (
            <input
              type="hidden"
              name="hours"
              value={(selectedProject.total / 60 / 60).toFixed(2)}
            />
          )}
        </div>

        {/* Other form fields */}
        <div>
          <label htmlFor="repo_url">Repo URL</label>
          <input
            type="url"
            id="repo_url"
            name="repo_url"
            required
            className="w-full p-2 border rounded"
          />
        </div>

        <div>
          <label htmlFor="readme_url">README URL</label>
          <input
            type="url"
            id="readme_url"
            name="readme_url"
            required
            className="w-full p-2 border rounded"
          />
        </div>

        <div>
          <label htmlFor="deployment_url">Deployment URL</label>
          <input
            type="url"
            id="deployment_url"
            name="deployment_url"
            required
            className="w-full p-2 border rounded"
          />
        </div>

        <div>
          <label htmlFor="screenshot_url">
            Screenshot URL
            <br />
            <span className="text-sm">
              You can upload to{" "}
              <Link
                className="text-blue-500"
                href="https://hackclub.slack.com/archives/C016DEDUL87"
                target="_blank"
                rel="noopener noreferrer"
              >
                #cdn
              </Link>{" "}
              if you like!
            </span>
          </label>
          <input
            type="url"
            id="screenshot_url"
            name="screenshot_url"
            required
            className="w-full p-2 border rounded"
          />
        </div>

        {/* Submit Button */}
        <Button type="submit">Submit</Button>
      </form>
    </div>
  );
}
