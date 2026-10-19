import { useEffect, useState } from "react";

import { Button } from "./Button";
import { Dialog } from "./Dialog";
import { Card } from "./Card";

export function DeleteConfirmationDialog({
  onDelete,
  open,
}: {
  open?: boolean;
  onDelete: () => void;
}) {
  useEffect(() => {
    if (!open) return;

    setIsOpen(open);
  }, [open]);

  const [isOpen, setIsOpen] = useState<boolean>(false);

  return (
    <Dialog open={isOpen}>
      <Card>
        <p className="my-7">
          The resource will be deleted. This action is irreversible.
        </p>

        <div className="flex gap-4">
          <Button className="ml-auto" onClick={() => setIsOpen(false)}>
            Cancel
          </Button>
          <Button onClick={onDelete}>Delete</Button>
        </div>
      </Card>
    </Dialog>
  );
}
