import {
  getTimezoneOffsetMinutes,
  parseTimezoneOffset,
} from "../internal/timezone-utils.js";
import { isValidTimezone } from "../internal/validation.js";

export { isValidTimezone };

export type PlaceTimezoneMapping = Record<string, string>;

// Curated list of major IANA timezones across continents
export const COMMON_TIMEZONES: readonly string[] = [
  "Africa/Cairo",
  "Africa/Johannesburg",
  "Africa/Lagos",
  "Africa/Nairobi",
  "America/Anchorage",
  "America/Bogota",
  "America/Buenos_Aires",
  "America/Chicago",
  "America/Denver",
  "America/Halifax",
  "America/Lima",
  "America/Los_Angeles",
  "America/Mexico_City",
  "America/New_York",
  "America/Phoenix",
  "America/Santiago",
  "America/Sao_Paulo",
  "America/Toronto",
  "America/Vancouver",
  "Asia/Bangkok",
  "Asia/Colombo",
  "Asia/Dhaka",
  "Asia/Dubai",
  "Asia/Hong_Kong",
  "Asia/Jakarta",
  "Asia/Karachi",
  "Asia/Kathmandu",
  "Asia/Kolkata",
  "Asia/Manila",
  "Asia/Riyadh",
  "Asia/Seoul",
  "Asia/Shanghai",
  "Asia/Singapore",
  "Asia/Taipei",
  "Asia/Tokyo",
  "Atlantic/Reykjavik",
  "Australia/Adelaide",
  "Australia/Brisbane",
  "Australia/Darwin",
  "Australia/Melbourne",
  "Australia/Perth",
  "Australia/Sydney",
  "Europe/Amsterdam",
  "Europe/Berlin",
  "Europe/Brussels",
  "Europe/Dublin",
  "Europe/Helsinki",
  "Europe/Istanbul",
  "Europe/Lisbon",
  "Europe/London",
  "Europe/Madrid",
  "Europe/Paris",
  "Europe/Rome",
  "Europe/Stockholm",
  "Europe/Vienna",
  "Europe/Warsaw",
  "Europe/Zurich",
  "Pacific/Auckland",
  "Pacific/Fiji",
  "Pacific/Honolulu",
  "UTC",
] as const;

