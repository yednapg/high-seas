import { Button, buttonVariants } from "@/components/ui/button";
import { deleteShip, Ship, updateShip } from "./ship-utils";
import { useToast } from "@/hooks/use-toast";
import Icon from "@hackclub/icons";

const editMessages = [
  "Orpheus hopes you know that she put a lot of effort into recording your changes~",
  "Heidi scribbles down your changes hastily...",
  "Orpheus put your Ship changes in the logbook. They're going nowhere, rest assured.",
];

const deleteMessages = [
  "is no more!",
  "has been struck from the logbook",
  "has been lost to time...",
];

export default function EditShipForm({
  ship,
  closeForm,
  setShips,
}: {
  ship: Ship;
  closeForm: () => void;
  setShips: any;
}) {
  const { toast } = useToast();

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

    toast({
      title: "Ship updated!",
      description:
        editMessages[Math.floor(Math.random() * editMessages.length)],
    });
  };

  const handleDelete = async () => {
    await deleteShip(ship.id);

    if (setShips) {
      console.log(`Deleted ${ship.title} (${ship.id})`);

      setShips((previousShips: Ship[]) =>
        previousShips.filter((s: Ship) => s.id !== ship.id),
      );
    } else {
      console.error("Deleted a ship but can't setShips bc you didn't pass it.");
    }
    closeForm();

    toast({
      title: "Ship deleted!",
      description: `${ship.shipType === "update" ? "Your update to " : ""}${ship.title} ${deleteMessages[Math.floor(Math.random() * deleteMessages.length)]}`,
    });
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
        <label htmlFor="deploymentUrl">Demo Link (Project / Video URL)</label>
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

      <Button className={buttonVariants({ variant: "default" })}>
        <Icon glyph="thumbsup-fill" />
        Save edits
      </Button>

      <Button className={buttonVariants({ variant: "destructive" })}>
        <Icon glyph="forbidden" />
        Delete Ship
      </Button>
    </form>
  );
}
