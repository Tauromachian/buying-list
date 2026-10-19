import { Button } from "./Button";
import { Dialog } from "./Dialog";
import { Card } from "./Card";

export function DeleteConfirmationDialog({
  onDelete,
  open,
  onClose,
}: {
  open?: boolean;
  onClose: (val: boolean) => void;
  onDelete: () => void;
}) {
  return (
    <Dialog open={open} onClose={close} title="Delete list?">
      <Card>
        <p className="my-7">
          The resource will be deleted. This action is irreversible.
        </p>

        <div className="flex gap-4">
          <Button className="ml-auto" onClick={() => onClose(false)}>
            Cancel
          </Button>
          <Button onClick={onDelete}>Delete</Button>
        </div>
      </Card>
    </Dialog>
  );
}
