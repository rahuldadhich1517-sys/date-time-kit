import { parseDateInput } from "../internal/validation.js";

export interface DateDuration {
  years: number;
  months: number;
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  milliseconds: number;
  totalDays: number;
  totalHours: number;
  totalMinutes: number;
  totalSeconds: number;
  totalMilliseconds: number;
  isNegative: boolean;
}

export function calculateDateDuration(
  startDate: Date | string | number,
  endDate: Date | string | number
): DateDuration {
  const d1 = parseDateInput(startDate, "startDate");
  const d2 = parseDateInput(endDate, "endDate");

  const diffMs = d2.getTime() - d1.getTime();
  const isNegative = diffMs < 0;

  const start = isNegative ? d2 : d1;
  const end = isNegative ? d1 : d2;

  const absTotalMs = end.getTime() - start.getTime();

  let cursor = new Date(start.getTime());

  // 1. Calculate calendar years
  let years = 0;
  while (true) {
    const nextYear = cursor.getUTCFullYear() + 1;
    const testDate = addCalendarMonths(cursor, 12);
    if (testDate.getTime() <= end.getTime()) {
      cursor = testDate;
      years++;
    } else {
      break;
    }
  }

  // 2. Calculate calendar months
  let months = 0;
  while (true) {
    const testDate = addCalendarMonths(cursor, 1);
    if (testDate.getTime() <= end.getTime()) {
      cursor = testDate;
      months++;
    } else {
      break;
    }
  }

  // 3. Calculate calendar days
  let days = 0;
  while (true) {
    const testDate = new Date(cursor.getTime() + 86400000);
    if (testDate.getTime() <= end.getTime()) {
      cursor = testDate;
      days++;
    } else {
      break;
    }
  }

  // 4. Remaining time
  let remainingMs = end.getTime() - cursor.getTime();
  const hours = Math.floor(remainingMs / 3600000);
  remainingMs %= 3600000;
  const minutes = Math.floor(remainingMs / 60000);
  remainingMs %= 60000;
  const seconds = Math.floor(remainingMs / 1000);
  const milliseconds = remainingMs % 1000;

  return {
    years,
    months,
    days,
    hours,
    minutes,
    seconds,
    milliseconds,
    totalDays: Math.floor(absTotalMs / 86400000),
    totalHours: Math.floor(absTotalMs / 3600000),
    totalMinutes: Math.floor(absTotalMs / 60000),
    totalSeconds: Math.floor(absTotalMs / 1000),
    totalMilliseconds: absTotalMs,
    isNegative,
  };
}

function addCalendarMonths(date: Date, numMonths: number): Date {
  const year = date.getUTCFullYear();
  const month = date.getUTCMonth();
  const day = date.getUTCDate();

  const targetMonthIndex = month + numMonths;
  const targetYear = year + Math.floor(targetMonthIndex / 12);
  const targetMonth = ((targetMonthIndex % 12) + 12) % 12;

  const daysInTargetMonth = new Date(
    Date.UTC(targetYear, targetMonth + 1, 0)
  ).getUTCDate();
  const targetDay = Math.min(day, daysInTargetMonth);

  return new Date(
    Date.UTC(
      targetYear,
      targetMonth,
      targetDay,
      date.getUTCHours(),
      date.getUTCMinutes(),
      date.getUTCSeconds(),
      date.getUTCMilliseconds()
    )
  );
}
