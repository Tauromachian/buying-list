import { Icon } from "./Icon";

export function EmptyState({ text }: { text?: string }) {
  return (
    <div className="flex min-h-36 items-center justify-center gap-2 text-gray-0">
      <Icon icon="mdi:file-outline"></Icon>
      {text ?? "Nothing yet, add something!"}
    </div>
  );
}
