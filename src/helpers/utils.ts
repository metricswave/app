import { type ClassValue, clsx } from "clsx"
import { twMerge } from "./TwMerge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
