import { describe, expect, it } from "vitest";

import {
  toUnixTimestamp,
  fromUnixTimestamp,
  toISOString,
  fromISOString,
} from "../src/timestamp/index.js";

describe("timestamp", () => {
  const date = new Date(
    "2026-09-11T10:00:00.000Z"
  );

  it("converts Date to milliseconds", () => {
    expect(toUnixTimestamp(date)).toBe(
      date.getTime()
    );
  });

  it("converts Date to seconds", () => {
    expect(
      toUnixTimestamp(date, "seconds")
    ).toBe(
      Math.floor(date.getTime() / 1000)
    );
  });

  it("converts milliseconds to Date", () => {
    expect(
      fromUnixTimestamp(date.getTime())
        .toISOString()
    ).toBe(date.toISOString());
  });

  it("converts seconds to Date", () => {
    expect(
      fromUnixTimestamp(
        Math.floor(date.getTime() / 1000),
        "seconds"
      ).toISOString()
    ).toBe(date.toISOString());
  });

  it("converts Date to ISO", () => {
    expect(toISOString(date)).toBe(
      "2026-09-11T10:00:00.000Z"
    );
  });

  it("converts ISO to Date", () => {
    expect(
      fromISOString(
        "2026-09-11T10:00:00.000Z"
      ).toISOString()
    ).toBe("2026-09-11T10:00:00.000Z");
  });

  it("throws for invalid Date", () => {
    expect(() =>
      toUnixTimestamp(new Date("invalid"))
    ).toThrow("Invalid date");
  });

  it("throws for invalid ISO value", () => {
    expect(() =>
      fromISOString("not-a-date")
    ).toThrow("Invalid date");
  });

  it("throws for non-finite timestamp", () => {
    expect(() =>
      fromUnixTimestamp(Infinity)
    ).toThrow(
      "timestamp must be a finite number"
    );
  });
});