// Curated local mapping of places to IANA timezones
const PLACE_TO_TIMEZONE: Record<string, string> = {
  // India
  india: "Asia/Kolkata",
  delhi: "Asia/Kolkata",
  "new delhi": "Asia/Kolkata",
  mumbai: "Asia/Kolkata",
  bangalore: "Asia/Kolkata",
  bengaluru: "Asia/Kolkata",
  kolkata: "Asia/Kolkata",
  chennai: "Asia/Kolkata",
  hyderabad: "Asia/Kolkata",

  // United Kingdom
  london: "Europe/London",
  "united kingdom": "Europe/London",
  uk: "Europe/London",
  england: "Europe/London",
  scotland: "Europe/London",
  wales: "Europe/London",

  // United States
  "new york": "America/New_York",
  nyc: "America/New_York",
  "united states": "America/New_York",
  usa: "America/New_York",
  us: "America/New_York",
  boston: "America/New_York",
  miami: "America/New_York",
  "washington dc": "America/New_York",
  chicago: "America/Chicago",
  houston: "America/Chicago",
  dallas: "America/Chicago",
  denver: "America/Denver",
  phoenix: "America/Phoenix",
  arizona: "America/Phoenix",
  "los angeles": "America/Los_Angeles",
  california: "America/Los_Angeles",
  "san francisco": "America/Los_Angeles",
  seattle: "America/Los_Angeles",
  hawaii: "Pacific/Honolulu",
  honolulu: "Pacific/Honolulu",
  anchorage: "America/Anchorage",
  alaska: "America/Anchorage",

  // Japan
  tokyo: "Asia/Tokyo",
  japan: "Asia/Tokyo",
  osaka: "Asia/Tokyo",
  kyoto: "Asia/Tokyo",

  // Europe
  paris: "Europe/Paris",
  france: "Europe/Paris",
  berlin: "Europe/Berlin",
  germany: "Europe/Berlin",
  frankfurt: "Europe/Berlin",
  amsterdam: "Europe/Amsterdam",
  netherlands: "Europe/Amsterdam",
  rome: "Europe/Rome",
  italy: "Europe/Rome",
  madrid: "Europe/Madrid",
  spain: "Europe/Madrid",
  dublin: "Europe/Dublin",
  ireland: "Europe/Dublin",
  zurich: "Europe/Zurich",
  switzerland: "Europe/Zurich",
  vienna: "Europe/Vienna",
  austria: "Europe/Vienna",
  warsaw: "Europe/Warsaw",
  poland: "Europe/Warsaw",
  stockholm: "Europe/Stockholm",
  sweden: "Europe/Stockholm",

  // Canada
  toronto: "America/Toronto",
  canada: "America/Toronto",
  montreal: "America/Toronto",
  ottawa: "America/Toronto",
  vancouver: "America/Vancouver",

  // Australia
  sydney: "Australia/Sydney",
  australia: "Australia/Sydney",
  melbourne: "Australia/Melbourne",
  brisbane: "Australia/Brisbane",
  perth: "Australia/Perth",
  adelaide: "Australia/Adelaide",

  // Asia / Middle East
  dubai: "Asia/Dubai",
  uae: "Asia/Dubai",
  "united arab emirates": "Asia/Dubai",
  singapore: "Asia/Singapore",
  "hong kong": "Asia/Hong_Kong",
  seoul: "Asia/Seoul",
  "south korea": "Asia/Seoul",
  korea: "Asia/Seoul",
  shanghai: "Asia/Shanghai",
  beijing: "Asia/Shanghai",
  china: "Asia/Shanghai",
  bangkok: "Asia/Bangkok",
  thailand: "Asia/Bangkok",
  jakarta: "Asia/Jakarta",
  indonesia: "Asia/Jakarta",
  riyadh: "Asia/Riyadh",
  "saudi arabia": "Asia/Riyadh",
  colombo: "Asia/Colombo",
  "sri lanka": "Asia/Colombo",
  kathmandu: "Asia/Kathmandu",
  nepal: "Asia/Kathmandu",
  dhaka: "Asia/Dhaka",
  bangladesh: "Asia/Dhaka",

  // Others
  "sao paulo": "America/Sao_Paulo",
  brazil: "America/Sao_Paulo",
  "buenos aires": "America/Buenos_Aires",
  argentina: "America/Buenos_Aires",
  cairo: "Africa/Cairo",
  egypt: "Africa/Cairo",
  johannesburg: "Africa/Johannesburg",
  "south africa": "Africa/Johannesburg",
  auckland: "Pacific/Auckland",
  "new zealand": "Pacific/Auckland",
};

export function findTimezoneByPlace(place: string): string | null {
  if (typeof place !== "string") {
    throw new TypeError("place must be a string");
  }

  const normalized = place.trim().toLowerCase();
  if (!normalized) {
    return null;
  }

  // Direct lookup
  if (PLACE_TO_TIMEZONE[normalized]) {
    return PLACE_TO_TIMEZONE[normalized];
  }

  // Check if place is already an IANA timezone identifier
  if (isValidTimezone(place.trim())) {
    return place.trim();
  }

  return null;
}

export function findTimezonesByOffset(
  offset: string | number,
  referenceDate: Date = new Date()
): string[] {
  const targetOffsetMinutes = parseTimezoneOffset(offset);

  const matchedZones: string[] = [];

  for (const tz of COMMON_TIMEZONES) {
    try {
      const offsetMins = getTimezoneOffsetMinutes(referenceDate, tz);
      if (offsetMins === targetOffsetMinutes) {
        matchedZones.push(tz);
      }
    } catch {
      // ignore
    }
  }

  return matchedZones;
}
