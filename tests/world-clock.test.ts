import { describe, expect, it } from "vitest";
import {
  getWorldClock,
  getWorldClockForCity,
} from "../src/world-clock/index.js";

describe("world-clock", () => {
  const fixedDate = new Date("2026-06-01T12:00:00.000Z");

  it("returns world clock for default timezones", () => {
    const clock = getWorldClock(undefined, { baseDate: fixedDate });
    expect(clock.length).toBeGreaterThan(0);
    expect(clock.some((entry) => entry.timezone === "Asia/Kolkata")).toBe(true);
    expect(clock.some((entry) => entry.timezone === "America/New_York")).toBe(
      true
    );
  });

  it("returns world clock for specific IANA timezones", () => {
    const clock = getWorldClock(
      ["Asia/Kolkata", "Europe/London", "Asia/Tokyo"],
      { baseDate: fixedDate }
    );

    expect(clock).toHaveLength(3);

    // 12:00 UTC -> 17:30 in Kolkata (+05:30)
    const kolkata = clock.find((c) => c.timezone === "Asia/Kolkata");
    expect(kolkata?.offset).toBe("+05:30");
    expect(kolkata?.utcOffsetMinutes).toBe(330);
    expect(kolkata?.time).toBe("17:30:00");

    // 12:00 UTC -> 13:00 in London (BST, +01:00)
    const london = clock.find((c) => c.timezone === "Europe/London");
    expect(london?.offset).toBe("+01:00");
    expect(london?.time).toBe("13:00:00");

    // 12:00 UTC -> 21:00 in Tokyo (JST, +09:00)
    const tokyo = clock.find((c) => c.timezone === "Asia/Tokyo");
    expect(tokyo?.offset).toBe("+09:00");
    expect(tokyo?.time).toBe("21:00:00");
  });

  it("resolves city names in world clock", () => {
    const clock = getWorldClock(["Delhi", "New York", "Tokyo"], {
      baseDate: fixedDate,
    });

    expect(clock[0].timezone).toBe("Asia/Kolkata");
    expect(clock[0].city).toBe("Delhi");

    expect(clock[1].timezone).toBe("America/New_York");
    expect(clock[1].city).toBe("New York");

    expect(clock[2].timezone).toBe("Asia/Tokyo");
  });

  it("fetches single city world clock using getWorldClockForCity", () => {
    const entry = getWorldClockForCity("Dubai", { baseDate: fixedDate });
    expect(entry.timezone).toBe("Asia/Dubai");
    // 12:00 UTC -> 16:00 in Dubai (+04:00)
    expect(entry.time).toBe("16:00:00");
    expect(entry.offset).toBe("+04:00");
  });

  it("throws on invalid timezone or city", () => {
    expect(() =>
      getWorldClockForCity("Invalid/City", { baseDate: fixedDate })
    ).toThrow("Invalid timezone");
  });
});
