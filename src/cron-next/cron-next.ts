import {
  parseCron,
  type ParsedCron,
} from "../cron-parser/index.js";

export interface CronNextOptions {
  maxIterations?: number;
}

const DEFAULT_MAX_ITERATIONS = 525600;

export function nextCronRun(
  expression: string,
  fromDate: Date = new Date(),
  options: CronNextOptions = {}
): Date {
  const runs = nextCronRuns(
    expression,
    fromDate,
    {
      ...options,
      count: 1,
    }
  );

  return runs[0];
}

export function nextCronRuns(
  expression: string,
  fromDate: Date = new Date(),
  options: CronNextOptions & {
    count?: number;
  } = {}
): Date[] {
  validateDate(fromDate);

  const count = options.count ?? 5;

  if (
    !Number.isInteger(count) ||
    count < 1
  ) {
    throw new RangeError(
      "count must be a positive integer"
    );
  }

  const maxIterations =
    options.maxIterations ??
    DEFAULT_MAX_ITERATIONS;

  if (
    !Number.isInteger(maxIterations) ||
    maxIterations < 1
  ) {
    throw new RangeError(
      "maxIterations must be a positive integer"
    );
  }

  const cron = parseCron(expression);

  const results: Date[] = [];

  const cursor = new Date(
    fromDate.getTime()
  );

  cursor.setSeconds(0, 0);
  cursor.setMinutes(
    cursor.getMinutes() + 1
  );

  let iterations = 0;

  while (
    results.length < count &&
    iterations < maxIterations
  ) {
    iterations++;

    if (matchesCron(cursor, cron)) {
      results.push(
        new Date(cursor.getTime())
      );
    }

    cursor.setMinutes(
      cursor.getMinutes() + 1
    );
  }

  if (results.length < count) {
    throw new RangeError(
      `Unable to find ${count} scheduled run(s) within the search limit`
    );
  }

  return results;
}

function matchesCron(
  date: Date,
  cron: ParsedCron
): boolean {
  const minute = date.getMinutes();
  const hour = date.getHours();
  const dayOfMonth = date.getDate();
  const month = date.getMonth() + 1;
  const dayOfWeek = date.getDay();

  if (
    !cron.fields.minute.values.includes(
      minute
    )
  ) {
    return false;
  }

  if (
    !cron.fields.hour.values.includes(
      hour
    )
  ) {
    return false;
  }

  if (
    !cron.fields.month.values.includes(
      month
    )
  ) {
    return false;
  }

  const dayOfMonthMatches =
    cron.fields.dayOfMonth.values.includes(
      dayOfMonth
    );

  const dayOfWeekMatches =
    cron.fields.dayOfWeek.values.includes(
      dayOfWeek
    );

  const dayOfMonthWildcard =
    cron.fields.dayOfMonth.expression === "*";

  const dayOfWeekWildcard =
    cron.fields.dayOfWeek.expression === "*";

  if (
    dayOfMonthWildcard &&
    dayOfWeekWildcard
  ) {
    return true;
  }

  if (dayOfMonthWildcard) {
    return dayOfWeekMatches;
  }

  if (dayOfWeekWildcard) {
    return dayOfMonthMatches;
  }

  return (
    dayOfMonthMatches ||
    dayOfWeekMatches
  );
}

function validateDate(
  date: Date
): void {
  if (!(date instanceof Date)) {
    throw new TypeError(
      "fromDate must be a Date instance"
    );
  }

  if (Number.isNaN(date.getTime())) {
    throw new RangeError(
      "Invalid fromDate"
    );
  }
}