import { parseDateInput } from "../internal/validation.js";

export interface BusinessDaysOptions {
  weekendDays?: number[];
  holidays?: (Date | string | number)[];
  inclusive?: boolean;
}

const DEFAULT_WEEKENDS = [0, 6]; // Sunday, Saturday

export function countBusinessDays(
  startDate: Date | string | number,
  endDate: Date | string | number,
  options: BusinessDaysOptions = {}
): number {
  const start = parseDateInput(startDate, "startDate");
  const end = parseDateInput(endDate, "endDate");

  const startDay = toCalendarDate(start);
  const endDay = toCalendarDate(end);

  if (startDay.getTime() > endDay.getTime()) {
    throw new RangeError("start date must be before end date");
  }

  const weekendSet = new Set(options.weekendDays ?? DEFAULT_WEEKENDS);
  const holidaySet = normalizeHolidays(options.holidays);

  let count = 0;
  const cursor = new Date(startDay.getTime());

  // If inclusive is false, the range is [start, end)
  // If inclusive is true, the range is [start, end]
  const inclusive = options.inclusive ?? false;

  while (
    inclusive
      ? cursor.getTime() <= endDay.getTime()
      : cursor.getTime() < endDay.getTime()
  ) {
    const dayOfWeek = cursor.getUTCDay();
    const isoDateKey = toISODateKey(cursor);

    if (!weekendSet.has(dayOfWeek) && !holidaySet.has(isoDateKey)) {
      count++;
    }

    cursor.setUTCDate(cursor.getUTCDate() + 1);
  }

  return count;
}

export function isBusinessDay(
  date: Date | string | number,
  options: Omit<BusinessDaysOptions, "inclusive"> = {}
): boolean {
  const d = parseDateInput(date, "date");
  const cal = toCalendarDate(d);
  const weekendSet = new Set(options.weekendDays ?? DEFAULT_WEEKENDS);
  const holidaySet = normalizeHolidays(options.holidays);

  const dayOfWeek = cal.getUTCDay();
  const isoKey = toISODateKey(cal);

  return !weekendSet.has(dayOfWeek) && !holidaySet.has(isoKey);
}

export function addBusinessDays(
  startDate: Date | string | number,
  days: number,
  options: Omit<BusinessDaysOptions, "inclusive"> = {}
): Date {
  if (!Number.isInteger(days)) {
    throw new RangeError("days must be an integer");
  }

  const start = parseDateInput(startDate, "startDate");
  const cursor = toCalendarDate(start);

  if (days === 0) {
    return new Date(start.getTime());
  }

  const direction = days > 0 ? 1 : -1;
  let remaining = Math.abs(days);

  const weekendSet = new Set(options.weekendDays ?? DEFAULT_WEEKENDS);
  const holidaySet = normalizeHolidays(options.holidays);

  while (remaining > 0) {
    cursor.setUTCDate(cursor.getUTCDate() + direction);
    const dayOfWeek = cursor.getUTCDay();
    const isoKey = toISODateKey(cursor);

    if (!weekendSet.has(dayOfWeek) && !holidaySet.has(isoKey)) {
      remaining--;
    }
  }

  // Preserve original time of day if start was Date
  return new Date(
    Date.UTC(
      cursor.getUTCFullYear(),
      cursor.getUTCMonth(),
      cursor.getUTCDate(),
      start.getUTCHours(),
      start.getUTCMinutes(),
      start.getUTCSeconds(),
      start.getUTCMilliseconds()
    )
  );
}

export function getBusinessDays(
  startDate: Date | string | number,
  endDate: Date | string | number,
  options: BusinessDaysOptions = {}
): Date[] {
  const start = parseDateInput(startDate, "startDate");
  const end = parseDateInput(endDate, "endDate");

  const startDay = toCalendarDate(start);
  const endDay = toCalendarDate(end);

  if (startDay.getTime() > endDay.getTime()) {
    throw new RangeError("start date must be before end date");
  }

  const weekendSet = new Set(options.weekendDays ?? DEFAULT_WEEKENDS);
  const holidaySet = normalizeHolidays(options.holidays);

  const result: Date[] = [];
  const cursor = new Date(startDay.getTime());
  const inclusive = options.inclusive ?? false;

  while (
    inclusive
      ? cursor.getTime() <= endDay.getTime()
      : cursor.getTime() < endDay.getTime()
  ) {
    const dayOfWeek = cursor.getUTCDay();
    const isoDateKey = toISODateKey(cursor);

    if (!weekendSet.has(dayOfWeek) && !holidaySet.has(isoDateKey)) {
      result.push(new Date(cursor.getTime()));
    }

    cursor.setUTCDate(cursor.getUTCDate() + 1);
  }

  return result;
}

function toCalendarDate(date: Date): Date {
  return new Date(
    Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate())
  );
}

function toISODateKey(date: Date): string {
  const year = date.getUTCFullYear();
  const month = String(date.getUTCMonth() + 1).padStart(2, "0");
  const day = String(date.getUTCDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function normalizeHolidays(
  holidays?: (Date | string | number)[]
): Set<string> {
  const set = new Set<string>();
  if (!holidays) return set;

  for (const h of holidays) {
    const parsed = parseDateInput(h, "holiday");
    set.add(toISODateKey(toCalendarDate(parsed)));
  }

  return set;
}
