import { classesMerge } from "@/utils/component-classes";
import { Icon } from "./Icon";

export function EmptyState({
  text,
  className,
}: {
  text?: string;
  className?: string;
}) {
  return (
    <div
      className={classesMerge(
        "flex min-h-36 items-center justify-center gap-2 text-gray-0",
        className,
      )}
    >
      <Icon icon="mdi:file-outline" height="32" width="32"></Icon>
      {text ?? "Nothing yet, add something!"}
    </div>
  );
}
