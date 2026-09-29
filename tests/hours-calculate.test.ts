import { describe, expect, it } from "vitest";
import {
  addHours,
  formatHours,
  parseHours,
  subtractHours,
  totalHours,
} from "../src/hours-calculate/index.js";

describe("hours-calculate", () => {
  it("parses diverse time string formats", () => {
    expect(parseHours("2h 30m")).toEqual({
      hours: 2,
      minutes: 30,
      totalMinutes: 150,
      totalHours: 2.5,
      isNegative: false,
    });

    expect(parseHours("01:45")).toEqual({
      hours: 1,
      minutes: 45,
      totalMinutes: 105,
      totalHours: 1.75,
      isNegative: false,
    });

    expect(parseHours("45m")).toEqual({
      hours: 0,
      minutes: 45,
      totalMinutes: 45,
      totalHours: 0.75,
      isNegative: false,
    });

    expect(parseHours("3h")).toEqual({
      hours: 3,
      minutes: 0,
      totalMinutes: 180,
      totalHours: 3,
      isNegative: false,
    });

    expect(parseHours("-1h 30m")).toEqual({
      hours: 1,
      minutes: 30,
      totalMinutes: -90,
      totalHours: -1.5,
      isNegative: true,
    });
  });

  it("adds hours and minutes correctly", () => {
    expect(addHours("2h 30m", "1h 45m")).toBe("4h 15m");
    expect(addHours("30m", "45m", "15m")).toBe("1h 30m");
    expect(addHours()).toBe("0m");
  });

  it("subtracts hours correctly", () => {
    expect(subtractHours("4h 15m", "1h 45m")).toBe("2h 30m");
    expect(subtractHours("1h", "2h")).toBe("-1h");
  });

  it("totals an array of hours entries into decimal hours", () => {
    expect(totalHours(["2h 30m", "1h 45m", "0h 45m"])).toBe(5);
    expect(totalHours(["1:30", "2:30"])).toBe(4);
  });

  it("formats hours in short and colon formats", () => {
    expect(formatHours(150, "short")).toBe("2h 30m");
    expect(formatHours(150, "colon")).toBe("02:30");
    expect(formatHours(45, "short")).toBe("45m");
    expect(formatHours(120, "short")).toBe("2h");
    expect(formatHours(-90, "short")).toBe("-1h 30m");
    expect(formatHours(-90, "colon")).toBe("-01:30");
    expect(formatHours(0, "short")).toBe("0m");
  });

  it("throws for invalid time entries", () => {
    expect(() => parseHours("abc")).toThrow("Invalid time format");
    expect(() => parseHours("")).toThrow("Time entry cannot be empty");
    // @ts-expect-error testing invalid type
    expect(() => parseHours(null)).toThrow("Time entry must be a string or number");
  });
});
