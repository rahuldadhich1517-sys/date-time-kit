import { validateDate, validateTimezone } from "./validation.js";

export function getTimezoneOffsetMinutes(
  date: Date,
  timeZone: string
): number {
  validateDate(date);
  validateTimezone(timeZone);

  const formatter = new Intl.DateTimeFormat("en-US", {
    timeZone,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hourCycle: "h23",
  });

  const parts = formatter.formatToParts(date);
  const values = Object.fromEntries(
    parts
      .filter((part) => part.type !== "literal")
      .map((part) => [part.type, part.value])
  );

  const asUTC = Date.UTC(
    Number(values.year),
    Number(values.month) - 1,
    Number(values.day),
    Number(values.hour),
    Number(values.minute),
    Number(values.second)
  );

  return (asUTC - date.getTime()) / 60000;
}

export function formatTimezoneOffset(offsetMinutes: number): string {
  const sign = offsetMinutes >= 0 ? "+" : "-";
  const abs = Math.abs(offsetMinutes);
  const hours = String(Math.floor(abs / 60)).padStart(2, "0");
  const minutes = String(abs % 60).padStart(2, "0");
  return `${sign}${hours}:${minutes}`;
}

export function parseTimezoneOffset(offset: string | number): number {
  if (typeof offset === "number") {
    if (!Number.isFinite(offset)) {
      throw new TypeError("offset must be a finite number");
    }
    return Math.round(offset);
  }

  if (typeof offset !== "string") {
    throw new TypeError("offset must be a string or number");
  }

  const trimmed = offset.trim();
  if (!trimmed) {
    throw new RangeError("offset cannot be empty");
  }

  if (trimmed.toUpperCase() === "Z" || trimmed.toUpperCase() === "UTC") {
    return 0;
  }

  const match = trimmed.match(/^([+-])(\d{1,2})(?::?(\d{2}))?$/);
  if (!match) {
    throw new RangeError(`Invalid timezone offset format: ${offset}`);
  }

  const sign = match[1] === "-" ? -1 : 1;
  const hours = Number(match[2]);
  const minutes = match[3] ? Number(match[3]) : 0;

  if (hours > 14 || minutes > 59) {
    throw new RangeError(`Invalid timezone offset value: ${offset}`);
  }

  return sign * (hours * 60 + minutes);
}

export interface WallClockParts {
  year: number;
  month: number;
  day: number;
  hour: number;
  minute: number;
  second: number;
}

export function getTimezoneParts(
  date: Date,
  timeZone: string
): WallClockParts {
  validateDate(date);
  validateTimezone(timeZone);

  const formatter = new Intl.DateTimeFormat("en-US", {
    timeZone,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hourCycle: "h23",
  });

  const parts = formatter.formatToParts(date);
  const values = Object.fromEntries(
    parts
      .filter((part) => part.type !== "literal")
      .map((part) => [part.type, part.value])
  );

  return {
    year: Number(values.year),
    month: Number(values.month),
    day: Number(values.day),
    hour: Number(values.hour),
    minute: Number(values.minute),
    second: Number(values.second),
  };
}

export function wallClockToUTC(
  dateStrOrParts: string | WallClockParts,
  timeZone: string
): Date {
  validateTimezone(timeZone);

  let parts: WallClockParts;

  if (typeof dateStrOrParts === "string") {
    const trimmed = dateStrOrParts.trim();
    const match = trimmed.match(
      /^(\d{4})-(\d{2})-(\d{2})(?:[T\s](\d{2}):(\d{2})(?::(\d{2}))?)?/
    );
    if (!match) {
      throw new RangeError(`Invalid date string: ${dateStrOrParts}`);
    }
    parts = {
      year: Number(match[1]),
      month: Number(match[2]),
      day: Number(match[3]),
      hour: match[4] ? Number(match[4]) : 0,
      minute: match[5] ? Number(match[5]) : 0,
      second: match[6] ? Number(match[6]) : 0,
    };
  } else {
    parts = dateStrOrParts;
  }

  const guessUTC = Date.UTC(
    parts.year,
    parts.month - 1,
    parts.day,
    parts.hour,
    parts.minute,
    parts.second
  );

  let offset = getTimezoneOffsetMinutes(new Date(guessUTC), timeZone);
  let utcTime = guessUTC - offset * 60000;

  // Refine for DST boundary transitions
  const refinedOffset = getTimezoneOffsetMinutes(new Date(utcTime), timeZone);
  if (refinedOffset !== offset) {
    utcTime = guessUTC - refinedOffset * 60000;
  }

  return new Date(utcTime);
}
