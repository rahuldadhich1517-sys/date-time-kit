import { describe, expect, it } from "vitest";
import {
  convertBetweenTimezones,
  convertTimezoneBetween,
  convertTimezoneDetailed,
} from "../src/timezone-convert/index.js";

describe("timezone-convert", () => {
  it("converts summer time from Asia/Kolkata to America/New_York (EDT)", () => {
    // 10:00 AM Kolkata (+05:30) is 04:30 UTC.
    // In New York during summer (EDT, -04:00), it is 00:30 (12:30 AM).
    const result = convertTimezoneBetween(
      "2026-06-01T10:00:00",
      "Asia/Kolkata",
      "America/New_York"
    );

    expect(result).toBe("2026-06-01T00:30:00");
  });

  it("converts winter time from Asia/Kolkata to America/New_York (EST)", () => {
    // 10:00 AM Kolkata (+05:30) is 04:30 UTC.
    // In New York during winter (EST, -05:00), it is 23:30 on previous day.
    const result = convertTimezoneBetween(
      "2026-01-15T10:00:00",
      "Asia/Kolkata",
      "America/New_York"
    );

    expect(result).toBe("2026-01-14T23:30:00");
  });

  it("converts between London and Tokyo in summer and winter", () => {
    // Summer: London is BST (UTC+1), Tokyo is JST (UTC+9). Diff = 8 hours.
    const summer = convertTimezoneBetween(
      "2026-07-01T12:00:00",
      "Europe/London",
      "Asia/Tokyo"
    );
    expect(summer).toBe("2026-07-01T20:00:00");

    // Winter: London is GMT (UTC+0), Tokyo is JST (UTC+9). Diff = 9 hours.
    const winter = convertTimezoneBetween(
      "2026-01-01T12:00:00",
      "Europe/London",
      "Asia/Tokyo"
    );
    expect(winter).toBe("2026-01-01T21:00:00");
  });

  it("returns detailed conversion result with offset and minutes", () => {
    const detail = convertTimezoneDetailed(
      "2026-06-01T10:00:00",
      "Asia/Kolkata",
      "America/New_York"
    );

    expect(detail).toEqual({
      date: "2026-06-01",
      time: "00:30:00",
      iso: "2026-06-01T00:30:00",
      timezone: "America/New_York",
      offset: "-04:00",
      offsetMinutes: -240,
    });
  });

  it("supports formatting with dateStyle and timeStyle", () => {
    const formatted = convertTimezoneBetween(
      "2026-06-01T10:00:00",
      "Asia/Kolkata",
      "America/New_York",
      {
        locale: "en-US",
        dateStyle: "medium",
        timeStyle: "short",
      }
    );

    expect(formatted).toBe("Jun 1, 2026, 12:30 AM");
  });

  it("accepts a Date object as source", () => {
    // 04:30 UTC = 10:00 AM Kolkata
    const d = new Date("2026-06-01T04:30:00Z");
    const result = convertBetweenTimezones(d, "UTC", "America/New_York");
    expect(result).toBe("2026-06-01T00:30:00");
  });

  it("throws on invalid timezone", () => {
    expect(() =>
      convertTimezoneBetween(
        "2026-06-01T10:00:00",
        "Invalid/Timezone",
        "America/New_York"
      )
    ).toThrow("Invalid timezone");
  });
});
