import { cva } from "class-variance-authority";

import { classesMerge } from "@/utils/component-classes";
import { ComponentProps } from "react";

type Variant = "default" | "outlined" | "text";

type ButtonProps = ComponentProps<"button"> & {
  children: React.ReactNode;
  variant?: Variant;
  onClick?: () => void;
  label?: string;
  icon?: boolean;
};

function getClasses(variant: Variant, icon?: boolean) {
  // Last classes win in `classesMerge`, so `icon` overrides fills from the
  // chosen variant.
  const buttonVariants = cva("cursor-pointer text-text-1", {
    variants: {
      variant: {
        default: "rounded-xl text-white bg-accent-0 px-4 py-2",
        outlined: "rounded-xl bg-transparent border-2 border-gray-0 px-4 py-2",
        text: "rounded bg-transparent px-4 py-2",
      },
      icon: {
        true: "rounded-full bg-transparent flex justify-center items-center outline-none p-3",
      },
    },
    defaultVariants: { variant: "default", icon: false },
  });

  return buttonVariants({ variant, icon });
}

export function Button({
  children,
  onClick,
  className,
  label,
  variant = "default",
  icon,
  ...rest
}: ButtonProps) {
  return (
    <button
      onClick={onClick}
      aria-label={label}
      className={classesMerge(getClasses(variant, icon), className)}
      {...rest}
    >
      {children}
    </button>
  );
}
