# datetime-kit

[![npm version](https://img.shields.io/npm/v/%40rahul_dadhich15%2Fdatetime-kit.svg)](https://www.npmjs.com/package/@rahul_dadhich15/datetime-kit)
[![npm downloads](https://img.shields.io/npm/dm/%40rahul_dadhich15%2Fdatetime-kit.svg)](https://www.npmjs.com/package/@rahul_dadhich15/datetime-kit)
[![Runtime dependencies](https://img.shields.io/badge/runtime%20dependencies-0-brightgreen)](https://www.npmjs.com/package/@rahul_dadhich15/datetime-kit)
[![Modules](https://img.shields.io/badge/modules-ESM%20%2B%20CommonJS-blue)](https://www.npmjs.com/package/@rahul_dadhich15/datetime-kit)
[![Node.js](https://img.shields.io/badge/Node.js-16%2B-339933?logo=node.js&logoColor=white)](https://nodejs.org/)
[![license](https://img.shields.io/npm/l/%40rahul_dadhich15%2Fdatetime-kit.svg)](https://github.com/rahuldadhich1517-sys/date-time-toolkit/blob/main/LICENSE)
[![TypeScript](https://img.shields.io/badge/TypeScript-first-blue.svg)](https://www.typescriptlang.org/)

A lightweight, dependency-free TypeScript toolkit for dates, times, timestamps, durations, time zones, calendars, schedules, cron expressions, working days, holidays, calendar events, and world clocks.

The package publishes ESM and CommonJS entry points with TypeScript declarations. It targets ES2022 and uses built-in `Date`, `Intl`, and timer APIs. It does not declare a Node.js `engines` range; CI currently runs on Node.js 24. There is no dedicated browser bundle.

---

## Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Installation](#installation)
- [Quick Start](#quick-start)
- [API Reference](#api-reference)
  - [1. Timestamp](#1-timestamp)
  - [2. Date Formatting](#2-date-formatting)
  - [3. Relative Time](#3-relative-time)
  - [4. Timezone](#4-timezone)
  - [5. Cron Expressions](#5-cron-expressions)
  - [6. Business Days](#6-business-days)
  - [7. Countdown Timer](#7-countdown-timer)
  - [8. Date Duration](#8-date-duration)
  - [9. Days Until](#9-days-until)
  - [10. Discord Timestamp](#10-discord-timestamp)
  - [11. Hours Calculation](#11-hours-calculation)
  - [12. ICS Generation](#12-ics-generation)
  - [13. ISO 8601 Duration](#13-iso-8601-duration)
  - [14. Holidays Lookup](#14-holidays-lookup)
  - [15. Schedule Builder](#15-schedule-builder)
  - [16. Timezone Conversion](#16-timezone-conversion)
  - [17. Timezone Finder](#17-timezone-finder)
  - [18. Unix Timestamp](#18-unix-timestamp)
  - [19. World Clock](#19-world-clock)
- [TypeScript Types](#typescript-types)
- [Pitfalls & Limitations](#pitfalls--limitations)
- [Runtime Dependency Notes](#runtime-dependency-notes)
- [ESM & CommonJS Usage](#esm--commonjs-usage)
- [CI](#ci)
- [Contributing](#contributing)
- [License](#license)

---

## Overview

`@rahul_dadhich15/datetime-kit` groups its date/time utilities into 19 API areas. It relies on JavaScript built-ins, including `Date`, `Intl`, and timers, rather than runtime dependencies.

---

## Features

- **Zero runtime dependencies**: Pure TypeScript / modern JavaScript.
- **Dual module output**: ESM and CommonJS entry points with TypeScript declaration files.
- **Comprehensive coverage**:
  - Unix and ISO timestamps with seconds/milliseconds conversion helpers
  - Locale-aware date formatting and human relative times
  - IANA timezone conversion, offsets, place-to-zone matching, and DST transitions
  - Standard 5-field cron parsing, human descriptions, and next run calculations
  - Business days counting, weekend customization, and holiday exclusion
  - Countdown timers with start/pause/resume/stop lifecycle
  - Calendar-aware duration differences (distinguishing calendar units from absolute elapsed time)
  - Target countdowns with day boundaries and timezone awareness
  - Dynamic Discord timestamp markdown formatting
  - Time/hour arithmetic (adding, subtracting, parsing, and totaling)
  - iCalendar (`.ics`) event and subset recurrence generation
  - ISO 8601 duration parser and builder (`PnYnMnDTnHnMnS`)
  - Curated public holiday lookup for 5 countries
  - Daily schedule grid builder with slot durations and breaks
  - Multi-city world clocks

---

## Installation

```bash
npm install @rahul_dadhich15/datetime-kit
```

---

## Quick Start

```ts
import {
  toUnixTimestamp,
  formatDate,
  formatRelativeTime,
  convertTimezone,
  parseCron,
  countBusinessDays,
  createCountdown,
  calculateDateDuration,
  daysUntil,
  createDiscordTimestamp,
  addHours,
  generateICS,
  parseISO8601Duration,
  getHolidays,
  buildSchedule,
  findTimezonesByOffset,
  getWorldClock,
} from "@rahul_dadhich15/datetime-kit";

// 1. Format dates
formatDate(new Date(), { format: "medium", timeZone: "Asia/Kolkata" });

// 2. Count working days between two dates
countBusinessDays("2026-06-01", "2026-06-30", { inclusive: true });

// 3. Convert time across time zones
convertTimezone("2026-06-01T10:00:00", "Asia/Kolkata", "America/New_York");
// => "2026-06-01T00:30:00"

// 4. Generate Discord dynamic timestamp
createDiscordTimestamp(new Date(), "R");
// => "<t:1789128000:R>"

// 5. Build meeting schedule
buildSchedule({
  start: "09:00",
  end: "12:00",
  slotDuration: 45,
  breakDuration: 15,
});

// 6. World clock
getWorldClock(["Asia/Kolkata", "Europe/London", "America/New_York"]);
```

---

## API Reference

### 1. Timestamp

Convert between `Date` instances, Unix timestamps (seconds / milliseconds), and ISO 8601 strings.

- `toUnixTimestamp(date: Date, unit?: "seconds" | "milliseconds"): number`
- `fromUnixTimestamp(timestamp: number, unit?: "seconds" | "milliseconds"): Date`
- `toISOString(date: Date): string`
- `fromISOString(value: string): Date`

The timestamp unit defaults to `"milliseconds"`.

```ts
import { toUnixTimestamp, fromUnixTimestamp } from "@rahul_dadhich15/datetime-kit";

const date = new Date("2026-09-11T12:00:00Z");

toUnixTimestamp(date); // 1789128000000 (milliseconds)
toUnixTimestamp(date, "seconds"); // 1789128000

fromUnixTimestamp(1789128000, "seconds"); // Date object
```

---

### 2. Date Formatting

Format dates using native `Intl.DateTimeFormat`. The default locale is `"en-US"` and the default format is `"medium"`; `"iso"` returns `Date.prototype.toISOString()` output.

- `formatDate(date: Date, options?: DateFormatterOptions): string`

```ts
import { formatDate } from "@rahul_dadhich15/datetime-kit";

formatDate(new Date(), { format: "long", locale: "en-US", timeZone: "Asia/Kolkata" });
// "September 11, 2026"
```

Available formats: `"short" | "medium" | "long" | "full" | "iso"`.

---

### 3. Relative Time

Format relative time differences using native `Intl.RelativeTimeFormat`.

- `formatRelativeTime(date: Date, baseDate?: Date, options?: RelativeTimeOptions): string`

The default base date is now; locale, numeric style, and output style default to `"en-US"`, `"auto"`, and `"long"`. Differences under 10 seconds use the fixed English strings `"just now"` or `"in a few seconds"`.

```ts
import { formatRelativeTime } from "@rahul_dadhich15/datetime-kit";

const now = new Date();
const nextWeek = new Date(now.getTime() + 7 * 86400000);

formatRelativeTime(nextWeek, now); // "next week"
```

---

### 4. Timezone

Extract offsets, timezone names, or format dates in target timezones.

- `convertTimezone(date: Date, timeZone: string, options?: TimezoneFormatOptions): string`
- `convertTimezone(dateOrString: Date | string, fromTimezone: string, toTimezone: string, options?: TimezoneConvertOptions): string`
- `getTimezoneOffset(date: Date, timeZone: string): number` (returns offset in minutes)
- `getTimezoneName(date: Date, timeZone: string, locale?: string): string`

The formatted timezone overload defaults to locale `"en-US"` with medium date and time styles. `convertTimezoneBetween` returns `YYYY-MM-DDTHH:mm:ss` by default; pass formatting options for localized output.

```ts
import { convertTimezone, getTimezoneOffset, getTimezoneName } from "@rahul_dadhich15/datetime-kit";

const date = new Date("2026-01-15T12:00:00Z");

getTimezoneOffset(date, "Asia/Kolkata"); // 330
getTimezoneName(date, "Asia/Kolkata"); // "India Standard Time"
```

---

### 5. Cron Expressions

Parse, validate, explain, and compute upcoming execution dates for 5-field cron schedules. Fields accept numeric values, lists, ascending ranges, `*`, and steps over `*` or a range. Day-of-week values are `0` through `6` (Sunday through Saturday); named months/days and other cron extensions are not supported. Upcoming runs use the process's local timezone.

- `parseCron(expression: string): ParsedCron`
- `isValidCron(expression: string): boolean`
- `humanizeCron(expression: string): string`
- `nextCronRun(expression: string, fromDate?: Date, options?: CronNextOptions): Date`
- `nextCronRuns(expression: string, fromDate?: Date, options?: CronNextOptions & { count?: number }): Date[]`

`fromDate` defaults to now. `nextCronRuns` returns 5 results by default and searches at most 525,600 minutes; `nextCronRun` requests one result. Set `count` or `maxIterations` to change these limits.

```ts
import { parseCron, humanizeCron, nextCronRun } from "@rahul_dadhich15/datetime-kit";

parseCron("0 9 * * 1-5");
humanizeCron("0 9 * * 1-5"); // "Every weekday at 9:00 AM"
nextCronRun("0 9 * * 1-5"); // Next run as Date
```

---

### 6. Business Days

Count or generate business/working days while excluding weekends and holidays.

- `countBusinessDays(startDate: Date | string | number, endDate: Date | string | number, options?: BusinessDaysOptions): number`
- `isBusinessDay(date: Date | string | number, options?: Omit<BusinessDaysOptions, "inclusive">): boolean`
- `addBusinessDays(startDate: Date | string | number, days: number, options?: Omit<BusinessDaysOptions, "inclusive">): Date`
- `getBusinessDays(startDate: Date | string | number, endDate: Date | string | number, options?: BusinessDaysOptions): Date[]`

#### Options

```ts
interface BusinessDaysOptions {
  weekendDays?: number[]; // default: [0, 6] (Sunday=0, Saturday=6)
  holidays?: (Date | string | number)[];
  inclusive?: boolean; // default: false ([startDate, endDate))
}
```

Date inputs are compared by UTC calendar date. `addBusinessDays` preserves the UTC time of day when its `startDate` is a `Date`; date-only outputs from `getBusinessDays` are at midnight UTC.

#### Example

```ts
import { countBusinessDays, addBusinessDays } from "@rahul_dadhich15/datetime-kit";

// Exclusive [2026-06-01, 2026-06-05) -> 4 days
countBusinessDays("2026-06-01", "2026-06-05");

// Inclusive with custom holidays
countBusinessDays("2026-01-01", "2026-01-31", {
  holidays: ["2026-01-26"],
  inclusive: true,
}); // 21

// Add 5 business days
addBusinessDays("2026-06-05", 1); // 2026-06-08 (skips weekend)
```

---

### 7. Countdown Timer

Calculate countdown values and run live in-memory timers with lifecycle controls using standard timer APIs.

- `getCountdown(target: Date | string | number, baseDate?: Date | string | number): CountdownValue`
- `createCountdown(target: Date | string | number, options?: CountdownOptions): CountdownTimer`

#### Example

```ts
import { createCountdown, getCountdown } from "@rahul_dadhich15/datetime-kit";

// Static calculation
const value = getCountdown("2026-12-31T23:59:59Z");
console.log(value.days, value.hours, value.minutes, value.seconds);

// Live timer
const timer = createCountdown(new Date(Date.now() + 60000), {
  interval: 1000,
  onTick: (val) => console.log(`${val.seconds}s remaining`),
  onComplete: () => console.log("Done!"),
});

timer.start();
// timer.pause();
// timer.resume();
// timer.stop();
```

Pausing stops scheduled ticks but does not freeze the target time; the countdown continues to elapse and is recalculated when resumed. The default tick interval is 1,000 ms.

`CountdownOptions.baseDate` is present in the exported type but is not used by the live timer; use `getCountdown(target, baseDate)` when a reference date is needed.

---

### 8. Date Duration

Calculate the span between two dates with structured calendar components and absolute elapsed time.

- `calculateDateDuration(startDate: Date | string | number, endDate: Date | string | number): DateDuration`

#### Calendar duration and elapsed time

A calendar month duration reflects actual calendar changes. For instance, `2026-01-31` to `2026-02-28` is **1 calendar month**, while absolute elapsed time is **28 days (2,419,200,000 ms)**.

```ts
import { calculateDateDuration } from "@rahul_dadhich15/datetime-kit";

const duration = calculateDateDuration("2026-01-31", "2026-02-28");
console.log(duration);
// {
//   years: 0,
//   months: 1,
//   days: 0,
//   hours: 0,
//   minutes: 0,
//   seconds: 0,
//   milliseconds: 0,
//   totalDays: 28,
//   totalHours: 672,
//   totalMinutes: 40320,
//   totalSeconds: 2419200,
//   totalMilliseconds: 2419200000,
//   isNegative: false
// }
```

---

### 9. Days Until

Count remaining calendar days until a target date. Without `timeZone`, calendar-day boundaries are derived from UTC; supply an IANA timezone to use that zone's calendar date.

- `daysUntil(target: Date | string | number, options?: DaysUntilOptions): number`

```ts
import { daysUntil } from "@rahul_dadhich15/datetime-kit";

daysUntil("2030-01-01"); // Integer number of calendar days remaining
daysUntil("2026-06-16", { from: "2026-06-15" }); // 1
daysUntil("2026-06-15", { from: "2026-06-15", inclusive: true }); // 1
```

Time of day is ignored. By default, `from` is the current date, `inclusive` is `false`, and date boundaries are interpreted in UTC unless `timeZone` is supplied.

---

### 10. Discord Timestamp

Generate Discord dynamic timestamp markup strings.

- `createDiscordTimestamp(date: Date | string | number, style?: DiscordTimestampStyle): string`
- `discordTimestamp(date: Date | string | number, style?: DiscordTimestampStyle): string`

Supported styles:
- `t`: Short Time (`09:01 AM`)
- `T`: Long Time (`09:01:00 AM`)
- `d`: Short Date (`29/09/2026`)
- `D`: Long Date (`29 September 2026`)
- `f`: Short Date/Time (`29 September 2026 09:01`)
- `F`: Long Date/Time (`Tuesday, 29 September 2026 09:01`)
- `R`: Relative Time (`in 2 hours`, `2 days ago`)

```ts
import { createDiscordTimestamp } from "@rahul_dadhich15/datetime-kit";

createDiscordTimestamp(new Date()); // "<t:1789128000>"
createDiscordTimestamp(new Date(), "R"); // "<t:1789128000:R>"
```

For numeric inputs, values greater than `100000000000` are interpreted as milliseconds; smaller values are interpreted as Unix seconds.

---

### 11. Hours Calculation

Add, subtract, parse, total, and format hours and minutes. String inputs accept hour/minute text, colon-formatted values, and integer minute strings; numeric inputs and `formatHours` use minutes.

- `parseHours(value: string | number): ParsedHours`
- `addHours(...values: (string | number)[]): string`
- `subtractHours(base: string | number, ...values: (string | number)[]): string`
- `totalHours(values: (string | number)[]): number`
- `formatHours(minutes: number, style?: "short" | "colon"): string`

```ts
import { addHours, subtractHours, totalHours, parseHours } from "@rahul_dadhich15/datetime-kit";

parseHours("2h 30m"); // { hours: 2, minutes: 30, totalMinutes: 150, totalHours: 2.5, isNegative: false }
addHours("2h 30m", "1h 45m"); // "4h 15m"
subtractHours("4h 15m", "1h 45m"); // "2h 30m"
totalHours(["2h 30m", "1h 45m", "0h 45m"]); // 5
```

---

### 12. ICS Generation

Generate iCalendar (`.ics`) content with CRLF line endings, text escaping, and line folding. Event timestamps are serialized in UTC. Recurrence options cover a subset of RRULE fields rather than the full RFC 5545 recurrence model.

- `generateICS(events: ICSEvent | ICSEvent[], options?: ICSCalendarOptions): string`
- `generateICSEvent(event: ICSEvent): string`

```ts
import { generateICS } from "@rahul_dadhich15/datetime-kit";

const ics = generateICS({
  title: "Engineering Review",
  start: "2026-10-01T10:00:00Z",
  end: "2026-10-01T11:00:00Z",
  description: "Quarterly architectural sync",
  location: "Online",
  organizer: { name: "Lead Architect", email: "lead@example.com" },
  attendees: [{ name: "Dev Team", email: "dev@example.com", rsvp: true }],
  recurrence: {
    frequency: "WEEKLY",
    interval: 1,
    count: 10,
    byDay: ["MO", "TH"],
  },
});
```

---

### 13. ISO 8601 Duration

Parse and build standard ISO 8601 duration strings (`PnYnMnDTnHnMnS`).

- `parseISO8601Duration(value: string): ISO8601Duration`
- `buildISO8601Duration(duration: Partial<ISO8601Duration>): string`

```ts
import { parseISO8601Duration, buildISO8601Duration } from "@rahul_dadhich15/datetime-kit";

parseISO8601Duration("P1Y2M10DT3H20M");
// { years: 1, months: 2, days: 10, hours: 3, minutes: 20 }

buildISO8601Duration({ years: 1, months: 2, days: 10, hours: 3 });
// "P1Y2M10DT3H"
```

---

### 14. Holidays Lookup

Offline lookup of curated public holidays by country code and year.

- `getHolidays(country: string, year: number): Holiday[]`
- `isHoliday(date: Date | string | number, country: string): boolean`
- `getHoliday(date: Date | string | number, country: string): Holiday | null`
- `getSupportedHolidayCountries(): string[]`

Supported country codes:
- `IN` (India)
- `US` (United States)
- `GB` (United Kingdom)
- `CA` (Canada)
- `AU` (Australia)

```ts
import { getHolidays, isHoliday, getHoliday } from "@rahul_dadhich15/datetime-kit";

getHolidays("IN", 2026);
isHoliday("2026-01-26", "IN"); // true (Republic Day)
getHoliday("2026-07-04", "US"); // { date: "2026-07-04", name: "Independence Day", country: "US", type: "national" }
```

---

### 15. Schedule Builder

Generate scheduled appointment grids based on time ranges, slot duration, break periods, and excluded time slots.

- `buildSchedule(options: ScheduleOptions): ScheduleSlot[]`

`slotDuration` is required and measured in minutes; `breakDuration` defaults to `0`. `start` and `end` are `HH:mm`-style strings or `Date` values (the UTC hour and minute are used for `Date` values). Only complete slots that fit before `end` are returned. Excluded ranges remove overlapping slots; `maxSlots`, when supplied, caps the number returned.

```ts
import { buildSchedule } from "@rahul_dadhich15/datetime-kit";

const slots = buildSchedule({
  start: "09:00",
  end: "12:00",
  slotDuration: 30,
  breakDuration: 10,
  excludeSlots: [{ start: "10:10", end: "10:40" }],
});
```

---

### 16. Timezone Conversion

Convert dates and wall-clock times between IANA timezones using the runtime's timezone database.

- `convertTimezoneBetween(dateOrString: Date | string, fromTimezone: string, toTimezone: string, options?: TimezoneConvertOptions): string`
- `convertBetweenTimezones(dateOrString: Date | string, fromTimezone: string, toTimezone: string, options?: TimezoneConvertOptions): string`
- `convertTimezoneDetailed(dateOrString: Date | string, fromTimezone: string, toTimezone: string): TimezoneConvertResult`

```ts
import { convertTimezoneBetween, convertTimezoneDetailed } from "@rahul_dadhich15/datetime-kit";

// 10:00 AM in Kolkata converted to New York time during summer (EDT)
convertTimezoneBetween("2026-06-01T10:00:00", "Asia/Kolkata", "America/New_York");
// => "2026-06-01T00:30:00"

// Detailed conversion object
convertTimezoneDetailed("2026-06-01T10:00:00", "Asia/Kolkata", "America/New_York");
// {
//   date: "2026-06-01",
//   time: "00:30:00",
//   iso: "2026-06-01T00:30:00",
//   timezone: "America/New_York",
//   offset: "-04:00",
//   offsetMinutes: -240
// }
```

---

### 17. Timezone Finder

Find IANA timezones by offset or curated place/city aliases. `COMMON_TIMEZONES` is the package's exported list used for offset matching, so offset results are limited to that list rather than every IANA timezone.

- `findTimezoneByPlace(place: string): string | null`
- `findTimezonesByOffset(offset: string | number, referenceDate?: Date): string[]`
- `isValidTimezone(timezone: string): boolean`
- `COMMON_TIMEZONES: readonly string[]`

```ts
import { findTimezoneByPlace, findTimezonesByOffset, isValidTimezone } from "@rahul_dadhich15/datetime-kit";

findTimezoneByPlace("India"); // "Asia/Kolkata"
findTimezoneByPlace("Tokyo"); // "Asia/Tokyo"
findTimezoneByPlace("New York"); // "America/New_York"

// Note: Offsets map to multiple timezones across the world
findTimezonesByOffset("+05:30"); // ["Asia/Kolkata", "Asia/Colombo"]

isValidTimezone("Asia/Kolkata"); // true
isValidTimezone("Invalid/Zone"); // false
```

---

### 18. Unix Timestamp

Comprehensive Unix timestamp utilities with strict range checking and distinct seconds/milliseconds helpers.

- `toUnixSeconds(date: Date | string | number): number`
- `toUnixMilliseconds(date: Date | string | number): number`
- `fromUnixSeconds(seconds: number): Date`
- `fromUnixMilliseconds(ms: number): Date`
- `unixToISO(timestamp: number, unit?: "seconds" | "milliseconds"): string`
- `isoToUnix(iso: string, unit?: "seconds" | "milliseconds"): number`
- `formatUnixTimestamp(timestamp: number, options?: UnixTimestampFormatOptions): string`

Timestamp units default to `"milliseconds"`. Formatted output defaults to locale `"en-US"` with medium date and time styles.

```ts
import { toUnixSeconds, fromUnixSeconds, unixToISO } from "@rahul_dadhich15/datetime-kit";

const seconds = toUnixSeconds(new Date());
const date = fromUnixSeconds(seconds);
const iso = unixToISO(seconds, "seconds");
```

---

### 19. World Clock

View current dates and times across multiple IANA timezones and supported place aliases.

- `getWorldClock(timezones?: string[], options?: WorldClockOptions): WorldClockEntry[]`
- `getWorldClockForCity(cityOrZone: string, options?: WorldClockOptions): WorldClockEntry`

If no zones are supplied, `getWorldClock` returns UTC, New York, London, Kolkata, Tokyo, and Sydney. The base date defaults to now.

```ts
import { getWorldClock, getWorldClockForCity } from "@rahul_dadhich15/datetime-kit";

// Query multiple cities / timezones
getWorldClock(["Delhi", "London", "New York", "Tokyo"]);

// Query single city
getWorldClockForCity("Dubai");
// {
//   timezone: "Asia/Dubai",
//   city: "Dubai",
//   date: "2026-09-29",
//   time: "14:30:00",
//   iso: "2026-09-29T14:30:00",
//   offset: "+04:00",
//   utcOffsetMinutes: 240
// }
```

---

## TypeScript Types

All types and interfaces are exported top-level:

```ts
import type {
  BusinessDaysOptions,
  CountdownOptions,
  CountdownTimer,
  CountdownValue,
  CronField,
  CronFieldName,
  CronNextOptions,
  DateFormat,
  DateDuration,
  DateFormatterOptions,
  DaysUntilOptions,
  DiscordTimestampStyle,
  Holiday,
  HolidayCountry,
  HoursFormatStyle,
  ICSAttendee,
  ICSCalendarOptions,
  ICSEvent,
  ICSOrganizer,
  ICSRecurrence,
  ISO8601Duration,
  ParsedCron,
  ParsedHours,
  PlaceTimezoneMapping,
  RelativeTimeOptions,
  RelativeTimeUnit,
  ScheduleOptions,
  ScheduleSlot,
  TimeSlot,
  TimestampUnit,
  TimezoneConvertOptions,
  TimezoneConvertResult,
  TimezoneFormatOptions,
  UnixTimestampFormatOptions,
  WorldClockEntry,
  WorldClockOptions,
} from "@rahul_dadhich15/datetime-kit";
```

---

## Pitfalls & Limitations

Keep these behaviors in mind when choosing an API and interpreting its results:

- **Numeric date inputs usually mean milliseconds.** Most functions accepting a `Date | string | number` pass numbers to JavaScript's `Date` constructor, where the number is milliseconds since the Unix epoch. Timestamp helpers also default to milliseconds, unless you specify `"seconds"`. `createDiscordTimestamp` is an exception: it treats numbers above `100000000000` as milliseconds and smaller numbers as seconds. Prefer explicit `Date` objects or the dedicated seconds/milliseconds helpers.
- **Date strings can represent different kinds of time.** JavaScript parses ISO date-only strings as UTC, while ISO date-time strings without an offset are interpreted in the runtime's local timezone. Other string formats can vary by runtime. Use ISO strings with `Z` or an explicit offset for instants; use `convertTimezoneBetween` with an IANA source timezone for local wall-clock times.
- **Many calendar calculations use UTC.** Business-day calculations compare UTC calendar dates; `daysUntil` also uses UTC dates unless `timeZone` is provided. `calculateDateDuration` decomposes elapsed time using UTC calendar units. These may differ from a user's local calendar day.
- **Cron runs in the machine's local timezone.** `nextCronRun` and `nextCronRuns` do not accept a timezone option. If both day-of-month and day-of-week fields are restricted, a match on either field qualifies. The default search limit is 525,600 minutes (one non-leap year), so a valid but infrequent schedule can still exceed it.
- **DST wall-clock times can be ambiguous or nonexistent.** Timezone conversion uses the runtime's `Intl`/IANA timezone data. A local time during a daylight-saving transition may map to zero or multiple instants; the conversion API does not let you choose a disambiguation policy. Test such inputs if they matter to your application.
- **Pausing a countdown does not pause time.** `pause()` stops timer callbacks only; the target continues to approach, and the value is recalculated on resume. `CountdownOptions.baseDate` is declared in the type but is not used by `createCountdown`; use `getCountdown(target, baseDate)` for a fixed reference date.
- **Relative-time strings are not fully localized.** Values less than 10 seconds from the base date return fixed English phrases regardless of the requested locale.
- **Hour strings have specific units.** Numeric inputs to the hour-calculation utilities represent minutes. Plain integer strings also represent minutes. In colon-formatted strings, the optional seconds component is currently ignored; use `HH:mm` when seconds must not be discarded.
- **Schedule generation does not roll over midnight.** The end time must be later than the start time on the same day, and only complete slots fitting in that range are returned.
- **Holiday data is curated and offline.** The package covers `IN`, `US`, `GB`, `CA`, and `AU`, but does not provide an authoritative, regularly updated calendar or all regional, state, provincial, or local holidays. Some movable holiday dates are explicitly bundled for a limited set of years; verify dates for production-critical scheduling.
- **Timezone lookup is curated.** `findTimezoneByPlace` recognizes a built-in set of aliases, and `findTimezonesByOffset` searches only the exported `COMMON_TIMEZONES` list. Neither function is a general geocoder or exhaustive IANA timezone search.
- **ICS generation supports a subset of iCalendar.** Dates are serialized in UTC; all-day values use the UTC calendar date. Recurrence covers `FREQ`, `INTERVAL`, `COUNT`, `UNTIL`, `BYDAY`, `BYMONTHDAY`, and `BYMONTH`, not the full RFC 5545 model. Long-line folding counts JavaScript string characters, not UTF-8 octets.
- **ISO 8601 duration values are not fixed elapsed time.** Years and months depend on the starting date. Do not convert them to milliseconds without choosing an explicit calendar context.
- **Invalid inputs can throw.** Depending on the function, invalid dates, timezones, cron expressions, and ranges raise `TypeError` or `RangeError`; catch and handle these at application boundaries.
- **Some options are currently informational only.** `WorldClockOptions.locale`, `dateStyle`, and `timeStyle` are declared but do not change the returned ISO-like date/time strings.

---

## Runtime Dependency Notes

- The published package has no runtime dependencies. Development dependencies are used for building, type checking, and tests.
- A zero-dependency runtime does not by itself guarantee security; assess the package against your application's requirements.

---

## ESM & CommonJS Usage

All runtime APIs are named exports from the package root; there is no default export. Import types separately with `import type`.

### ECMAScript Modules (ESM)

```ts
import { countBusinessDays } from "@rahul_dadhich15/datetime-kit";
```

### CommonJS (CJS)

```cjs
const { countBusinessDays } = require("@rahul_dadhich15/datetime-kit");
```

## License

MIT © Rahul Dadhich