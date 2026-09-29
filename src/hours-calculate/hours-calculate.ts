export interface ParsedHours {
  hours: number;
  minutes: number;
  totalMinutes: number;
  totalHours: number;
  isNegative: boolean;
}

export type HoursFormatStyle = "short" | "colon";

export function parseHours(value: string | number): ParsedHours {
  let totalMinutes: number;

  if (typeof value === "number") {
    if (!Number.isFinite(value)) {
      throw new TypeError("value must be a finite number");
    }
    totalMinutes = Math.round(value);
  } else if (typeof value === "string") {
    const trimmed = value.trim();
    if (!trimmed) {
      throw new RangeError("Time entry cannot be empty");
    }
    totalMinutes = parseStringToMinutes(trimmed);
  } else {
    throw new TypeError("Time entry must be a string or number");
  }

  const isNegative = totalMinutes < 0;
  const absMinutes = Math.abs(totalMinutes);
  const hours = Math.floor(absMinutes / 60);
  const minutes = absMinutes % 60;
  const totalHours = Number((totalMinutes / 60).toFixed(4));

  return {
    hours,
    minutes,
    totalMinutes,
    totalHours,
    isNegative,
  };
}

export function addHours(...values: (string | number)[]): string {
  if (values.length === 0) {
    return "0m";
  }

  let totalMinutes = 0;
  for (const v of values) {
    const parsed = parseHours(v);
    totalMinutes += parsed.totalMinutes;
  }

  return formatHours(totalMinutes, "short");
}

export function subtractHours(
  base: string | number,
  ...values: (string | number)[]
): string {
  let totalMinutes = parseHours(base).totalMinutes;

  for (const v of values) {
    const parsed = parseHours(v);
    totalMinutes -= parsed.totalMinutes;
  }

  return formatHours(totalMinutes, "short");
}

export function totalHours(values: (string | number)[]): number {
  if (!Array.isArray(values)) {
    throw new TypeError("values must be an array");
  }

  let totalMinutes = 0;
  for (const v of values) {
    const parsed = parseHours(v);
    totalMinutes += parsed.totalMinutes;
  }

  return Number((totalMinutes / 60).toFixed(4));
}

export function formatHours(
  minutesInput: number,
  style: HoursFormatStyle = "short"
): string {
  if (!Number.isFinite(minutesInput)) {
    throw new TypeError("minutes must be a finite number");
  }

  const totalMinutes = Math.round(minutesInput);
  const isNegative = totalMinutes < 0;
  const absMinutes = Math.abs(totalMinutes);
  const h = Math.floor(absMinutes / 60);
  const m = absMinutes % 60;

  if (style === "colon") {
    const sign = isNegative ? "-" : "";
    const hStr = String(h).padStart(2, "0");
    const mStr = String(m).padStart(2, "0");
    return `${sign}${hStr}:${mStr}`;
  }

  // style === "short"
  const sign = isNegative ? "-" : "";
  if (h === 0 && m === 0) {
    return "0m";
  }
  if (h === 0) {
    return `${sign}${m}m`;
  }
  if (m === 0) {
    return `${sign}${h}h`;
  }
  return `${sign}${h}h ${m}m`;
}

function parseStringToMinutes(str: string): number {
  let isNegative = false;
  let s = str;

  if (s.startsWith("-")) {
    isNegative = true;
    s = s.slice(1).trim();
  } else if (s.startsWith("+")) {
    s = s.slice(1).trim();
  }

  // Check colon format: HH:mm or H:mm:ss
  const colonMatch = s.match(/^(\d{1,4}):(\d{1,2})(?::(\d{1,2}))?$/);
  if (colonMatch) {
    const hours = Number(colonMatch[1]);
    const minutes = Number(colonMatch[2]);
    const total = hours * 60 + minutes;
    return isNegative ? -total : total;
  }

  // Check text format: e.g. "2h 30m", "2h", "30m", "2.5h"
  const textPattern = /^(?:(\d+(?:\.\d+)?)\s*h)?\s*(?:(\d+)\s*m)?$/i;
  const textMatch = s.match(textPattern);

  if (textMatch && (textMatch[1] !== undefined || textMatch[2] !== undefined)) {
    const hoursPart = textMatch[1] ? parseFloat(textMatch[1]) : 0;
    const minutesPart = textMatch[2] ? parseInt(textMatch[2], 10) : 0;
    const total = Math.round(hoursPart * 60) + minutesPart;
    return isNegative ? -total : total;
  }

  // Plain number string
  if (/^\d+$/.test(s)) {
    const total = Number(s);
    return isNegative ? -total : total;
  }

  throw new RangeError(`Invalid time format: ${str}`);
}
