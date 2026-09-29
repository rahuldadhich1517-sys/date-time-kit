import {
  convertTimezoneBetween,
  type TimezoneConvertOptions,
} from "../timezone-convert/index.js";

export interface TimezoneFormatOptions {
  locale?: string;
  dateStyle?: "full" | "long" | "medium" | "short";
  timeStyle?: "full" | "long" | "medium" | "short";
}

const DEFAULT_LOCALE = "en-US";

export function convertTimezone(
  date: Date,
  timeZone: string,
  options?: TimezoneFormatOptions
): string;
export function convertTimezone(
  dateOrString: Date | string,
  fromTimezone: string,
  toTimezone: string,
  options?: TimezoneConvertOptions
): string;
export function convertTimezone(
  dateOrString: Date | string,
  timeZoneOrFrom: string,
  optionsOrTo?: TimezoneFormatOptions | string,
  options?: TimezoneConvertOptions
): string {
  if (typeof optionsOrTo === "string") {
    return convertTimezoneBetween(
      dateOrString,
      timeZoneOrFrom,
      optionsOrTo,
      options
    );
  }

  const date =
    dateOrString instanceof Date ? dateOrString : new Date(dateOrString);
  validateDate(date);
  validateTimezone(timeZoneOrFrom);

  const opts = optionsOrTo ?? {};
  const formatter = new Intl.DateTimeFormat(opts.locale ?? DEFAULT_LOCALE, {
    dateStyle: opts.dateStyle ?? "medium",
    timeStyle: opts.timeStyle ?? "medium",
    timeZone: timeZoneOrFrom,
  });

  return formatter.format(date);
}

export function getTimezoneOffset(
  date: Date,
  timeZone: string
): number {
  validateDate(date);
  validateTimezone(timeZone);

  const formatter = new Intl.DateTimeFormat(
    "en-US",
    {
      timeZone,
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hourCycle: "h23",
    }
  );

  const parts = formatter.formatToParts(date);

  const values = Object.fromEntries(
    parts
      .filter(
        (part) => part.type !== "literal"
      )
      .map((part) => [
        part.type,
        part.value,
      ])
  );

  const asUTC = Date.UTC(
    Number(values.year),
    Number(values.month) - 1,
    Number(values.day),
    Number(values.hour),
    Number(values.minute),
    Number(values.second)
  );

  return (
    (asUTC - date.getTime()) / 60000
  );
}

export function getTimezoneName(
  date: Date,
  timeZone: string,
  locale = DEFAULT_LOCALE
): string {
  validateDate(date);
  validateTimezone(timeZone);

  const formatter = new Intl.DateTimeFormat(
    locale,
    {
      timeZone,
      timeZoneName: "long",
      year: "numeric",
      month: "short",
      day: "numeric",
    }
  );

  const parts = formatter.formatToParts(date);

  return (
    parts.find(
      (part) => part.type === "timeZoneName"
    )?.value ?? timeZone
  );
}

function validateDate(date: Date): void {
  if (!(date instanceof Date)) {
    throw new TypeError(
      "date must be a Date instance"
    );
  }

  if (Number.isNaN(date.getTime())) {
    throw new RangeError("Invalid date");
  }
}

function validateTimezone(
  timeZone: string
): void {
  if (typeof timeZone !== "string") {
    throw new TypeError(
      "timeZone must be a string"
    );
  }

  if (timeZone.trim().length === 0) {
    throw new RangeError(
      "timeZone cannot be empty"
    );
  }

  try {
    new Intl.DateTimeFormat("en-US", {
      timeZone,
    });
  } catch {
    throw new RangeError(
      `Invalid timezone: ${timeZone}`
    );
  }
}