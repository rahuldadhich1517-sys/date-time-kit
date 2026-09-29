export interface ISO8601Duration {
  years?: number;
  months?: number;
  weeks?: number;
  days?: number;
  hours?: number;
  minutes?: number;
  seconds?: number;
}

const ISO_DURATION_REGEX =
  /^P(?:(\d+(?:\.\d+)?)Y)?(?:(\d+(?:\.\d+)?)M)?(?:(\d+(?:\.\d+)?)W)?(?:(\d+(?:\.\d+)?)D)?(?:T(?:(\d+(?:\.\d+)?)H)?(?:(\d+(?:\.\d+)?)M)?(?:(\d+(?:\.\d+)?)S)?)?$/;

export function parseISO8601Duration(value: string): ISO8601Duration {
  if (typeof value !== "string") {
    throw new TypeError("ISO 8601 duration must be a string");
  }

  const trimmed = value.trim();

  if (!trimmed || trimmed === "P" || trimmed === "PT") {
    throw new RangeError("invalid ISO 8601 duration");
  }

  const match = trimmed.match(ISO_DURATION_REGEX);
  if (!match) {
    throw new RangeError("invalid ISO 8601 duration");
  }

  // Ensure at least one capture group matched
  const [
    ,
    yearsStr,
    monthsStr,
    weeksStr,
    daysStr,
    hoursStr,
    minutesStr,
    secondsStr,
  ] = match;

  const hasAny = [
    yearsStr,
    monthsStr,
    weeksStr,
    daysStr,
    hoursStr,
    minutesStr,
    secondsStr,
  ].some((v) => v !== undefined);

  if (!hasAny) {
    throw new RangeError("invalid ISO 8601 duration");
  }

  const result: ISO8601Duration = {};

  if (yearsStr !== undefined) result.years = Number(yearsStr);
  if (monthsStr !== undefined) result.months = Number(monthsStr);
  if (weeksStr !== undefined) result.weeks = Number(weeksStr);
  if (daysStr !== undefined) result.days = Number(daysStr);
  if (hoursStr !== undefined) result.hours = Number(hoursStr);
  if (minutesStr !== undefined) result.minutes = Number(minutesStr);
  if (secondsStr !== undefined) result.seconds = Number(secondsStr);

  return result;
}

export function buildISO8601Duration(
  duration: Partial<ISO8601Duration>
): string {
  if (!duration || typeof duration !== "object") {
    throw new TypeError("duration must be an object");
  }

  validateComponent(duration.years, "years");
  validateComponent(duration.months, "months");
  validateComponent(duration.weeks, "weeks");
  validateComponent(duration.days, "days");
  validateComponent(duration.hours, "hours");
  validateComponent(duration.minutes, "minutes");
  validateComponent(duration.seconds, "seconds");

  let datePart = "";
  if (duration.years) datePart += `${duration.years}Y`;
  if (duration.months) datePart += `${duration.months}M`;
  if (duration.weeks) datePart += `${duration.weeks}W`;
  if (duration.days) datePart += `${duration.days}D`;

  let timePart = "";
  if (duration.hours) timePart += `${duration.hours}H`;
  if (duration.minutes) timePart += `${duration.minutes}M`;
  if (duration.seconds) timePart += `${duration.seconds}S`;

  if (!datePart && !timePart) {
    // If explicit seconds: 0
    if (duration.seconds === 0) return "PT0S";
    if (duration.days === 0) return "P0D";
    return "PT0S";
  }

  return `P${datePart}${timePart ? `T${timePart}` : ""}`;
}

function validateComponent(val: unknown, name: string): void {
  if (val === undefined) return;
  if (typeof val !== "number" || !Number.isFinite(val) || val < 0) {
    throw new RangeError(`${name} must be a non-negative number`);
  }
}
