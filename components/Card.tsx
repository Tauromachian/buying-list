import { BaseComponent } from "@/types/Component";
import { classesMerge } from "@/utils/component-classes";

type CardProps = BaseComponent & {
  variant?: "default" | "flat";
  children: React.ReactNode;
};

export function Card({ variant = "default", children, className }: CardProps) {
  return (
    <div
      className={classesMerge(
        "p-5 rounded-2xl bg-neutral-2",
        className,
        variant === "default" && "shadow-sm",
      )}
    >
      {children}
    </div>
  );
}
