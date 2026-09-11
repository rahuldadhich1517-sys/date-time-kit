export type TimestampUnit = "seconds" | "milliseconds";

export function toUnixTimestamp(
  date: Date,
  unit: TimestampUnit = "milliseconds"
): number {
  validateDate(date);

  const milliseconds = date.getTime();

  return unit === "seconds"
    ? Math.floor(milliseconds / 1000)
    : milliseconds;
}

export function fromUnixTimestamp(
  timestamp: number,
  unit: TimestampUnit = "milliseconds"
): Date {
  if (!Number.isFinite(timestamp)) {
    throw new TypeError(
      "timestamp must be a finite number"
    );
  }

  const milliseconds =
    unit === "seconds"
      ? timestamp * 1000
      : timestamp;

  const date = new Date(milliseconds);

  validateDate(date);

  return date;
}

export function toISOString(date: Date): string {
  validateDate(date);

  return date.toISOString();
}

export function fromISOString(value: string): Date {
  if (typeof value !== "string") {
    throw new TypeError(
      "ISO value must be a string"
    );
  }

  const date = new Date(value);

  validateDate(date);

  return date;
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