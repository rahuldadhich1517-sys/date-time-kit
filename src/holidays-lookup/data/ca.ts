import type { Holiday } from "./types.js";
import {
  addDaysToDate,
  calculateEaster,
  nthDayOfWeekInMonth,
  toDateString,
} from "./utils.js";

function getVictoriaDay(year: number): string {
  // Monday preceding May 25
  for (let day = 24; day >= 18; day--) {
    const d = new Date(Date.UTC(year, 4, day)); // month 4 = May
    if (d.getUTCDay() === 1) {
      return toDateString(year, 5, day);
    }
  }
  return toDateString(year, 5, 24);
}

export function getCAHolidays(year: number): Holiday[] {
  const easter = calculateEaster(year);
  const easterDateStr = toDateString(year, easter.month, easter.day);
  const goodFridayStr = addDaysToDate(easterDateStr, -2);

  const holidays: Holiday[] = [
    {
      date: toDateString(year, 1, 1),
      name: "New Year's Day",
      country: "CA",
      type: "public",
    },
    {
      date: goodFridayStr,
      name: "Good Friday",
      country: "CA",
      type: "public",
    },
    {
      date: getVictoriaDay(year),
      name: "Victoria Day",
      country: "CA",
      type: "public",
    },
    {
      date: toDateString(year, 7, 1),
      name: "Canada Day",
      country: "CA",
      type: "national",
    },
    {
      date: nthDayOfWeekInMonth(year, 9, 1, 1), // 1st Mon in Sep
      name: "Labour Day",
      country: "CA",
      type: "public",
    },
    {
      date: toDateString(year, 9, 30),
      name: "National Day for Truth and Reconciliation",
      country: "CA",
      type: "public",
    },
    {
      date: nthDayOfWeekInMonth(year, 10, 1, 2), // 2nd Mon in Oct
      name: "Thanksgiving Day",
      country: "CA",
      type: "public",
    },
    {
      date: toDateString(year, 11, 11),
      name: "Remembrance Day",
      country: "CA",
      type: "public",
    },
    {
      date: toDateString(year, 12, 25),
      name: "Christmas Day",
      country: "CA",
      type: "public",
    },
    {
      date: toDateString(year, 12, 26),
      name: "Boxing Day",
      country: "CA",
      type: "public",
    },
  ];

  return holidays.sort((a, b) => a.date.localeCompare(b.date));
}
