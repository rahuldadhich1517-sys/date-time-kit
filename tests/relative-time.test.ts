import { describe, expect, it } from "vitest";

import {
  formatRelativeTime,
} from "../src/relative-time/index.js";

describe("relative-time", () => {
  const baseDate = new Date(
    "2026-09-11T12:00:00.000Z"
  );

  it("formats seconds ago", () => {
    const date = new Date(
      "2026-09-11T11:59:30.000Z"
    );

    expect(
      formatRelativeTime(date, baseDate)
    ).toBe("30 seconds ago");
  });

  it("formats minutes ago", () => {
    const date = new Date(
      "2026-09-11T11:58:00.000Z"
    );

    expect(
      formatRelativeTime(date, baseDate)
    ).toBe("2 minutes ago");
  });

  it("formats hours ago", () => {
    const date = new Date(
      "2026-09-11T09:00:00.000Z"
    );

    expect(
      formatRelativeTime(date, baseDate)
    ).toBe("3 hours ago");
  });

  it("formats days ago", () => {
    const date = new Date(
      "2026-09-08T12:00:00.000Z"
    );

    expect(
      formatRelativeTime(date, baseDate)
    ).toBe("3 days ago");
  });

  it("formats weeks ago", () => {
    const date = new Date(
      "2026-08-28T12:00:00.000Z"
    );

    expect(
      formatRelativeTime(date, baseDate)
    ).toBe("2 weeks ago");
  });

  it("formats future dates", () => {
    const date = new Date(
      "2026-09-13T12:00:00.000Z"
    );

    expect(
      formatRelativeTime(date, baseDate)
    ).toBe("in 2 days");
  });

  it("formats very recent past as just now", () => {
    const date = new Date(
      "2026-09-11T11:59:55.000Z"
    );

    expect(
      formatRelativeTime(date, baseDate)
    ).toBe("just now");
  });

  it("supports numeric always", () => {
    const date = new Date(
      "2026-09-10T12:00:00.000Z"
    );

    expect(
      formatRelativeTime(date, baseDate, {
        numeric: "always",
      })
    ).toBe("1 day ago");
  });

  it("supports different locales", () => {
    const date = new Date(
      "2026-09-10T12:00:00.000Z"
    );

    expect(
      formatRelativeTime(date, baseDate, {
        locale: "en-GB",
      })
    ).toBe("yesterday");
  });

  it("throws for invalid date", () => {
    expect(() =>
      formatRelativeTime(
        new Date("invalid"),
        baseDate
      )
    ).toThrow("Invalid date");
  });

  it("throws for invalid base date", () => {
    expect(() =>
      formatRelativeTime(
        baseDate,
        new Date("invalid")
      )
    ).toThrow("Invalid baseDate");
  });
});