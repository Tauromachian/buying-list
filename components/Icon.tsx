"use client";

import "iconify-icon";
import { icons as mdiIcons } from "@iconify-json/mdi";
import { addCollection } from "iconify-icon";
import type { BaseComponent } from "@/types/Component";

// Register the Pictogrammers Material Design Icons collection (`mdi:*`)
// for offline use, so no Iconify API requests are needed at runtime.
addCollection(mdiIcons);

type IconProps = BaseComponent & {
  /** Full icon icon, e.g. "mdi:cart-plus". */
  icon: string;
  width?: string | number;
  height?: string | number;
  /** Align icon with surrounding text. */
  inline?: boolean;
  /** Accessible label. Renders role="img" when set. */
  label?: string;
};

export function Icon({
  icon,
  width,
  height,
  inline,
  label,
  className,
}: IconProps) {
  return (
    <iconify-icon
      icon={icon}
      width={width}
      height={height}
      inline={inline}
      className={className}
      role={label ? "img" : undefined}
      aria-label={label}
    />
  );
}
