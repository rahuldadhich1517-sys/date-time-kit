export type DateFormat =
  | "short"
  | "medium"
  | "long"
  | "full"
  | "iso";

export interface DateFormatterOptions {
  locale?: string;
  timeZone?: string;
  format?: DateFormat;
}

const DEFAULT_OPTIONS: Required<
  Omit<DateFormatterOptions, "timeZone">
> = {
  locale: "en-US",
  format: "medium",
};

export function formatDate(
  date: Date,
  options: DateFormatterOptions = {}
): string {
  validateDate(date);

  const config = {
    ...DEFAULT_OPTIONS,
    ...options,
  };

  if (config.format === "iso") {
    return date.toISOString();
  }

  const formatter = new Intl.DateTimeFormat(
    config.locale,
    {
      dateStyle: config.format,
      timeZone: config.timeZone,
    }
  );

  return formatter.format(date);
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