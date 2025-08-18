import { twMerge } from 'tailwind-merge';
import { clsx, type ClassValue } from 'clsx';

/**
 * Utility function for merging Tailwind CSS classes intelligently.
 * Combines clsx for conditional classes and tailwind-merge for proper Tailwind class merging.
 *
 * @param inputs - Class values that can be strings, objects, arrays, etc.
 * @returns Merged and deduplicated class string
 */
export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs));
}
