import { describe, expect, it } from "vitest";
import { daysUntil } from "../src/days-until/index.js";

describe("days-until", () => {
  it("returns 0 for target on the same calendar day", () => {
    const from = "2026-06-15T09:00:00.000Z";
    const target = "2026-06-15T23:00:00.000Z";
    expect(daysUntil(target, { from })).toBe(0);
  });

  it("returns 1 for target tomorrow", () => {
    const from = "2026-06-15T23:50:00.000Z";
    const target = "2026-06-16T00:10:00.000Z";
    // Even though 20 minutes apart, calendar day is tomorrow -> 1
    expect(daysUntil(target, { from })).toBe(1);
  });

  it("returns negative number for target in the past", () => {
    const from = "2026-06-15T12:00:00.000Z";
    const target = "2026-06-14T12:00:00.000Z";
    expect(daysUntil(target, { from })).toBe(-1);
  });

  it("supports inclusive option", () => {
    const from = "2026-06-15";
    const target = "2026-06-15";
    expect(daysUntil(target, { from, inclusive: true })).toBe(1);

    const tomorrow = "2026-06-16";
    expect(daysUntil(tomorrow, { from, inclusive: true })).toBe(2);
  });

  it("handles leap year calendar difference", () => {
    const from = "2024-02-28";
    const target = "2024-03-01";
    // 2024 is a leap year (Feb 29 exists), so 2 days
    expect(daysUntil(target, { from })).toBe(2);
  });

  it("respects timezone boundaries", () => {
    // 2026-06-15T19:30:00.000Z is 2026-06-16 01:00:00 in Asia/Kolkata (+05:30)
    const from = new Date("2026-06-15T19:30:00.000Z");
    const target = new Date("2026-06-16T04:00:00.000Z");

    // In UTC, from is June 15, target is June 16 -> 1 day
    expect(daysUntil(target, { from })).toBe(1);

    // In Asia/Kolkata, both are on June 16 -> 0 days
    expect(daysUntil(target, { from, timeZone: "Asia/Kolkata" })).toBe(0);
  });

  it("throws on invalid timezone or date", () => {
    expect(() =>
      daysUntil("2026-06-16", { timeZone: "Invalid/Zone" })
    ).toThrow("Invalid timezone");

    expect(() => daysUntil("invalid-date")).toThrow("Invalid target");
  });
});
