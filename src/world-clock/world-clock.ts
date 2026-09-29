import {
  formatTimezoneOffset,
  getTimezoneOffsetMinutes,
  getTimezoneParts,
} from "../internal/timezone-utils.js";
import { parseDateInput, validateTimezone } from "../internal/validation.js";
import { findTimezoneByPlace } from "../timezone-find/index.js";

export interface WorldClockOptions {
  baseDate?: Date | string | number;
  locale?: string;
  dateStyle?: "full" | "long" | "medium" | "short";
  timeStyle?: "full" | "long" | "medium" | "short";
}

export interface WorldClockEntry {
  timezone: string;
  city?: string;
  date: string;
  time: string;
  iso: string;
  offset: string;
  utcOffsetMinutes: number;
}

const DEFAULT_WORLD_CLOCK_ZONES = [
  "UTC",
  "America/New_York",
  "Europe/London",
  "Asia/Kolkata",
  "Asia/Tokyo",
  "Australia/Sydney",
];

export function getWorldClock(
  timezones?: string[],
  options: WorldClockOptions = {}
): WorldClockEntry[] {
  const zones =
    timezones && timezones.length > 0
      ? timezones
      : DEFAULT_WORLD_CLOCK_ZONES;

  return zones.map((zone) => getWorldClockForCity(zone, options));
}

export function getWorldClockForCity(
  cityOrZone: string,
  options: WorldClockOptions = {}
): WorldClockEntry {
  if (typeof cityOrZone !== "string") {
    throw new TypeError("cityOrZone must be a string");
  }

  const trimmed = cityOrZone.trim();
  if (!trimmed) {
    throw new RangeError("cityOrZone cannot be empty");
  }

  // Check if it resolves via place lookup
  const resolvedZone = findTimezoneByPlace(trimmed);
  const timezone = resolvedZone ?? trimmed;

  validateTimezone(timezone);

  const baseDate = options.baseDate !== undefined
    ? parseDateInput(options.baseDate, "baseDate")
    : new Date();

  const parts = getTimezoneParts(baseDate, timezone);
  const offsetMins = getTimezoneOffsetMinutes(baseDate, timezone);
  const offset = formatTimezoneOffset(offsetMins);

  const y = parts.year;
  const m = String(parts.month).padStart(2, "0");
  const d = String(parts.day).padStart(2, "0");
  const h = String(parts.hour).padStart(2, "0");
  const min = String(parts.minute).padStart(2, "0");
  const s = String(parts.second).padStart(2, "0");

  const dateStr = `${y}-${m}-${d}`;
  const timeStr = `${h}:${min}:${s}`;
  const isoStr = `${dateStr}T${timeStr}`;

  // Determine city name
  let city: string | undefined;
  if (resolvedZone && resolvedZone !== trimmed) {
    city = trimmed;
  } else if (timezone.includes("/")) {
    city = timezone.split("/").pop()?.replace(/_/g, " ");
  }

  return {
    timezone,
    city,
    date: dateStr,
    time: timeStr,
    iso: isoStr,
    offset,
    utcOffsetMinutes: offsetMins,
  };
}
