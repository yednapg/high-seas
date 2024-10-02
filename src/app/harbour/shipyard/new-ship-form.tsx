// import { revalidatePath } from "next/cache";
import Link from "next/link";
import { createShip } from "./ship-utils";
import { Button } from "@/components/ui/button";
import JSConfetti from "js-confetti";
import { useEffect, useRef } from "react";

export default function NewShipForm({
  canvasRef,
  closeForm,
}: {
  canvasRef: any;
  closeForm: any;
}) {
  const confettiRef = useRef<JSConfetti | null>(null);

  useEffect(() => {
    confettiRef.current = new JSConfetti({ canvas: canvasRef.current });
  }, []);

  const handleForm = (formData: FormData) => {
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
          <label htmlFor="title">Title</label>
          <input
            type="text"
            id="title"
            name="title"
            required
            className="w-full p-2 border rounded"
          />
        </div>

        <div>
          <label htmlFor="hours">Hours</label>
          <input
            type="number"
            id="hours"
            name="hours"
            min="0"
            required
            className="w-full p-2 border rounded"
          />
        </div>

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
            id="deploy_url"
            name="deploy_url"
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

        <Button type="submit">Submit</Button>
      </form>
    </div>
  );
}
