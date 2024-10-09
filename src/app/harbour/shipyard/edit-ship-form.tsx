import { Button } from "@/components/ui/button";
import { Ship, updateShip } from "./ship-utils";

export default function EditShipForm({ ship }: { ship: Ship }) {
  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const formValues = Object.fromEntries(formData.entries());
    console.log(formValues, ship);

    const newShip: Ship = {
      ...ship,
      title: formValues.title as string,
    };
    await updateShip(newShip);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-2">
      <div>
        <label htmlFor="title">Title</label>
        <input
          id="title"
          name="title"
          defaultValue={ship.title}
          required
          className="w-full p-2 border rounded"
        />
      </div>

      <div>
        <label htmlFor="repoUrl">Repo URL</label>
        <input
          id="repoUrl"
          name="repoUrl"
          defaultValue={ship.repoUrl}
          required
          className="w-full p-2 border rounded"
        />
      </div>

      <div>
        <label htmlFor="deploymentUrl">Deployment URL</label>
        <input
          id="deploymentUrl"
          name="deploymentUrl"
          defaultValue={ship.deploymentUrl}
          required
          className="w-full p-2 border rounded"
        />
      </div>

      <div>
        <label htmlFor="readmeUrl">README URL</label>
        <input
          id="readmeUrl"
          name="readmeUrl"
          defaultValue={ship.readmeUrl}
          required
          className="w-full p-2 border rounded"
        />
      </div>

      <div>
        <label htmlFor="screenshotUrl">Screenshot URL</label>
        <input
          id="screenshotUrl"
          name="screenshotUrl"
          defaultValue={ship.screenshotUrl}
          required
          className="w-full p-2 border rounded"
        />
      </div>

      <Button type="submit">Submit</Button>
    </form>
  );
}
