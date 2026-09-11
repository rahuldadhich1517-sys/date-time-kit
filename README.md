# datetime-kit

[![npm version](https://img.shields.io/npm/v/%40rahul_dadhich15%2Fdatetime-kit.svg)](https://www.npmjs.com/package/@rahul_dadhich15/datetime-kit)
[![npm downloads](https://img.shields.io/npm/dm/%40rahul_dadhich15%2Fdatetime-kit.svg)](https://www.npmjs.com/package/@rahul_dadhich15/datetime-kit)
[![license](https://img.shields.io/npm/l/%40rahul_dadhich15%2Fdatetime-kit.svg)](https://github.com/rahuldadhich15/date-time-toolkit/blob/main/LICENSE)
[![TypeScript](https://img.shields.io/badge/TypeScript-first-blue.svg)](https://www.typescriptlang.org/)

A lightweight, dependency-free TypeScript toolkit for working with dates, times, timezones, relative time, and cron scheduling.

## Features

- Unix timestamp conversion
- ISO 8601 conversion
- Date formatting with locale and timezone support
- Human-readable relative time
- Timezone conversion and offset utilities
- Cron expression parsing and validation
- Human-readable cron descriptions
- Find upcoming cron runs
- TypeScript-first API
- ESM and CommonJS support
- Zero runtime dependencies

## Installation

```bash
npm install @rahul_dadhich15/datetime-kit
```

## Quick Start

```ts
import {
  toUnixTimestamp,
  formatDate,
  formatRelativeTime,
  convertTimezone,
  parseCron,
  humanizeCron,
  nextCronRun,
} from "@rahul_dadhich15/datetime-kit";

const date = new Date("2026-09-11T12:00:00Z");

console.log(toUnixTimestamp(date));
// 1789128000000

console.log(formatDate(date));
// Sep 11, 2026

console.log(
  formatRelativeTime(
    new Date("2026-09-12T12:00:00Z"),
    date
  )
);
// tomorrow

console.log(
  convertTimezone(date, "Asia/Kolkata")
);
// Sep 11, 2026, 5:30 PM

console.log(parseCron("0 9 * * 1-5"));
// Parsed cron object

console.log(humanizeCron("0 9 * * 1-5"));
// Every weekday at 9:00 AM

console.log(nextCronRun("0 9 * * 1-5"));
// Next weekday at 9:00 AM
```

---

# API

## Timestamp

Convert between JavaScript `Date` objects, Unix timestamps, and ISO 8601 strings.

### `toUnixTimestamp()`

```ts
toUnixTimestamp(date, unit?)
```

```ts
import { toUnixTimestamp } from "@rahul_dadhich15/datetime-kit";

const date = new Date("2026-09-11T12:00:00Z");

toUnixTimestamp(date);
// 1789128000000

toUnixTimestamp(date, "seconds");
// 1789128000
```

Supported units:

```ts
type TimestampUnit = "seconds" | "milliseconds";
```

### `fromUnixTimestamp()`

```ts
fromUnixTimestamp(timestamp, unit?)
```

```ts
import { fromUnixTimestamp } from "@rahul_dadhich15/datetime-kit";

fromUnixTimestamp(1789128000000);

fromUnixTimestamp(1789128000, "seconds");
```

### ISO conversion

```ts
import {
  toISOString,
  fromISOString,
} from "@rahul_dadhich15/datetime-kit";

const iso = toISOString(new Date());

const date = fromISOString(
  "2026-09-11T12:00:00.000Z"
);
```

---

# Date Formatting

Format dates using the native `Intl.DateTimeFormat` API.

```ts
import { formatDate } from "@rahul_dadhich15/datetime-kit";

const date = new Date("2026-09-11T12:00:00Z");

formatDate(date);

formatDate(date, {
  format: "short",
});

formatDate(date, {
  format: "long",
});

formatDate(date, {
  format: "full",
});
```

Available formats:

```ts
type DateFormat =
  | "short"
  | "medium"
  | "long"
  | "full"
  | "iso";
```

### Locale

```ts
formatDate(date, {
  locale: "en-GB",
});
```

### Timezone

```ts
formatDate(date, {
  timeZone: "Asia/Kolkata",
});
```

---

# Relative Time

Generate human-readable relative time using the native `Intl.RelativeTimeFormat` API.

```ts
import { formatRelativeTime } from "@rahul_dadhich15/datetime-kit";

const now = new Date();

const tomorrow = new Date(
  now.getTime() + 24 * 60 * 60 * 1000
);

formatRelativeTime(tomorrow, now);
// tomorrow
```

### Options

```ts
formatRelativeTime(date, baseDate, {
  locale: "en-US",
  numeric: "auto",
  style: "long",
});
```

Supported styles:

```ts
"long" | "short" | "narrow"
```

Supported numeric modes:

```ts
"always" | "auto"
```

---

# Timezone

Timezone utilities use the JavaScript `Intl` API and support IANA timezone names.

### Convert timezone

```ts
import { convertTimezone } from "@rahul_dadhich15/datetime-kit";

const date = new Date("2026-09-11T12:00:00Z");

convertTimezone(date, "Asia/Kolkata");

convertTimezone(date, "America/New_York");

convertTimezone(date, "Europe/London");
```

### Timezone offset

```ts
import { getTimezoneOffset } from "@rahul_dadhich15/datetime-kit";

getTimezoneOffset(
  new Date(),
  "Asia/Kolkata"
);
```

The returned value is the timezone offset in minutes.

### Timezone name

```ts
import { getTimezoneName } from "@rahul_dadhich15/datetime-kit";

getTimezoneName(
  new Date(),
  "Asia/Kolkata"
);
```

Timezone data and daylight-saving-time behavior are provided by the JavaScript runtime's ICU timezone implementation.

---

# Cron Parser

`datetime-kit` supports standard **5-field cron expressions**.

Format:

```text
minute hour day-of-month month day-of-week
```

Example:

```text
0 9 * * 1-5
```

Meaning:

```text
Every weekday at 9:00 AM
```

## Supported Syntax

### Wildcard

```text
* * * * *
```

Runs every minute.

### Step

```text
*/5 * * * *
```

Runs every 5 minutes.

### Range

```text
0 9 * * 1-5
```

Runs at 9:00 AM from Monday through Friday.

### List

```text
0 9 * * 1,3,5
```

Runs at 9:00 AM on Monday, Wednesday, and Friday.

### Range with Step

```text
*/15 9-17 * * *
```

Runs every 15 minutes during hours 9 through 17.

### Parse

```ts
import { parseCron } from "@rahul_dadhich15/datetime-kit";

const cron = parseCron("*/5 * * * *");

console.log(cron);
```

### Validate

```ts
import { isValidCron } from "@rahul_dadhich15/datetime-kit";

isValidCron("0 9 * * 1-5");
// true

isValidCron("invalid");
// false
```

## Current Cron Limitations

The parser intentionally supports a standard 5-field cron format.

Currently unsupported:

- Seconds field
- `@daily`, `@weekly`, and other shortcuts
- `L`
- `W`
- `#`
- `?`
- Named months
- Named weekdays

---

# Cron Humanizer

Convert a cron expression into a readable description.

```ts
import { humanizeCron } from "@rahul_dadhich15/datetime-kit";

humanizeCron("* * * * *");
// Every minute

humanizeCron("*/5 * * * *");
// Every 5 minutes

humanizeCron("0 9 * * *");
// Every day at 9:00 AM

humanizeCron("0 9 * * 1-5");
// Every weekday at 9:00 AM

humanizeCron("30 18 * * 5");
// Every Friday at 6:30 PM
```

This utility is designed to provide clear and predictable descriptions for commonly used cron expressions rather than attempting to translate every possible cron syntax into natural language.

---

# Cron Next Runs

Find the next scheduled execution time for a cron expression.

### `nextCronRun()`

Returns the next scheduled run.

```ts
import { nextCronRun } from "@rahul_dadhich15/datetime-kit";

const next = nextCronRun(
  "0 9 * * 1-5"
);

console.log(next);
```

### `nextCronRuns()`

Returns multiple upcoming scheduled runs.

```ts
import { nextCronRuns } from "@rahul_dadhich15/datetime-kit";

const runs = nextCronRuns(
  "0 9 * * 1-5",
  new Date(),
  {
    count: 5,
  }
);

console.log(runs);
```

### Custom Search Limit

For schedules that may occur far in the future, you can increase the maximum number of minute-by-minute iterations.

```ts
nextCronRun(
  "0 0 29 2 *",
  new Date(),
  {
    maxIterations: 700000,
  }
);
```

`cron-next` searches minute-by-minute from the supplied date.

A maximum iteration limit prevents an unbounded search for schedules that may occur far in the future.

### Day-of-Month and Day-of-Week Behavior

When both day-of-month and day-of-week are restricted, `datetime-kit` follows the common cron **OR behavior**:

```text
day-of-month matches OR day-of-week matches
```

---

# TypeScript

`datetime-kit` is written in TypeScript and includes declaration files.

You can import the provided types directly:

```ts
import type {
  TimestampUnit,
  DateFormat,
  RelativeTimeUnit,
  CronFieldName,
  ParsedCron,
  CronNextOptions,
} from "@rahul_dadhich15/datetime-kit";
```

---

# Browser & Node.js

The package relies only on standard JavaScript APIs such as:

- `Date`
- `Intl.DateTimeFormat`
- `Intl.RelativeTimeFormat`

No runtime dependencies are required.

It can be used in modern:

- Node.js applications
- React applications
- Next.js applications
- Vite applications
- Browser applications
- TypeScript projects

---

# Module Overview

| Module | Purpose |
|---|---|
| Timestamp | Unix and ISO timestamp conversion |
| Date Formatter | Locale-aware date formatting |
| Relative Time | Human-readable relative dates |
| Timezone | Timezone conversion and offsets |
| Cron Parser | Parse and validate cron expressions |
| Cron Humanizer | Convert cron expressions to readable text |
| Cron Next | Find upcoming cron executions |

---

# Development

Clone the repository:

```bash
git clone https://github.com/rahuldadhich15/date-time-toolkit.git
cd date-time-toolkit
```

Install dependencies:

```bash
npm install
```

Run type checking:

```bash
npm run typecheck
```

Run tests:

```bash
npm run test:run
```

Run tests in watch mode:

```bash
npm test
```

Build the package:

```bash
npm run build
```

Validate the npm package contents:

```bash
npm pack --dry-run
```

---

# Project Structure

```text
date-time-toolkit/
├── src/
│   ├── timestamp/
│   ├── date-formatter/
│   ├── relative-time/
│   ├── timezone/
│   ├── cron-parser/
│   ├── cron-humanize/
│   ├── cron-next/
│   └── index.ts
├── tests/
├── .github/
│   └── workflows/
│       └── ci.yml
├── README.md
├── LICENSE
├── package.json
├── package-lock.json
└── tsconfig.json
```

---

# License

MIT © Rahul Dadhich