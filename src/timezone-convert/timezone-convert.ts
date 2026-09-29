import {
  formatTimezoneOffset,
  getTimezoneOffsetMinutes,
  getTimezoneParts,
  wallClockToUTC,
} from "../internal/timezone-utils.js";
import {
  parseDateInput,
  validateDate,
  validateTimezone,
} from "../internal/validation.js";

export interface TimezoneConvertOptions {
  locale?: string;
  format?: "iso" | "short" | "medium" | "long" | "full";
  dateStyle?: "full" | "long" | "medium" | "short";
  timeStyle?: "full" | "long" | "medium" | "short";
}

export interface TimezoneConvertResult {
  date: string; // YYYY-MM-DD
  time: string; // HH:mm:ss
  iso: string; // YYYY-MM-DDTHH:mm:ss
  timezone: string;
  offset: string;
  offsetMinutes: number;
}

export function convertTimezoneBetween(
  dateOrString: Date | string,
  fromTimezone: string,
  toTimezone: string,
  options: TimezoneConvertOptions = {}
): string {
  validateTimezone(fromTimezone);
  validateTimezone(toTimezone);

  const utcDate = resolveToUTCDate(dateOrString, fromTimezone);

  // If user requested standard Intl formatted output (dateStyle/timeStyle or non-iso format)
  if (options.dateStyle || options.timeStyle || (options.format && options.format !== "iso")) {
    const formatter = new Intl.DateTimeFormat(options.locale ?? "en-US", {
      timeZone: toTimezone,
      dateStyle: options.dateStyle ?? (options.format !== "iso" ? options.format : "medium"),
      timeStyle: options.timeStyle ?? "medium",
    });
    return formatter.format(utcDate);
  }

  // Default ISO string representation in target timezone: YYYY-MM-DDTHH:mm:ss
  const parts = getTimezoneParts(utcDate, toTimezone);
  const y = parts.year;
  const m = String(parts.month).padStart(2, "0");
  const d = String(parts.day).padStart(2, "0");
  const h = String(parts.hour).padStart(2, "0");
  const min = String(parts.minute).padStart(2, "0");
  const s = String(parts.second).padStart(2, "0");

  return `${y}-${m}-${d}T${h}:${min}:${s}`;
}

export const convertBetweenTimezones = convertTimezoneBetween;

export function convertTimezoneDetailed(
  dateOrString: Date | string,
  fromTimezone: string,
  toTimezone: string
): TimezoneConvertResult {
  validateTimezone(fromTimezone);
  validateTimezone(toTimezone);

  const utcDate = resolveToUTCDate(dateOrString, fromTimezone);
  const parts = getTimezoneParts(utcDate, toTimezone);

  const y = parts.year;
  const m = String(parts.month).padStart(2, "0");
  const d = String(parts.day).padStart(2, "0");
  const h = String(parts.hour).padStart(2, "0");
  const min = String(parts.minute).padStart(2, "0");
  const s = String(parts.second).padStart(2, "0");

  const offsetMinutes = getTimezoneOffsetMinutes(utcDate, toTimezone);
  const offset = formatTimezoneOffset(offsetMinutes);

  return {
    date: `${y}-${m}-${d}`,
    time: `${h}:${min}:${s}`,
    iso: `${y}-${m}-${d}T${h}:${min}:${s}`,
    timezone: toTimezone,
    offset,
    offsetMinutes,
  };
}

function resolveToUTCDate(
  dateOrString: Date | string,
  fromTimezone: string
): Date {
  if (dateOrString instanceof Date) {
    validateDate(dateOrString, "date");
    return new Date(dateOrString.getTime());
  }

  if (typeof dateOrString !== "string") {
    throw new TypeError("date must be a Date instance or date string");
  }

  const trimmed = dateOrString.trim();
  if (!trimmed) {
    throw new RangeError("date cannot be empty");
  }

  // If the string contains an explicit timezone offset like +05:30 or Z, parse directly
  if (/[Zz]|[+-]\d{2}:?\d{2}$/.test(trimmed)) {
    return parseDateInput(trimmed, "date");
  }

  // Otherwise, it is a local wall-clock string in fromTimezone
  return wallClockToUTC(trimmed, fromTimezone);
}
