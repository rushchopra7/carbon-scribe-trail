import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatNumberGerman(value: number, decimals: number = 2): string {
  return value.toLocaleString('de-DE', { 
    minimumFractionDigits: decimals, 
    maximumFractionDigits: decimals 
  });
}
