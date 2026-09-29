import { getAUHolidays } from "./au.js";
import { getCAHolidays } from "./ca.js";
import { getGBHolidays } from "./gb.js";
import { getIndiaHolidays } from "./in.js";
import type { Holiday, HolidayCountry } from "./types.js";
import { getUSHolidays } from "./us.js";

export * from "./types.js";

const COUNTRY_MAP: Record<string, HolidayCountry> = {
  IN: "IN",
  INDIA: "IN",
  US: "US",
  USA: "US",
  "UNITED STATES": "US",
  GB: "GB",
  UK: "GB",
  "UNITED KINGDOM": "GB",
  CA: "CA",
  CAN: "CA",
  CANADA: "CA",
  AU: "AU",
  AUS: "AU",
  AUSTRALIA: "AU",
};

export function normalizeHolidayCountry(country: string): HolidayCountry {
  if (typeof country !== "string") {
    throw new TypeError("country must be a string");
  }

  const normalized = country.trim().toUpperCase();
  const matched = COUNTRY_MAP[normalized];

  if (!matched) {
    throw new RangeError(
      `Unsupported holiday country: ${country}. Supported countries: IN, US, GB, CA, AU`
    );
  }

  return matched;
}

export function getCountryHolidays(
  country: HolidayCountry,
  year: number
): Holiday[] {
  switch (country) {
    case "IN":
      return getIndiaHolidays(year);
    case "US":
      return getUSHolidays(year);
    case "GB":
      return getGBHolidays(year);
    case "CA":
      return getCAHolidays(year);
    case "AU":
      return getAUHolidays(year);
  }
}

export const SUPPORTED_COUNTRIES: HolidayCountry[] = [
  "IN",
  "US",
  "GB",
  "CA",
  "AU",
];
