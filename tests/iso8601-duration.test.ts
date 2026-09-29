import { describe, expect, it } from "vitest";
import {
  buildISO8601Duration,
  parseISO8601Duration,
} from "../src/iso8601-duration/index.js";

describe("iso8601-duration", () => {
  it("parses full ISO 8601 duration strings", () => {
    const parsed = parseISO8601Duration("P3Y6M4DT12H30M5S");
    expect(parsed).toEqual({
      years: 3,
      months: 6,
      days: 4,
      hours: 12,
      minutes: 30,
      seconds: 5,
    });
  });

  it("parses time-only duration strings", () => {
    expect(parseISO8601Duration("PT30M")).toEqual({
      minutes: 30,
    });
    expect(parseISO8601Duration("PT1H45M30S")).toEqual({
      hours: 1,
      minutes: 45,
      seconds: 30,
    });
  });

  it("parses week and day durations", () => {
    expect(parseISO8601Duration("P1W")).toEqual({
      weeks: 1,
    });
    expect(parseISO8601Duration("P1D")).toEqual({
      days: 1,
    });
  });

  it("parses zero duration", () => {
    expect(parseISO8601Duration("PT0S")).toEqual({
      seconds: 0,
    });
  });

  it("builds ISO 8601 duration strings", () => {
    expect(
      buildISO8601Duration({
        years: 1,
        months: 2,
        days: 10,
        hours: 3,
        minutes: 20,
      })
    ).toBe("P1Y2M10DT3H20M");

    expect(buildISO8601Duration({ minutes: 30 })).toBe("PT30M");
    expect(buildISO8601Duration({ days: 1 })).toBe("P1D");
    expect(buildISO8601Duration({ weeks: 2 })).toBe("P2W");
    expect(buildISO8601Duration({})).toBe("PT0S");
    expect(buildISO8601Duration({ seconds: 0 })).toBe("PT0S");
  });

  it("handles round-trip formatting and parsing", () => {
    const raw = "P1Y2M10DT3H20M";
    const parsed = parseISO8601Duration(raw);
    const built = buildISO8601Duration(parsed);
    expect(built).toBe(raw);
  });

  it("throws on invalid ISO 8601 strings", () => {
    expect(() => parseISO8601Duration("invalid")).toThrow(
      "invalid ISO 8601 duration"
    );
    expect(() => parseISO8601Duration("P")).toThrow(
      "invalid ISO 8601 duration"
    );
    expect(() => parseISO8601Duration("PT")).toThrow(
      "invalid ISO 8601 duration"
    );
    expect(() => parseISO8601Duration("")).toThrow(
      "invalid ISO 8601 duration"
    );
  });

  it("throws on invalid builder components", () => {
    expect(() => buildISO8601Duration({ days: -5 })).toThrow(
      "days must be a non-negative number"
    );
  });
});
