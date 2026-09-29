export function validateDate(
  date: unknown,
  name = "date"
): asserts date is Date {
  if (!(date instanceof Date)) {
    throw new TypeError(`${name} must be a Date instance`);
  }

  if (Number.isNaN(date.getTime())) {
    throw new RangeError(name === "date" ? "Invalid date" : `Invalid ${name}`);
  }
}

export function parseDateInput(
  input: Date | string | number,
  name = "date"
): Date {
  if (input instanceof Date) {
    validateDate(input, name);
    return new Date(input.getTime());
  }

  if (typeof input === "string") {
    if (input.trim().length === 0) {
      throw new RangeError(`${name} cannot be empty`);
    }
    const parsed = new Date(input);
    if (Number.isNaN(parsed.getTime())) {
      throw new RangeError(name === "date" ? "Invalid date" : `Invalid ${name}`);
    }
    return parsed;
  }

  if (typeof input === "number") {
    if (!Number.isFinite(input)) {
      throw new TypeError(`${name} must be a finite number`);
    }
    const parsed = new Date(input);
    if (Number.isNaN(parsed.getTime())) {
      throw new RangeError(name === "date" ? "Invalid date" : `Invalid ${name}`);
    }
    return parsed;
  }

  throw new TypeError(`${name} must be a Date, string, or number`);
}

export function validateTimezone(timeZone: unknown): void {
  if (typeof timeZone !== "string") {
    throw new TypeError("timeZone must be a string");
  }

  if (timeZone.trim().length === 0) {
    throw new RangeError("timeZone cannot be empty");
  }

  try {
    new Intl.DateTimeFormat("en-US", { timeZone });
  } catch {
    throw new RangeError(`Invalid timezone: ${timeZone}`);
  }
}

export function isValidTimezone(timeZone: unknown): boolean {
  if (typeof timeZone !== "string" || timeZone.trim().length === 0) {
    return false;
  }
  try {
    new Intl.DateTimeFormat("en-US", { timeZone });
    return true;
  } catch {
    return false;
  }
}
