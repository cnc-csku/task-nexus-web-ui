import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";

dayjs.extend(relativeTime);

/**
 * Formats a date as "MMM DD YYYY" (e.g., "Jan 01 2023")
 * @param date - The date to format (Date object, timestamp number, or date string)
 * @returns The formatted date string or "Invalid date" if the input is invalid
 */
export function formatDateAsMMMDDYYYY(date: Date | string | number): string {
  try {
    const dateObject = date instanceof Date ? date : new Date(date);

    // Check if the date is valid
    if (isNaN(dateObject.getTime())) {
      return "Invalid date";
    }

    const formatter = new Intl.DateTimeFormat("en-US", {
      month: "short", // "MMM" - abbreviated month name
      day: "2-digit", // "DD" - day of month, zero-padded
      year: "numeric", // "YYYY" - 4-digit year
    });

    return formatter.format(dateObject);
  } catch (error) {
    return "Invalid date";
  }
}

export function browserTimezone(): string {
  return Intl.DateTimeFormat().resolvedOptions().timeZone;
}

export function timeAgo(timestamp: Date | number): string {
  return dayjs(timestamp).fromNow();
}