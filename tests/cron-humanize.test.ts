import {
  describe,
  expect,
  it,
} from "vitest";

import {
  humanizeCron,
} from "../src/cron-humanize/index.js";

describe("cron-humanize", () => {
  it("humanizes every minute", () => {
    expect(
      humanizeCron("* * * * *")
    ).toBe("Every minute");
  });

  it("humanizes minute steps", () => {
    expect(
      humanizeCron("*/5 * * * *")
    ).toBe("Every 5 minutes");
  });

  it("humanizes hourly schedules", () => {
    expect(
      humanizeCron("0 * * * *")
    ).toBe("Every hour at minute 0");
  });

  it("humanizes daily schedules", () => {
    expect(
      humanizeCron("0 9 * * *")
    ).toBe(
      "Every day at 9:00 AM"
    );
  });

  it("humanizes weekday schedules", () => {
    expect(
      humanizeCron("0 9 * * 1-5")
    ).toBe(
      "Every weekday at 9:00 AM"
    );
  });

  it("humanizes a specific weekday", () => {
    expect(
      humanizeCron("30 18 * * 5")
    ).toBe(
      "Every Friday at 6:30 PM"
    );
  });

  it("humanizes weekend schedules", () => {
    expect(
      humanizeCron("0 10 * * 0,6")
    ).toBe(
      "Every weekend at 10:00 AM"
    );
  });

  it("humanizes monthly schedules", () => {
    expect(
      humanizeCron("0 0 1 * *")
    ).toBe(
      "on day 1 of the month at 12:00 AM"
    );
  });

  it("humanizes a specific month", () => {
    expect(
      humanizeCron("0 9 * 1 *")
    ).toBe(
      "in January at 9:00 AM"
    );
  });

  it("humanizes multiple weekdays", () => {
    expect(
      humanizeCron("0 9 * * 1,3,5")
    ).toBe(
      "Every Monday, Wednesday, and Friday at 9:00 AM"
    );
  });

  it("rejects invalid cron expressions", () => {
    expect(() =>
      humanizeCron("invalid")
    ).toThrow();
  });
});