import { BaseComponent } from "@/types/Component";
import { classesMerge } from "@/utils/component-classes";

type ButtonProps = BaseComponent & {
  children: React.ReactNode;
  onClick?: () => void;
};

export function Button({ children, onClick, className }: ButtonProps) {
  return (
    <button
      onClick={onClick}
      className={classesMerge("rounded bg-accent-0 px-4 py-2", className)}
    >
      {children}
    </button>
  );
}
