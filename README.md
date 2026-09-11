# date-time-toolkit

[![npm version](https://img.shields.io/npm/v/date-time-toolkit.svg)](https://www.npmjs.com/package/date-time-toolkit)
[![npm downloads](https://img.shields.io/npm/dm/date-time-toolkit.svg)](https://www.npmjs.com/package/date-time-toolkit)
[![license](https://img.shields.io/npm/l/date-time-toolkit.svg)](https://github.com/rahuldadhich15/date-time-toolkit/blob/main/LICENSE)
[![TypeScript](https://img.shields.io/badge/TypeScript-first-blue.svg)](https://www.typescriptlang.org/)

A lightweight, dependency-free TypeScript toolkit for working with dates, times, timezones, relative time, and cron scheduling.

## Features

* Unix timestamp conversion
* ISO 8601 conversion
* Date formatting with locale and timezone support
* Human-readable relative time
* Timezone conversion and offset utilities
* Cron expression parsing and validation
* Human-readable cron descriptions
* Find upcoming cron runs
* TypeScript-first API
* ESM and CommonJS support
* Zero runtime dependencies

## Installation

```bash
npm install date-time-toolkit
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
} from "date-time-toolkit-kit";

const date = new Date("2026-09-11T12:00:00Z");

console.log(toUnixTimestamp(date));
// 1789128000000

console.log(formatDate(date));
// Sep 11, 2026

console.log(formatRelativeTime(
  new Date("2026-09-12T12:00:00Z"),
  date
));
// tomorrow

console.log(convertTimezone(date, "Asia/Kolkata"));
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

Convert between JavaScript `Date` objects, Unix timestamps, and ISO strings.

### `toUnixTimestamp()`

```ts
toUnixTimestamp(date, unit?)
```

```ts
import { toUnixTimestamp } from "date-time-toolkit-kit";

const date = new Date("2026-09-11T12:00:00Z");

toUnixTimestamp(date);
// milliseconds

toUnixTimestamp(date, "seconds");
// seconds
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
import { fromUnixTimestamp } from "date-time-toolkit-kit";

fromUnixTimestamp(1789128000000);

fromUnixTimestamp(1789128000, "seconds");
```

### ISO conversion

```ts
import {
  toISOString,
  fromISOString,
} from "date-time-toolkit-kit";

const iso = toISOString(new Date());

const date = fromISOString("2026-09-11T12:00:00.000Z");
```

---

# Date Formatting

Format dates using the native `Intl.date-time-toolkitFormat` API.

```ts
import { formatDate } from "date-time-toolkit-kit";

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

Generate human-readable relative time using `Intl.RelativeTimeFormat`.

```ts
import { formatRelativeTime } from "date-time-toolkit-kit";

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
import { convertTimezone } from "date-time-toolkit-kit";

const date = new Date("2026-09-11T12:00:00Z");

convertTimezone(date, "Asia/Kolkata");

convertTimezone(date, "America/New_York");

convertTimezone(date, "Europe/London");
```

### Timezone offset

```ts
import { getTimezoneOffset } from "date-time-toolkit-kit";

getTimezoneOffset(
  new Date(),
  "Asia/Kolkata"
);
```

The returned value is the timezone offset in minutes.

### Timezone name

```ts
import { getTimezoneName } from "date-time-toolkit-kit";

getTimezoneName(
  new Date(),
  "Asia/Kolkata"
);
```

Timezone data and DST behavior are provided by the JavaScript runtime's ICU timezone implementation.

---

# Cron Parser

`date-time-toolkit-kit` supports standard **5-field cron expressions**.

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

## Supported syntax

### Wildcard

```text
* * * * *
```

### Step

```text
*/5 * * * *
```

Every 5 minutes.

### Range

```text
0 9 * * 1-5
```

Monday through Friday.

### List

```text
0 9 * * 1,3,5
```

Monday, Wednesday, and Friday.

### Range with step

```text
*/15 9-17 * * *
```

Every 15 minutes during working hours.

### Parse

```ts
import { parseCron } from "date-time-toolkit-kit";

const cron = parseCron("*/5 * * * *");

console.log(cron);
```

### Validate

```ts
import { isValidCron } from "date-time-toolkit-kit";

isValidCron("0 9 * * 1-5");
// true

isValidCron("invalid");
// false
```

## Current cron limitations

The parser intentionally supports a standard 5-field cron format.

Currently unsupported:

* Seconds field
* `@daily`, `@weekly`, etc.
* `L`
* `W`
* `#`
* `?`
* Named months
* Named weekdays

---

# Cron Humanizer

Convert a cron expression into a readable description.

```ts
import { humanizeCron } from "date-time-toolkit-kit";

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

This utility is designed to provide clear, predictable descriptions for commonly used cron expressions rather than attempting to translate every possible cron syntax into natural language.

---

# Cron Next Runs

Find the next scheduled execution time for a cron expression.

### Next run

```ts
import { nextCronRun } from "date-time-toolkit-kit";

const next = nextCronRun(
  "0 9 * * 1-5"
);

console.log(next);
```

### Multiple upcoming runs

```ts
import { nextCronRuns } from "date-time-toolkit-kit";

const runs = nextCronRuns(
  "0 9 * * 1-5",
  new Date(),
  {
    count: 5,
  }
);

console.log(runs);
```

### Custom search limit

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

A maximum iteration limit is used to prevent an unbounded search for schedules that may occur far in the future.

### Day-of-month and day-of-week behavior

When both day-of-month and day-of-week are restricted, `date-time-toolkit-kit` follows the common cron **OR behavior**:

```text
day-of-month matches OR day-of-week matches
```

---

# TypeScript

`date-time-toolkit-kit` is written in TypeScript and includes declaration files.

```ts
import type {
  TimestampUnit,
  DateFormat,
  RelativeTimeUnit,
  CronFieldName,
  ParsedCron,
  CronNextOptions,
} from "date-time-toolkit-kit";
```

---

# Browser & Node.js

The package relies only on standard JavaScript APIs such as:

* `Date`
* `Intl.date-time-toolkitFormat`
* `Intl.RelativeTimeFormat`

No runtime dependencies are required.

It can be used in modern:

* Node.js applications
* React applications
* Next.js applications
* Vite applications
* Browser applications
* TypeScript projects

---

# Development

Clone the repository and install dependencies:

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

---

# License

MIT © Rahul Dadhich
