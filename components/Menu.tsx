import { useId } from "react";

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
  activator: (popoverTarget: string) => React.ReactNode;
  children: React.ReactNode;
};

export function Menu({
  position = "bottom center",
  activator,
  children,
}: Props) {
  const id = useId();

  return (
    <div>
      {activator(id)}

      <div
        id={id}
        popover="auto"
        style={{ positionArea: position }}
        className="shadow-lg rounded-md bg-gray-200"
      >
        {children}
      </div>
    </div>
  );
}
