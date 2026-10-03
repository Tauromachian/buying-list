import { cva } from "class-variance-authority";

import { BaseComponent } from "@/types/Component";
import { classesMerge } from "@/utils/component-classes";

type Variant = "default" | "icon";

type ButtonProps = BaseComponent & {
  children: React.ReactNode;
  variant?: Variant;
  onClick?: () => void;
};

function getClassesByVariant(variant: Variant) {
  const buttonVariants = cva("cursor-pointer", {
    variants: {
      variant: {
        default: "rounded bg-accent-0 px-4 py-2",
        icon: "bg-transparent rounded-full flex justify-center items-center",
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
  variant = "default",
}: ButtonProps) {
  return (
    <button
      onClick={onClick}
      className={classesMerge(getClassesByVariant(variant), className)}
    >
      {children}
    </button>
  );
}
