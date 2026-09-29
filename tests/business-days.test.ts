import { describe, expect, it } from "vitest";
import {
  countBusinessDays,
  isBusinessDay,
  addBusinessDays,
  getBusinessDays,
} from "../src/business-days/index.js";

describe("business-days", () => {
  it("counts business days in a normal work week (exclusive)", () => {
    // 2026-06-01 is Monday, 2026-06-05 is Friday
    // Exclusive [Mon, Tue, Wed, Thu] = 4 days
    const count = countBusinessDays("2026-06-01", "2026-06-05");
    expect(count).toBe(4);
  });

  it("counts business days in a normal work week (inclusive)", () => {
    // [Mon, Tue, Wed, Thu, Fri] = 5 days
    const count = countBusinessDays("2026-06-01", "2026-06-05", {
      inclusive: true,
    });
    expect(count).toBe(5);
  });

  it("excludes weekends by default", () => {
    // 2026-06-01 (Mon) to 2026-06-08 (Mon) inclusive = 6 business days (Mon-Fri + Mon)
    const count = countBusinessDays("2026-06-01", "2026-06-08", {
      inclusive: true,
    });
    expect(count).toBe(6);
  });

  it("supports custom weekend definitions", () => {
    // Weekend is Friday (5) and Saturday (6)
    // 2026-06-01 (Mon) to 2026-06-07 (Sun)
    // Days: Mon(1), Tue(2), Wed(3), Thu(4), Sun(0) = 5 days
    const count = countBusinessDays("2026-06-01", "2026-06-07", {
      weekendDays: [5, 6],
      inclusive: true,
    });
    expect(count).toBe(5);
  });

  it("excludes supplied holidays", () => {
    // 2026-01-01 (Thu) to 2026-01-31 (Sat)
    // Jan 2026 has 22 weekdays.
    // Holiday on 2026-01-26 (Mon)
    const count = countBusinessDays("2026-01-01", "2026-01-31", {
      holidays: ["2026-01-26"],
      inclusive: true,
    });
    expect(count).toBe(21);
  });

  it("does not double-exclude holiday falling on weekend", () => {
    // Jan 2026: 2026-01-10 is Saturday
    const withHolidayOnWeekend = countBusinessDays("2026-01-01", "2026-01-31", {
      holidays: ["2026-01-10"],
      inclusive: true,
    });
    const withoutHoliday = countBusinessDays("2026-01-01", "2026-01-31", {
      inclusive: true,
    });
    expect(withHolidayOnWeekend).toBe(withoutHoliday);
  });

  it("handles leap year month boundaries", () => {
    // 2024 is leap year: Feb 28 (Wed), Feb 29 (Thu), Mar 1 (Fri)
    const count = countBusinessDays("2024-02-28", "2024-03-01", {
      inclusive: true,
    });
    expect(count).toBe(3);
  });

  it("handles year boundaries", () => {
    // 2025-12-30 (Tue), 2025-12-31 (Wed), 2026-01-01 (Thu), 2026-01-02 (Fri)
    const count = countBusinessDays("2025-12-30", "2026-01-02", {
      inclusive: true,
    });
    expect(count).toBe(4);
  });

  it("throws RangeError for reversed dates", () => {
    expect(() => countBusinessDays("2026-06-10", "2026-06-01")).toThrow(
      "start date must be before end date"
    );
  });

  it("checks if date is a business day", () => {
    expect(isBusinessDay("2026-06-01")).toBe(true); // Monday
    expect(isBusinessDay("2026-06-06")).toBe(false); // Saturday
    expect(isBusinessDay("2026-06-07")).toBe(false); // Sunday
    expect(
      isBusinessDay("2026-06-01", { holidays: ["2026-06-01"] })
    ).toBe(false);
  });

  it("adds business days forward and backward", () => {
    // 2026-06-05 is Friday. Adding 1 business day should be 2026-06-08 (Monday).
    const next = addBusinessDays("2026-06-05", 1);
    expect(next.toISOString().startsWith("2026-06-08")).toBe(true);

    // Subtracting 1 business day from 2026-06-08 (Monday) should be 2026-06-05 (Friday).
    const prev = addBusinessDays("2026-06-08", -1);
    expect(prev.toISOString().startsWith("2026-06-05")).toBe(true);

    // Adding 0 business days returns same date
    const same = addBusinessDays("2026-06-05", 0);
    expect(same.toISOString().startsWith("2026-06-05")).toBe(true);
  });

  it("gets list of business days in range", () => {
    const list = getBusinessDays("2026-06-05", "2026-06-09", {
      inclusive: true,
    });
    // 2026-06-05 (Fri), 2026-06-08 (Mon), 2026-06-09 (Tue) = 3 dates
    expect(list.length).toBe(3);
  });

  it("validates invalid date inputs", () => {
    expect(() => countBusinessDays("invalid", "2026-06-01")).toThrow(
      "Invalid startDate"
    );
    expect(() => countBusinessDays("2026-06-01", "invalid")).toThrow(
      "Invalid endDate"
    );
  });
});
