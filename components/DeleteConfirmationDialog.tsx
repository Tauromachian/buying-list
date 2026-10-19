import { useEffect, useState } from "react";

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
  useEffect(() => {
    if (!open) return;

    setIsOpen(open);
  }, [open]);

  const [isOpen, setIsOpen] = useState<boolean>(false);

  function close() {
    setIsOpen(false);
    onClose(false);
  }

  return (
    <Dialog open={isOpen} onClose={close}>
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
