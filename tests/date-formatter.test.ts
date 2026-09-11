import { describe, expect, it } from "vitest";

import {
  formatDate,
} from "../src/date-formatter/index.js";

describe("date-formatter", () => {
  const date = new Date(
    "2026-09-11T10:30:00.000Z"
  );

  it("formats using the default options", () => {
    expect(formatDate(date)).toBe(
      "Sep 11, 2026"
    );
  });

  it("supports short format", () => {
    expect(
      formatDate(date, {
        format: "short",
      })
    ).toBe("9/11/26");
  });

  it("supports long format", () => {
    expect(
      formatDate(date, {
        format: "long",
      })
    ).toBe("September 11, 2026");
  });

  it("supports full format", () => {
    expect(
      formatDate(date, {
        format: "full",
      })
    ).toBe(
      "Friday, September 11, 2026"
    );
  });

  it("supports ISO format", () => {
    expect(
      formatDate(date, {
        format: "iso",
      })
    ).toBe(
      "2026-09-11T10:30:00.000Z"
    );
  });

  it("supports different locales", () => {
    expect(
      formatDate(date, {
        locale: "en-GB",
        format: "long",
      })
    ).toBe("11 September 2026");
  });

  it("supports timezones", () => {
    expect(
      formatDate(date, {
        locale: "en-US",
        timeZone: "Asia/Kolkata",
        format: "long",
      })
    ).toBe("September 11, 2026");
  });

  it("throws for invalid dates", () => {
    expect(() =>
      formatDate(new Date("invalid"))
    ).toThrow("Invalid date");
  });
});