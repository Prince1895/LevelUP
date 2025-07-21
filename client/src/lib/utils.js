import { clsx } from "clsx";
import { twMerge } from "tailwind-merge"





/**
 * A utility function that combines classnames with tailwind-merge
 * @param {...string} inputs - A list of classnames to be merged
 * @returns {string} - A merged class string
 */
export function cn(...inputs) {
  return twMerge(clsx(inputs));
}
