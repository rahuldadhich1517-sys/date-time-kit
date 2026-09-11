import { describe, expect, it } from "vitest";

import {
  convertTimezone,
  getTimezoneOffset,
  getTimezoneName,
} from "../src/timezone/index.js";

describe("timezone", () => {
  const date = new Date(
    "2026-01-15T12:00:00.000Z"
  );

  it("converts UTC to Asia/Kolkata", () => {
    expect(
      convertTimezone(
        date,
        "Asia/Kolkata",
        {
          locale: "en-US",
          dateStyle: "long",
          timeStyle: "short",
        }
      )
    ).toBe(
      "January 15, 2026 at 5:30 PM"
    );
  });

  it("converts UTC to America/New_York", () => {
    expect(
      convertTimezone(
        date,
        "America/New_York",
        {
          locale: "en-US",
          dateStyle: "long",
          timeStyle: "short",
        }
      )
    ).toBe(
      "January 15, 2026 at 7:00 AM"
    );
  });

  it("handles daylight saving time", () => {
    const winterDate = new Date(
      "2026-01-15T12:00:00.000Z"
    );

    const summerDate = new Date(
      "2026-07-15T12:00:00.000Z"
    );

    expect(
      getTimezoneOffset(
        winterDate,
        "America/New_York"
      )
    ).toBe(-300);

    expect(
      getTimezoneOffset(
        summerDate,
        "America/New_York"
      )
    ).toBe(-240);
  });

  it("returns timezone offset in minutes", () => {
    expect(
      getTimezoneOffset(
        date,
        "Asia/Kolkata"
      )
    ).toBe(330);
  });

  it("returns timezone name", () => {
    expect(
      getTimezoneName(
        date,
        "Asia/Kolkata"
      )
    ).toBe("India Standard Time");
  });

  it("supports different locales", () => {
    expect(
      convertTimezone(
        date,
        "Asia/Kolkata",
        {
          locale: "en-GB",
          dateStyle: "long",
          timeStyle: "short",
        }
      )
    ).toBe(
      "15 January 2026 at 17:30"
    );
  });

  it("throws for invalid dates", () => {
    expect(() =>
      convertTimezone(
        new Date("invalid"),
        "Asia/Kolkata"
      )
    ).toThrow("Invalid date");
  });

  it("throws for invalid timezone", () => {
    expect(() =>
      convertTimezone(
        date,
        "Invalid/Timezone"
      )
    ).toThrow(
      "Invalid timezone: Invalid/Timezone"
    );
  });

  it("throws for empty timezone", () => {
    expect(() =>
      convertTimezone(
        date,
        ""
      )
    ).toThrow(
      "timeZone cannot be empty"
    );
  });
});