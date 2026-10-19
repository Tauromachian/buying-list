import { Icon } from "./Icon";

export function EmptyState({ text }: { text?: string }) {
  return (
    <div className="flex min-h-36">
      <Icon icon="mdi:file-outline"></Icon>
      {text ?? "Nothing yet, add something!"}
    </div>
  );
}
