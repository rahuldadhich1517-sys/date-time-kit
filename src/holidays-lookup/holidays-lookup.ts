import { parseDateInput } from "../internal/validation.js";
import {
  getCountryHolidays,
  normalizeHolidayCountry,
  SUPPORTED_COUNTRIES,
  type Holiday,
  type HolidayCountry,
} from "./data/index.js";

export function getHolidays(country: string, year: number): Holiday[] {
  const normalizedCountry = normalizeHolidayCountry(country);

  if (!Number.isInteger(year) || year < 1000 || year > 9999) {
    throw new RangeError("year must be a 4-digit integer");
  }

  return getCountryHolidays(normalizedCountry, year);
}

export function isHoliday(
  date: Date | string | number,
  country: string
): boolean {
  return getHoliday(date, country) !== null;
}

export function getHoliday(
  date: Date | string | number,
  country: string
): Holiday | null {
  const parsed = parseDateInput(date, "date");
  const normalizedCountry = normalizeHolidayCountry(country);
  const year = parsed.getUTCFullYear();
  const dateKey = toISODateKey(parsed);

  const holidays = getCountryHolidays(normalizedCountry, year);
  return holidays.find((h) => h.date === dateKey) ?? null;
}

export function getSupportedHolidayCountries(): string[] {
  return [...SUPPORTED_COUNTRIES];
}

function toISODateKey(date: Date): string {
  const year = date.getUTCFullYear();
  const month = String(date.getUTCMonth() + 1).padStart(2, "0");
  const day = String(date.getUTCDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}
