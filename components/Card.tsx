import { BaseComponent } from "@/types/Component";
import { classesMerge } from "@/utils/component-classes";

type CardProps = BaseComponent & {
  children: React.ReactNode;
};

export function Card({ children, className }: CardProps) {
  return (
    <div
      className={classesMerge(
        "p-2 rounded-md shadow shadow-gray-400",
        className,
      )}
    >
      {children}
    </div>
  );
}
