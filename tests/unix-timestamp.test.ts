import { describe, expect, it } from "vitest";
import {
  formatUnixTimestamp,
  fromUnixMilliseconds,
  fromUnixSeconds,
  fromUnixTimestamp,
  isoToUnix,
  toUnixMilliseconds,
  toUnixSeconds,
  toUnixTimestamp,
  unixToISO,
} from "../src/unix-timestamp/index.js";

describe("unix-timestamp", () => {
  const isoStr = "2026-09-11T12:00:00.000Z";
  const date = new Date(isoStr);
  const ms = date.getTime();
  const seconds = Math.floor(ms / 1000);

  it("converts Date and ISO string to Unix timestamp in seconds and ms", () => {
    expect(toUnixTimestamp(date, "seconds")).toBe(seconds);
    expect(toUnixTimestamp(date, "milliseconds")).toBe(ms);
    expect(toUnixTimestamp(isoStr, "seconds")).toBe(seconds);
  });

  it("converts Unix timestamp to Date in seconds and ms", () => {
    expect(fromUnixTimestamp(seconds, "seconds").toISOString()).toBe(isoStr);
    expect(fromUnixTimestamp(ms, "milliseconds").toISOString()).toBe(isoStr);
  });

  it("supports dedicated helper functions", () => {
    expect(toUnixSeconds(date)).toBe(seconds);
    expect(toUnixMilliseconds(date)).toBe(ms);
    expect(fromUnixSeconds(seconds).toISOString()).toBe(isoStr);
    expect(fromUnixMilliseconds(ms).toISOString()).toBe(isoStr);
  });

  it("converts between Unix timestamp and ISO string directly", () => {
    expect(unixToISO(seconds, "seconds")).toBe(isoStr);
    expect(unixToISO(ms, "milliseconds")).toBe(isoStr);
    expect(isoToUnix(isoStr, "seconds")).toBe(seconds);
    expect(isoToUnix(isoStr, "milliseconds")).toBe(ms);
  });

  it("formats Unix timestamps using formatUnixTimestamp", () => {
    const formatted = formatUnixTimestamp(seconds, {
      unit: "seconds",
      timeZone: "UTC",
      dateStyle: "medium",
      timeStyle: "short",
    });
    expect(formatted).toBe("Sep 11, 2026, 12:00 PM");
  });

  it("throws for non-finite timestamp numbers", () => {
    expect(() => fromUnixTimestamp(NaN)).toThrow(
      "timestamp must be a finite number"
    );
    expect(() => fromUnixTimestamp(Infinity)).toThrow(
      "timestamp must be a finite number"
    );
  });

  it("throws for out-of-range timestamps", () => {
    expect(() => fromUnixTimestamp(1e18, "milliseconds")).toThrow(
      "timestamp out of valid range"
    );
  });
});
