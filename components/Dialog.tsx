import { useEffect, useId, useRef } from "react";
import { Button } from "./Button";
import { Icon } from "./Icon";

export function Dialog({
  children,
  open,
  onClose,
  title,
}: {
  children: React.ReactNode;
  open?: boolean;
  onClose?: (value: boolean) => void;
  /** Dialog title. Rendered as a heading and exposed as the dialog's accessible name. */
  title?: string;
}) {
  const titleId = useId();
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
      aria-labelledby={title ? titleId : undefined}
      className="m-auto rounded-md backdrop:bg-black backdrop:opacity-30 min-w-80"
    >
      <Button
        onClick={close}
        className="absolute top-2 right-2"
        icon
        label="Close"
      >
        <Icon icon="mdi:close" className="text-danger-0"></Icon>
      </Button>

      {title && (
        <p id={titleId} className="text-md font-bold m-5">
          {title}
        </p>
      )}

      {children}
    </dialog>
  );
}
