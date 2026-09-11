export type RelativeTimeUnit =
  | "second"
  | "minute"
  | "hour"
  | "day"
  | "week"
  | "month"
  | "year";

export interface RelativeTimeOptions {
  locale?: string;
  numeric?: "always" | "auto";
  style?: "long" | "short" | "narrow";
}

const DEFAULT_OPTIONS: Required<RelativeTimeOptions> = {
  locale: "en-US",
  numeric: "auto",
  style: "long",
};

export function formatRelativeTime(
  date: Date,
  baseDate: Date = new Date(),
  options: RelativeTimeOptions = {}
): string {
  validateDate(date, "date");
  validateDate(baseDate, "baseDate");

  const config = {
    ...DEFAULT_OPTIONS,
    ...options,
  };

  const difference =
    date.getTime() - baseDate.getTime();

  const seconds = difference / 1000;
  const absoluteSeconds = Math.abs(seconds);

  if (absoluteSeconds < 10) {
    return seconds < 0 ? "just now" : "in a few seconds";
  }

  const { value, unit } = getRelativeUnit(seconds);

  const formatter = new Intl.RelativeTimeFormat(
    config.locale,
    {
      numeric: config.numeric,
      style: config.style,
    }
  );

  return formatter.format(value, unit);
}

function getRelativeUnit(
  seconds: number
): {
  value: number;
  unit: RelativeTimeUnit;
} {
  const absoluteSeconds = Math.abs(seconds);

  if (absoluteSeconds < 60) {
    return {
      value: Math.round(seconds),
      unit: "second",
    };
  }

  const minutes = seconds / 60;

  if (Math.abs(minutes) < 60) {
    return {
      value: Math.round(minutes),
      unit: "minute",
    };
  }

  const hours = minutes / 60;

  if (Math.abs(hours) < 24) {
    return {
      value: Math.round(hours),
      unit: "hour",
    };
  }

  const days = hours / 24;

  if (Math.abs(days) < 7) {
    return {
      value: Math.round(days),
      unit: "day",
    };
  }

  const weeks = days / 7;

  if (Math.abs(weeks) < 4) {
    return {
      value: Math.round(weeks),
      unit: "week",
    };
  }

  const months = days / 30;

  if (Math.abs(months) < 12) {
    return {
      value: Math.round(months),
      unit: "month",
    };
  }

  return {
    value: Math.round(days / 365),
    unit: "year",
  };
}

function validateDate(
  date: Date,
  name: string
): void {
  if (!(date instanceof Date)) {
    throw new TypeError(
      `${name} must be a Date instance`
    );
  }

  if (Number.isNaN(date.getTime())) {
    throw new RangeError(
      `Invalid ${name}`
    );
  }
}