import { describe, expect, it } from "vitest";
import { calculateDateDuration } from "../src/date-duration/index.js";

describe("date-duration", () => {
  it("calculates zero duration for identical dates", () => {
    const d = new Date("2026-05-10T12:00:00.000Z");
    const res = calculateDateDuration(d, d);

    expect(res.years).toBe(0);
    expect(res.months).toBe(0);
    expect(res.days).toBe(0);
    expect(res.hours).toBe(0);
    expect(res.minutes).toBe(0);
    expect(res.seconds).toBe(0);
    expect(res.totalMilliseconds).toBe(0);
    expect(res.isNegative).toBe(false);
  });

  it("calculates time span within the same day", () => {
    const d1 = "2026-05-10T10:15:30.000Z";
    const d2 = "2026-05-10T14:45:45.500Z";
    const res = calculateDateDuration(d1, d2);

    expect(res.years).toBe(0);
    expect(res.months).toBe(0);
    expect(res.days).toBe(0);
    expect(res.hours).toBe(4);
    expect(res.minutes).toBe(30);
    expect(res.seconds).toBe(15);
    expect(res.milliseconds).toBe(500);
  });

  it("handles month boundary with clamping (Jan 31 to Feb 28)", () => {
    const d1 = "2026-01-31T00:00:00.000Z";
    const d2 = "2026-02-28T00:00:00.000Z";
    const res = calculateDateDuration(d1, d2);

    expect(res.years).toBe(0);
    expect(res.months).toBe(1);
    expect(res.days).toBe(0);
    // Absolute elapsed days is 28 days
    expect(res.totalDays).toBe(28);
  });

  it("handles leap year February", () => {
    // 2024 is leap year: Feb 28 to Mar 1 is 2 days
    const d1 = "2024-02-28T00:00:00.000Z";
    const d2 = "2024-03-01T00:00:00.000Z";
    const res = calculateDateDuration(d1, d2);

    expect(res.days).toBe(2);
    expect(res.totalDays).toBe(2);
  });

  it("handles multi-year duration across leap years", () => {
    const d1 = "2023-01-01T00:00:00.000Z";
    const d2 = "2025-03-15T00:00:00.000Z";
    const res = calculateDateDuration(d1, d2);

    expect(res.years).toBe(2);
    expect(res.months).toBe(2);
    expect(res.days).toBe(14);
  });

  it("detects reversed dates and marks isNegative true", () => {
    const d1 = "2026-06-01T00:00:00.000Z";
    const d2 = "2026-05-01T00:00:00.000Z";
    const res = calculateDateDuration(d1, d2);

    expect(res.isNegative).toBe(true);
    expect(res.months).toBe(1);
    expect(res.totalDays).toBe(31);
  });

  it("throws on invalid dates", () => {
    expect(() => calculateDateDuration("invalid", "2026-01-01")).toThrow(
      "Invalid startDate"
    );
    expect(() => calculateDateDuration("2026-01-01", "invalid")).toThrow(
      "Invalid endDate"
    );
  });
});
