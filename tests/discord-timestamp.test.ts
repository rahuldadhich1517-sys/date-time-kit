import { describe, expect, it } from "vitest";
import {
  createDiscordTimestamp,
  discordTimestamp,
  type DiscordTimestampStyle,
} from "../src/discord-timestamp/index.js";

describe("discord-timestamp", () => {
  const fixedDate = new Date("2026-09-11T12:00:00.000Z");
  const expectedSeconds = Math.floor(fixedDate.getTime() / 1000);

  it("creates default markup without style", () => {
    expect(createDiscordTimestamp(fixedDate)).toBe(`<t:${expectedSeconds}>`);
    expect(discordTimestamp(fixedDate)).toBe(`<t:${expectedSeconds}>`);
  });

  const styles: DiscordTimestampStyle[] = ["t", "T", "d", "D", "f", "F", "R"];
  for (const style of styles) {
    it(`supports style '${style}'`, () => {
      expect(createDiscordTimestamp(fixedDate, style)).toBe(
        `<t:${expectedSeconds}:${style}>`
      );
    });
  }

  it("handles ISO string input", () => {
    expect(createDiscordTimestamp("2026-09-11T12:00:00.000Z", "R")).toBe(
      `<t:${expectedSeconds}:R>`
    );
  });

  it("handles Unix seconds number input", () => {
    expect(createDiscordTimestamp(1760000000, "d")).toBe("<t:1760000000:d>");
  });

  it("handles Unix milliseconds number input", () => {
    expect(createDiscordTimestamp(1760000000000, "d")).toBe(
      "<t:1760000000:d>"
    );
  });

  it("throws on invalid style", () => {
    expect(() =>
      // @ts-expect-error testing invalid style
      createDiscordTimestamp(fixedDate, "X")
    ).toThrow("Invalid Discord timestamp style");
  });

  it("throws on invalid date input", () => {
    expect(() => createDiscordTimestamp("invalid-date")).toThrow(
      "Invalid date"
    );
  });
});
