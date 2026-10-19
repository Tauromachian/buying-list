import { cva } from "class-variance-authority";

import { BaseComponent } from "@/types/Component";
import { classesMerge } from "@/utils/component-classes";

type Variant = "default" | "icon";

type ButtonProps = BaseComponent & {
  children: React.ReactNode;
  variant?: Variant;
  onClick?: () => void;
  /** Accessible label. Recommended for icon-only buttons. */
  label?: string;
};

function getClassesByVariant(variant: Variant) {
  const buttonVariants = cva("cursor-pointer", {
    variants: {
      variant: {
        default: "rounded bg-accent-0 px-4 py-2",
        icon: "bg-transparent rounded-full flex justify-center items-center outline-none",
      },
    },
    defaultVariants: { variant: "default" },
  });

  return buttonVariants({ variant });
}

export function Button({
  children,
  onClick,
  className,
  label,
  variant = "default",
}: ButtonProps) {
  return (
    <button
      onClick={onClick}
      aria-label={label}
      className={classesMerge(getClassesByVariant(variant), className)}
    >
      {children}
    </button>
  );
}
