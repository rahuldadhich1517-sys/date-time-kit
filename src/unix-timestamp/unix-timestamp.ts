import { parseDateInput, validateDate } from "../internal/validation.js";
import type { TimestampUnit } from "../timestamp/index.js";

export interface UnixTimestampFormatOptions {
  unit?: TimestampUnit;
  locale?: string;
  timeZone?: string;
  dateStyle?: "full" | "long" | "medium" | "short";
  timeStyle?: "full" | "long" | "medium" | "short";
}

const MAX_TIMESTAMP_MS = 8.64e15;
const MIN_TIMESTAMP_MS = -8.64e15;

export function toUnixTimestamp(
  date: Date | string | number,
  unit: TimestampUnit = "milliseconds"
): number {
  const d = parseDateInput(date, "date");
  const ms = d.getTime();

  return unit === "seconds" ? Math.floor(ms / 1000) : ms;
}

export function fromUnixTimestamp(
  timestamp: number,
  unit: TimestampUnit = "milliseconds"
): Date {
  if (!Number.isFinite(timestamp)) {
    throw new TypeError("timestamp must be a finite number");
  }

  const ms = unit === "seconds" ? timestamp * 1000 : timestamp;

  if (ms < MIN_TIMESTAMP_MS || ms > MAX_TIMESTAMP_MS) {
    throw new RangeError("timestamp out of valid range");
  }

  const date = new Date(ms);
  validateDate(date);
  return date;
}

export function toUnixSeconds(date: Date | string | number): number {
  return toUnixTimestamp(date, "seconds");
}

export function toUnixMilliseconds(date: Date | string | number): number {
  return toUnixTimestamp(date, "milliseconds");
}

export function fromUnixSeconds(seconds: number): Date {
  return fromUnixTimestamp(seconds, "seconds");
}

export function fromUnixMilliseconds(milliseconds: number): Date {
  return fromUnixTimestamp(milliseconds, "milliseconds");
}

export function unixToISO(
  timestamp: number,
  unit: TimestampUnit = "milliseconds"
): string {
  const date = fromUnixTimestamp(timestamp, unit);
  return date.toISOString();
}

export function isoToUnix(
  iso: string,
  unit: TimestampUnit = "milliseconds"
): number {
  return toUnixTimestamp(iso, unit);
}

export function formatUnixTimestamp(
  timestamp: number,
  options: UnixTimestampFormatOptions = {}
): string {
  const unit = options.unit ?? "milliseconds";
  const date = fromUnixTimestamp(timestamp, unit);

  const formatter = new Intl.DateTimeFormat(options.locale ?? "en-US", {
    timeZone: options.timeZone,
    dateStyle: options.dateStyle ?? "medium",
    timeStyle: options.timeStyle ?? "medium",
  });

  return formatter.format(date);
}
