# datetime-kit

[![npm version](https://img.shields.io/npm/v/%40rahul_dadhich15%2Fdatetime-kit.svg)](https://www.npmjs.com/package/@rahul_dadhich15/datetime-kit)
[![npm downloads](https://img.shields.io/npm/dm/%40rahul_dadhich15%2Fdatetime-kit.svg)](https://www.npmjs.com/package/@rahul_dadhich15/datetime-kit)
[![license](https://img.shields.io/npm/l/%40rahul_dadhich15%2Fdatetime-kit.svg)](https://github.com/rahuldadhich1517-sys/date-time-toolkit/blob/main/LICENSE)
[![TypeScript](https://img.shields.io/badge/TypeScript-first-blue.svg)](https://www.typescriptlang.org/)

A lightweight, dependency-free TypeScript toolkit for dates, times, timestamps, durations, time zones, calendars, schedules, cron expressions, working days, holidays, calendar events, and world clocks.

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
- [Timezone & DST Behavior](#timezone--dst-behavior)
- [Holiday Data & Limitations](#holiday-data--limitations)
- [ICS Generation & Recurrence Details](#ics-generation--recurrence-details)
- [ISO 8601 Duration Limitations](#iso-8601-duration-limitations)
- [Security & Runtime Dependency Notes](#security--runtime-dependency-notes)
- [ESM & CommonJS Usage](#esm--commonjs-usage)
- [Development, Testing & Build](#development-testing--build)
- [Project Structure](#project-structure)
- [CI](#ci)
- [Contributing](#contributing)
- [License](#license)

---

## Overview

`datetime-kit` provides 21 comprehensive, production-grade date/time utilities in a single zero-dependency package. Built natively with modern JavaScript and ECMAScript Internationalization (`Intl`) standards, it runs seamlessly in Node.js, browsers, and edge environments.

---

## Features

- **Zero runtime dependencies**: Pure TypeScript / modern JavaScript.
- **Dual module output**: Full native ESM and CommonJS support with TypeScript declaration files.
- **Deterministic and lightweight**: Fast startup and minimal package footprint (~46 kB packed).
- **Comprehensive coverage**:
  - Unix & ISO timestamps with strict unit safety (seconds vs milliseconds)
  - Locale-aware date formatting and human relative times
  - IANA timezone conversion, offsets, place-to-zone matching, and DST transitions
  - Standard 5-field cron parsing, human descriptions, and next run calculations
  - Business days counting, weekend customization, and holiday exclusion
  - High-precision countdown timers with start/pause/resume/stop lifecycle
  - Calendar-aware duration differences (distinguishing calendar units from absolute elapsed time)
  - Target countdowns with day boundaries and timezone awareness
  - Dynamic Discord timestamp markdown formatting
  - Time/hour arithmetic (adding, subtracting, parsing, and totaling)
  - iCalendar (`.ics`) RFC 5545 event and recurrence generation
  - ISO 8601 duration parser and builder (`PnYnMnDTnHnMnS`)
  - Curated national public holidays lookup for 5 major countries
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

```ts
import { toUnixTimestamp, fromUnixTimestamp } from "@rahul_dadhich15/datetime-kit";

const date = new Date("2026-09-11T12:00:00Z");

toUnixTimestamp(date); // 1789128000000 (milliseconds)
toUnixTimestamp(date, "seconds"); // 1789128000

fromUnixTimestamp(1789128000, "seconds"); // Date object
```

---

### 2. Date Formatting

Format dates using native `Intl.DateTimeFormat`.

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

```ts
import { convertTimezone, getTimezoneOffset, getTimezoneName } from "@rahul_dadhich15/datetime-kit";

const date = new Date("2026-01-15T12:00:00Z");

getTimezoneOffset(date, "Asia/Kolkata"); // 330
getTimezoneName(date, "Asia/Kolkata"); // "India Standard Time"
```

---

### 5. Cron Expressions

Parse, validate, explain, and compute upcoming execution dates for standard 5-field cron schedules.

- `parseCron(expression: string): ParsedCron`
- `isValidCron(expression: string): boolean`
- `humanizeCron(expression: string): string`
- `nextCronRun(expression: string, fromDate?: Date, options?: CronNextOptions): Date`
- `nextCronRuns(expression: string, fromDate?: Date, options?: CronNextOptions & { count?: number }): Date[]`

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

Calculate countdown values and run live in-memory timers with complete lifecycle controls. Safe for Node.js and browsers (no browser-only APIs).

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

---

### 8. Date Duration

Calculate the span between two dates with structured calendar components and absolute elapsed time.

- `calculateDateDuration(startDate: Date | string | number, endDate: Date | string | number): DateDuration`

#### Difference between calendar duration and absolute elapsed time:

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

Count remaining calendar days until a target date.

- `daysUntil(target: Date | string | number, options?: DaysUntilOptions): number`

```ts
import { daysUntil } from "@rahul_dadhich15/datetime-kit";

daysUntil("2030-01-01"); // Integer number of calendar days remaining
daysUntil("2026-06-16", { from: "2026-06-15" }); // 1
daysUntil("2026-06-15", { from: "2026-06-15", inclusive: true }); // 1
```

*Note: Time of day is ignored; comparison operates on calendar dates.*

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

---

### 11. Hours Calculation

Add, subtract, parse, total, and format hours and minutes. Avoids floating point inaccuracies by maintaining integer minute representations internally.

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

Generate RFC 5545 compliant iCalendar (`.ics`) file contents with proper CRLF line endings, special character escaping, and automatic 75-octet line folding.

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

Offline lookup of official national public holidays by country code and year.

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

Convert dates and wall-clock times between IANA timezones while handling DST transitions seamlessly.

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

Find IANA timezones by offset or common place/city names.

- `findTimezoneByPlace(place: string): string | null`
- `findTimezonesByOffset(offset: string | number, referenceDate?: Date): string[]`
- `isValidTimezone(timezone: string): boolean`

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

```ts
import { toUnixSeconds, fromUnixSeconds, unixToISO } from "@rahul_dadhich15/datetime-kit";

const seconds = toUnixSeconds(new Date());
const date = fromUnixSeconds(seconds);
const iso = unixToISO(seconds, "seconds");
```

---

### 19. World Clock

View current dates and times across multiple IANA timezones and major global cities.

- `getWorldClock(timezones?: string[], options?: WorldClockOptions): WorldClockEntry[]`
- `getWorldClockForCity(cityOrZone: string, options?: WorldClockOptions): WorldClockEntry`

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

## Timezone & DST Behavior

- Timezone calculations leverage the ECMAScript Internationalization API (`Intl.DateTimeFormat`) and the environment's underlying ICU / IANA timezone database.
- DST shifts (spring forward and fall back) are automatically handled without manual offset calculations.
- Offsets represent specific points in time; `findTimezonesByOffset` evaluates matching zones against a specified reference date (default: current date).

---

## Holiday Data & Limitations

- Holiday data is bundled locally without runtime network requests.
- Supported countries: India (`IN`), United States (`US`), United Kingdom (`GB`), Canada (`CA`), and Australia (`AU`).
- **Limitation**: The dataset includes **national and federal public holidays**. It does not claim to include regional, state, provincial, municipal, or discretionary local bank holidays.

---

## ICS Generation & Recurrence Details

- Generates RFC 5545 compliant `.ics` calendar content.
- Enforces CRLF (`\r\n`) line termination, character escaping (`,`, `;`, `\`, `\n`), and 75-octet line folding (`\r\n `).
- Recurrence (RRULE) support covers standard parameters: `FREQ`, `INTERVAL`, `COUNT`, `UNTIL`, `BYDAY`, `BYMONTHDAY`, and `BYMONTH`. It does not claim full RFC 5545 recurrence coverage (e.g. `BYSETPOS` or secondary exceptions).

---

## ISO 8601 Duration Limitations

- Parses and builds standard duration formats: `P[nY][nM][nW][nD][T[nH][nM][nS]]`.
- Note: Calendar units (`years`, `months`) vary in length depending on the specific starting date and cannot be represented as fixed millisecond constants.

---

## Security & Runtime Dependency Notes

- **Zero runtime dependencies**: Minimal attack surface, zero dependency drift, and no supply chain vulnerabilities.
- Safe for secure enterprise environments and isolated serverless runtimes.

---

## ESM & CommonJS Usage

### ECMAScript Modules (ESM)

```ts
import { countBusinessDays } from "@rahul_dadhich15/datetime-kit";
```

### CommonJS (CJS)

```cjs
const { countBusinessDays } = require("@rahul_dadhich15/datetime-kit");
```

---

## Development, Testing & Build

```bash
# Clone the repository
git clone https://github.com/rahuldadhich1517-sys/date-time-toolkit.git
cd date-time-toolkit

# Install dev dependencies
npm install

# Run type checking
npm run typecheck

# Run test suite
npm run test:run

# Build dual ESM and CJS bundles
npm run build

# Verify package contents
npm pack --dry-run
```

---

## Project Structure

```text
date-time-toolkit/
├── src/
│   ├── business-days/
│   ├── countdown-timer/
│   ├── cron-humanize/
│   ├── cron-next/
│   ├── cron-parser/
│   ├── date-duration/
│   ├── date-formatter/
│   ├── days-until/
│   ├── discord-timestamp/
│   ├── holidays-lookup/
│   │   └── data/
│   ├── hours-calculate/
│   ├── ics-generate/
│   ├── internal/
│   ├── iso8601-duration/
│   ├── relative-time/
│   ├── schedule-build/
│   ├── timestamp/
│   ├── timezone/
│   ├── timezone-convert/
│   ├── timezone-find/
│   ├── unix-timestamp/
│   ├── world-clock/
│   └── index.ts
├── tests/
│   ├── business-days.test.ts
│   ├── countdown-timer.test.ts
│   ├── cron-humanize.test.ts
│   ├── cron-next.test.ts
│   ├── cron-parser.test.ts
│   ├── date-duration.test.ts
│   ├── date-formatter.test.ts
│   ├── days-until.test.ts
│   ├── discord-timestamp.test.ts
│   ├── holidays-lookup.test.ts
│   ├── hours-calculate.test.ts
│   ├── ics-generate.test.ts
│   ├── iso8601-duration.test.ts
│   ├── relative-time.test.ts
│   ├── schedule-build.test.ts
│   ├── timestamp.test.ts
│   ├── timezone-convert.test.ts
│   ├── timezone-find.test.ts
│   ├── timezone.test.ts
│   ├── unix-timestamp.test.ts
│   └── world-clock.test.ts
├── dist/
├── README.md
├── LICENSE
├── package.json
├── package-lock.json
└── tsconfig.json
```

---

## CI

Automated tests and builds run via GitHub Actions on pull requests and commits to `main`.

---

## Contributing

Contributions, bug reports, and suggestions are welcome! Please open an issue or pull request on GitHub.

---

## License

MIT © Rahul Dadhich