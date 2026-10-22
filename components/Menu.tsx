import { classesMerge } from "@/utils/component-classes";
import { cloneElement, useId, useRef } from "react";

const coordinates = [
  "left",
  "center",
  "right",
  "top",
  "center",
  "bottom",
] as const;

type Position =
  | (typeof coordinates)[number]
  | `${(typeof coordinates)[number]} ${(typeof coordinates)[number]}`;

type Props = {
  position?: Position;
  activator: React.ReactElement;
  children: React.ReactNode;
  className?: string;
  open?: boolean;
  onToggle?: (event: React.ToggleEvent) => void;
};

export function Menu({
  position = "bottom center",
  activator,
  children,
  className,
  open,
  onToggle,
}: Props) {
  const id = useId();

  const popoverRef = useRef<HTMLDivElement>(null);

  if (open) {
    popoverRef.current?.showPopover();
  } else {
    popoverRef.current?.hidePopover();
  }

  return (
    <>
      {cloneElement(
        activator as React.ReactElement<React.HTMLAttributes<HTMLElement>>,
        {
          style: { anchorName: `--${id}` },
          popoverTarget: id,
        },
      )}

      <div
        id={id}
        popover="auto"
        style={{ positionArea: position, positionAnchor: `--${id}` }}
        ref={popoverRef}
        className={classesMerge("shadow-lg rounded-md bg-gray-200", className)}
        onToggle={onToggle}
      >
        {children}
      </div>
    </>
  );
}
