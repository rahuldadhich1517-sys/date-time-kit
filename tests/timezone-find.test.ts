import { describe, expect, it } from "vitest";
import {
  findTimezoneByPlace,
  findTimezonesByOffset,
  isValidTimezone,
} from "../src/timezone-find/index.js";

describe("timezone-find", () => {
  it("finds timezone by city or country name", () => {
    expect(findTimezoneByPlace("India")).toBe("Asia/Kolkata");
    expect(findTimezoneByPlace("Delhi")).toBe("Asia/Kolkata");
    expect(findTimezoneByPlace("Mumbai")).toBe("Asia/Kolkata");
    expect(findTimezoneByPlace("New York")).toBe("America/New_York");
    expect(findTimezoneByPlace("London")).toBe("Europe/London");
    expect(findTimezoneByPlace("Tokyo")).toBe("Asia/Tokyo");
    expect(findTimezoneByPlace("Sydney")).toBe("Australia/Sydney");
    expect(findTimezoneByPlace("Dubai")).toBe("Asia/Dubai");
    expect(findTimezoneByPlace("Singapore")).toBe("Asia/Singapore");
  });

  it("handles case insensitivity and trimming", () => {
    expect(findTimezoneByPlace("  tokyo  ")).toBe("Asia/Tokyo");
    expect(findTimezoneByPlace("NEW YORK")).toBe("America/New_York");
    expect(findTimezoneByPlace("inDiA")).toBe("Asia/Kolkata");
  });

  it("returns timezone string itself if already valid IANA zone", () => {
    expect(findTimezoneByPlace("Asia/Kolkata")).toBe("Asia/Kolkata");
    expect(findTimezoneByPlace("Europe/Paris")).toBe("Europe/Paris");
  });

  it("returns null for unknown places", () => {
    expect(findTimezoneByPlace("Atlantis")).toBeNull();
    expect(findTimezoneByPlace("")).toBeNull();
  });

  it("finds multiple timezones by offset", () => {
    const fixedSummerDate = new Date("2026-07-01T12:00:00Z");
    const zones530 = findTimezonesByOffset("+05:30", fixedSummerDate);
    expect(zones530).toContain("Asia/Kolkata");
    expect(zones530).toContain("Asia/Colombo");

    const zones9 = findTimezonesByOffset("+09:00", fixedSummerDate);
    expect(zones9).toContain("Asia/Tokyo");
    expect(zones9).toContain("Asia/Seoul");
  });

  it("supports numeric minutes offset", () => {
    const zones = findTimezonesByOffset(330, new Date("2026-07-01T12:00:00Z"));
    expect(zones).toContain("Asia/Kolkata");
  });

  it("validates timezones with isValidTimezone", () => {
    expect(isValidTimezone("Asia/Kolkata")).toBe(true);
    expect(isValidTimezone("America/New_York")).toBe(true);
    expect(isValidTimezone("UTC")).toBe(true);
    expect(isValidTimezone("Invalid/Timezone")).toBe(false);
    expect(isValidTimezone("")).toBe(false);
  });

  it("throws on invalid offset format", () => {
    expect(() => findTimezonesByOffset("invalid")).toThrow(
      "Invalid timezone offset format"
    );
  });
});
