import type { Holiday } from "./types.js";
import {
  addDaysToDate,
  calculateEaster,
  nthDayOfWeekInMonth,
  toDateString,
} from "./utils.js";

export function getAUHolidays(year: number): Holiday[] {
  const easter = calculateEaster(year);
  const easterDateStr = toDateString(year, easter.month, easter.day);
  const goodFridayStr = addDaysToDate(easterDateStr, -2);
  const easterMondayStr = addDaysToDate(easterDateStr, 1);

  const holidays: Holiday[] = [
    {
      date: toDateString(year, 1, 1),
      name: "New Year's Day",
      country: "AU",
      type: "public",
    },
    {
      date: toDateString(year, 1, 26),
      name: "Australia Day",
      country: "AU",
      type: "national",
    },
    {
      date: goodFridayStr,
      name: "Good Friday",
      country: "AU",
      type: "public",
    },
    {
      date: easterMondayStr,
      name: "Easter Monday",
      country: "AU",
      type: "public",
    },
    {
      date: toDateString(year, 4, 25),
      name: "Anzac Day",
      country: "AU",
      type: "national",
    },
    {
      date: nthDayOfWeekInMonth(year, 6, 1, 2), // 2nd Monday in June
      name: "King's Birthday",
      country: "AU",
      type: "public",
    },
    {
      date: toDateString(year, 12, 25),
      name: "Christmas Day",
      country: "AU",
      type: "public",
    },
    {
      date: toDateString(year, 12, 26),
      name: "Boxing Day",
      country: "AU",
      type: "public",
    },
  ];

  return holidays.sort((a, b) => a.date.localeCompare(b.date));
}
