import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"
import { format, parseISO } from "date-fns"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Format a number as currency
 * @param amount Number to format
 * @param currency Currency code (default: EUR)
 * @returns Formatted currency string
 */
export function formatMoney(amount: number, currency: string = "MAD"): string {
  return new Intl.NumberFormat("fr-MA", {
    style: "currency",
    currency: currency,
    minimumFractionDigits: 2,
  }).format(amount);
}

/**
 * Format a date string
 * @param date Date string to format or Date object
 * @param formatStr Format string (default: 'dd/MM/yyyy')
 * @returns Formatted date string
 */
export function formatDate(date: string | Date, formatStr: string = "dd/MM/yyyy"): string {
  if (!date) return "";
  
  try {
    const dateObj = typeof date === "string" ? parseISO(date) : date;
    return format(dateObj, formatStr);
  } catch (error) {
    console.error("Error formatting date:", error);
    return String(date);
  }
}
