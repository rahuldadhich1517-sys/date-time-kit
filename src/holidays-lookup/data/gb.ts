import type { Holiday } from "./types.js";
import {
  addDaysToDate,
  calculateEaster,
  lastDayOfWeekInMonth,
  nthDayOfWeekInMonth,
  toDateString,
} from "./utils.js";

export function getGBHolidays(year: number): Holiday[] {
  const easter = calculateEaster(year);
  const easterDateStr = toDateString(year, easter.month, easter.day);
  const goodFridayStr = addDaysToDate(easterDateStr, -2);
  const easterMondayStr = addDaysToDate(easterDateStr, 1);

  const holidays: Holiday[] = [
    {
      date: toDateString(year, 1, 1),
      name: "New Year's Day",
      country: "GB",
      type: "bank",
    },
    {
      date: goodFridayStr,
      name: "Good Friday",
      country: "GB",
      type: "bank",
    },
    {
      date: easterMondayStr,
      name: "Easter Monday",
      country: "GB",
      type: "bank",
    },
    {
      date: nthDayOfWeekInMonth(year, 5, 1, 1), // 1st Monday in May
      name: "Early May Bank Holiday",
      country: "GB",
      type: "bank",
    },
    {
      date: lastDayOfWeekInMonth(year, 5, 1), // Last Monday in May
      name: "Spring Bank Holiday",
      country: "GB",
      type: "bank",
    },
    {
      date: lastDayOfWeekInMonth(year, 8, 1), // Last Monday in August
      name: "Summer Bank Holiday",
      country: "GB",
      type: "bank",
    },
    {
      date: toDateString(year, 12, 25),
      name: "Christmas Day",
      country: "GB",
      type: "bank",
    },
    {
      date: toDateString(year, 12, 26),
      name: "Boxing Day",
      country: "GB",
      type: "bank",
    },
  ];

  return holidays.sort((a, b) => a.date.localeCompare(b.date));
}
