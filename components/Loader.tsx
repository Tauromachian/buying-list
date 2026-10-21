import { Icon } from "./Icon";

const sizeByName = {
  sm: "32px",
  md: "40px",
  lg: "48px",
} as const;

type SizeName = keyof typeof sizeByName;

export function Loader({ size }: { size: number | string | SizeName }) {
  if (typeof size === "number") size = `${size}px`;

  if (sizeByName[size as SizeName]) {
    size = sizeByName[size as SizeName];
  }

  return (
    <Icon
      icon="mdi:loading"
      className="animate-spin"
      width={size}
      height={size}
    ></Icon>
  );
}
