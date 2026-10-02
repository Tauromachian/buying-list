// lib/utils.ts
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function classesMerge(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
