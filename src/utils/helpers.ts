/**
 * Joins class names with proper handling of falsy values
 * Similar to the cn utility in shadcn/ui
 */
export function cn(...classes: (string | boolean | undefined | null)[]) {
  return classes.filter(Boolean).join(' ');
}

/**
 * Format a date for display
 */
export function formatDate(date: Date | string, options?: Intl.DateTimeFormatOptions) {
  const defaultOptions: Intl.DateTimeFormatOptions = {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  };

  const dateToFormat = date instanceof Date ? date : new Date(date);
  return dateToFormat.toLocaleDateString('es-ES', options || defaultOptions);
}

/**
 * Calculate reading time for a text
 */
export function calculateReadingTime(text: string) {
  const wordsPerMinute = 200;
  const words = text.trim().split(/\s+/).length;
  return Math.ceil(words / wordsPerMinute);
}
