import { Button } from "@/components/ui/button";
import { Ship, updateShip } from "./ship-utils";

export default function EditShipForm({
  ship,
  closeForm,
  setShips,
}: {
  ship: Ship;
  closeForm: () => void;
  setShips: any;
}) {
  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const formValues = Object.fromEntries(formData.entries());

    const newShip: Ship = {
      ...ship,
      title: formValues.title as string,
      repoUrl: formValues.repoUrl as string,
      deploymentUrl: formValues.deploymentUrl as string,
      readmeUrl: formValues.readmeUrl as string,
      screenshotUrl: formValues.screenshotUrl as string,
    };
    console.log("updating...", formValues, ship, newShip);
    await updateShip(newShip);

    if (setShips) {
      console.log("Set ships is passed! Updating ship with ID", newShip.id);

      setShips((previousShips: Ship[]) => {
        console.log("the previous ships were", previousShips);
        const newShips = previousShips.map((s: Ship) =>
          s.id === newShip.id ? newShip : s,
        );
        console.info("ok so the new ships are", newShips);
        return newShips;
      });
    } else {
      console.error("Updated a ship but can't setShips bc you didn't pass it.");
    }
    closeForm();
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

      <Button type="submit">Save edits</Button>
    </form>
  );
}
