import { describe, expect, it } from "vitest";
import {
  getHoliday,
  getHolidays,
  getSupportedHolidayCountries,
  isHoliday,
} from "../src/holidays-lookup/index.js";

describe("holidays-lookup", () => {
  it("returns India holidays including Republic Day and Independence Day", () => {
    const holidays = getHolidays("IN", 2026);
    expect(holidays.some((h) => h.name === "Republic Day" && h.date === "2026-01-26")).toBe(true);
    expect(holidays.some((h) => h.name === "Independence Day" && h.date === "2026-08-15")).toBe(true);
    expect(holidays.some((h) => h.name === "Mahatma Gandhi Jayanti" && h.date === "2026-10-02")).toBe(true);
  });

  it("returns US federal holidays including 4th of July and Thanksgiving", () => {
    const holidays = getHolidays("US", 2026);
    expect(holidays.some((h) => h.name === "Independence Day" && h.date === "2026-07-04")).toBe(true);
    // In 2026, 4th Thursday in November is Nov 26
    expect(holidays.some((h) => h.name === "Thanksgiving Day" && h.date === "2026-11-26")).toBe(true);
  });

  it("returns UK bank holidays including Good Friday and Boxing Day", () => {
    const holidays = getHolidays("GB", 2026);
    expect(holidays.some((h) => h.name === "Boxing Day" && h.date === "2026-12-26")).toBe(true);
    expect(holidays.some((h) => h.name === "Good Friday")).toBe(true);
  });

  it("returns Canada holidays including Canada Day", () => {
    const holidays = getHolidays("CA", 2026);
    expect(holidays.some((h) => h.name === "Canada Day" && h.date === "2026-07-01")).toBe(true);
  });

  it("returns Australia holidays including Anzac Day", () => {
    const holidays = getHolidays("AU", 2026);
    expect(holidays.some((h) => h.name === "Anzac Day" && h.date === "2026-04-25")).toBe(true);
    expect(holidays.some((h) => h.name === "Australia Day" && h.date === "2026-01-26")).toBe(true);
  });

  it("checks whether a date is a holiday using isHoliday", () => {
    expect(isHoliday("2026-01-26", "IN")).toBe(true);
    expect(isHoliday("2026-01-27", "IN")).toBe(false);
  });

  it("gets holiday details using getHoliday", () => {
    const holiday = getHoliday("2026-01-26", "IN");
    expect(holiday).not.toBeNull();
    expect(holiday?.name).toBe("Republic Day");
    expect(holiday?.country).toBe("IN");

    const nonHoliday = getHoliday("2026-01-27", "IN");
    expect(nonHoliday).toBeNull();
  });

  it("supports country aliases", () => {
    expect(isHoliday("2026-07-04", "USA")).toBe(true);
    expect(isHoliday("2026-07-04", "United States")).toBe(true);
    expect(isHoliday("2026-01-26", "India")).toBe(true);
    expect(isHoliday("2026-12-26", "UK")).toBe(true);
  });

  it("returns list of supported countries", () => {
    const countries = getSupportedHolidayCountries();
    expect(countries).toEqual(["IN", "US", "GB", "CA", "AU"]);
  });

  it("throws on unsupported country", () => {
    expect(() => getHolidays("XX", 2026)).toThrow("Unsupported holiday country");
  });

  it("throws on invalid year", () => {
    expect(() => getHolidays("IN", 99)).toThrow("year must be a 4-digit integer");
  });
});
