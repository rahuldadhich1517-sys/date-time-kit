import { parseDateInput, validateTimezone } from "../internal/validation.js";
import { getTimezoneParts } from "../internal/timezone-utils.js";

export interface DaysUntilOptions {
  from?: Date | string | number;
  inclusive?: boolean;
  timeZone?: string;
}

export function daysUntil(
  target: Date | string | number,
  options: DaysUntilOptions = {}
): number {
  const targetDate = parseDateInput(target, "target");
  const fromDate = options.from !== undefined
    ? parseDateInput(options.from, "from")
    : new Date();

  if (options.timeZone !== undefined) {
    validateTimezone(options.timeZone);
  }

  const targetCal = getCalendarDate(targetDate, options.timeZone);
  const fromCal = getCalendarDate(fromDate, options.timeZone);

  const diffMs = targetCal.getTime() - fromCal.getTime();
  const diffDays = Math.round(diffMs / 86400000);

  if (options.inclusive) {
    if (diffDays >= 0) {
      return diffDays + 1;
    }
  }

  return diffDays;
}

function getCalendarDate(date: Date, timeZone?: string): Date {
  if (timeZone) {
    const parts = getTimezoneParts(date, timeZone);
    return new Date(Date.UTC(parts.year, parts.month - 1, parts.day));
  }

  return new Date(
    Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate())
  );
}
