import type { Holiday } from "./types.js";
import {
  lastDayOfWeekInMonth,
  nthDayOfWeekInMonth,
  toDateString,
} from "./utils.js";

export function getUSHolidays(year: number): Holiday[] {
  const holidays: Holiday[] = [
    {
      date: toDateString(year, 1, 1),
      name: "New Year's Day",
      country: "US",
      type: "public",
    },
    {
      date: nthDayOfWeekInMonth(year, 1, 1, 3), // 3rd Monday in Jan
      name: "Martin Luther King Jr. Day",
      country: "US",
      type: "public",
    },
    {
      date: nthDayOfWeekInMonth(year, 2, 1, 3), // 3rd Monday in Feb
      name: "Presidents' Day",
      country: "US",
      type: "public",
    },
    {
      date: lastDayOfWeekInMonth(year, 5, 1), // Last Monday in May
      name: "Memorial Day",
      country: "US",
      type: "public",
    },
    {
      date: toDateString(year, 6, 19),
      name: "Juneteenth National Independence Day",
      country: "US",
      type: "public",
    },
    {
      date: toDateString(year, 7, 4),
      name: "Independence Day",
      country: "US",
      type: "national",
    },
    {
      date: nthDayOfWeekInMonth(year, 9, 1, 1), // 1st Monday in Sep
      name: "Labor Day",
      country: "US",
      type: "public",
    },
    {
      date: nthDayOfWeekInMonth(year, 10, 1, 2), // 2nd Monday in Oct
      name: "Columbus Day",
      country: "US",
      type: "public",
    },
    {
      date: toDateString(year, 11, 11),
      name: "Veterans Day",
      country: "US",
      type: "public",
    },
    {
      date: nthDayOfWeekInMonth(year, 11, 4, 4), // 4th Thursday in Nov
      name: "Thanksgiving Day",
      country: "US",
      type: "public",
    },
    {
      date: toDateString(year, 12, 25),
      name: "Christmas Day",
      country: "US",
      type: "public",
    },
  ];

  return holidays.sort((a, b) => a.date.localeCompare(b.date));
}
