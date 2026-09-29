import type { Holiday } from "./types.js";
import { toDateString } from "./utils.js";

// Specific lunar/festival holiday dates for India (2024-2028)
const IN_FESTIVAL_DATES: Record<number, { date: string; name: string }[]> = {
  2024: [
    { date: "2024-03-25", name: "Holi" },
    { date: "2024-04-11", name: "Eid-ul-Fitr" },
    { date: "2024-10-31", name: "Diwali" },
  ],
  2025: [
    { date: "2025-03-14", name: "Holi" },
    { date: "2025-03-31", name: "Eid-ul-Fitr" },
    { date: "2025-10-20", name: "Diwali" },
  ],
  2026: [
    { date: "2026-03-04", name: "Holi" },
    { date: "2026-03-20", name: "Eid-ul-Fitr" },
    { date: "2026-11-08", name: "Diwali" },
  ],
  2027: [
    { date: "2027-03-22", name: "Holi" },
    { date: "2027-03-10", name: "Eid-ul-Fitr" },
    { date: "2027-10-29", name: "Diwali" },
  ],
  2028: [
    { date: "2028-03-11", name: "Holi" },
    { date: "2028-02-27", name: "Eid-ul-Fitr" },
    { date: "2028-10-17", name: "Diwali" },
  ],
};

export function getIndiaHolidays(year: number): Holiday[] {
  const holidays: Holiday[] = [
    {
      date: toDateString(year, 1, 1),
      name: "New Year's Day",
      country: "IN",
      type: "public",
    },
    {
      date: toDateString(year, 1, 26),
      name: "Republic Day",
      country: "IN",
      type: "national",
    },
    {
      date: toDateString(year, 5, 1),
      name: "Labour Day",
      country: "IN",
      type: "public",
    },
    {
      date: toDateString(year, 8, 15),
      name: "Independence Day",
      country: "IN",
      type: "national",
    },
    {
      date: toDateString(year, 10, 2),
      name: "Mahatma Gandhi Jayanti",
      country: "IN",
      type: "national",
    },
    {
      date: toDateString(year, 12, 25),
      name: "Christmas Day",
      country: "IN",
      type: "public",
    },
  ];

  const festivals = IN_FESTIVAL_DATES[year];
  if (festivals) {
    for (const fest of festivals) {
      holidays.push({
        date: fest.date,
        name: fest.name,
        country: "IN",
        type: "public",
      });
    }
  }

  return holidays.sort((a, b) => a.date.localeCompare(b.date));
}
