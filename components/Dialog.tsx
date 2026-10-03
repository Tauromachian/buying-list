import { useEffect, useRef } from "react";
import { Button } from "./Button";
import { Icon } from "./Icon";

export function Dialog({
  children,
  open,
  onClose,
}: {
  children: React.ReactNode;
  open?: boolean;
  onClose?: (value: boolean) => void;
}) {
  const dialogRef = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    if (!dialogRef.current) return;

    // Dialog and prop in sync. Nothing else to do.
    if (open === dialogRef.current.open) return;

    if (open) dialogRef.current.showModal();
    else dialogRef.current.close();
  }, [open]);

  function close() {
    if (!onClose) return;

    onClose(false);
  }

  return (
    <dialog
      ref={dialogRef}
      closedby="any"
      onClose={close}
      className="m-auto rounded-md backdrop:bg-black backdrop:opacity-30"
    >
      <Button onClick={close} className="absolute top-2 right-2" variant="icon">
        <Icon icon="mdi:close"></Icon>
      </Button>
      {children}
    </dialog>
  );
}
