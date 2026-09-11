import { describe, expect, it } from "vitest";

import {
  parseCron,
  isValidCron,
} from "../src/cron-parser/index.js";

describe("cron-parser", () => {
  it("parses wildcard expressions", () => {
    const result = parseCron(
      "* * * * *"
    );

    expect(
      result.fields.minute.values
    ).toHaveLength(60);

    expect(
      result.fields.hour.values
    ).toHaveLength(24);

    expect(
      result.fields.dayOfMonth.values
    ).toHaveLength(31);

    expect(
      result.fields.month.values
    ).toHaveLength(12);

    expect(
      result.fields.dayOfWeek.values
    ).toHaveLength(7);
  });

  it("parses specific values", () => {
    const result = parseCron(
      "30 18 * * 5"
    );

    expect(
      result.fields.minute.values
    ).toEqual([30]);

    expect(
      result.fields.hour.values
    ).toEqual([18]);

    expect(
      result.fields.dayOfWeek.values
    ).toEqual([5]);
  });

  it("parses ranges", () => {
    const result = parseCron(
      "0 9 * * 1-5"
    );

    expect(
      result.fields.dayOfWeek.values
    ).toEqual([
      1,
      2,
      3,
      4,
      5,
    ]);
  });

  it("parses lists", () => {
    const result = parseCron(
      "0,15,30,45 * * * *"
    );

    expect(
      result.fields.minute.values
    ).toEqual([
      0,
      15,
      30,
      45,
    ]);
  });

  it("parses steps", () => {
    const result = parseCron(
      "*/15 * * * *"
    );

    expect(
      result.fields.minute.values
    ).toEqual([
      0,
      15,
      30,
      45,
    ]);
  });

  it("parses range steps", () => {
    const result = parseCron(
      "0-20/5 * * * *"
    );

    expect(
      result.fields.minute.values
    ).toEqual([
      0,
      5,
      10,
      15,
      20,
    ]);
  });

  it("removes duplicate values", () => {
    const result = parseCron(
      "1,1,2,2 * * * *"
    );

    expect(
      result.fields.minute.values
    ).toEqual([
      1,
      2,
    ]);
  });

  it("normalizes whitespace", () => {
    const result = parseCron(
      "  0   9   *   *   1-5  "
    );

    expect(
      result.expression
    ).toBe(
      "0   9   *   *   1-5"
    );
  });

  it("validates valid expressions", () => {
    expect(
      isValidCron("*/5 * * * *")
    ).toBe(true);

    expect(
      isValidCron("0 9 * * 1-5")
    ).toBe(true);
  });

  it("rejects wrong field count", () => {
    expect(() =>
      parseCron("* * * *")
    ).toThrow(
      "Cron expression must contain exactly 5 fields"
    );
  });

  it("rejects empty expressions", () => {
    expect(() =>
      parseCron("")
    ).toThrow(
      "Cron expression cannot be empty"
    );
  });

  it("rejects invalid minute values", () => {
    expect(() =>
      parseCron("60 * * * *")
    ).toThrow(
      "minute value must be between 0 and 59"
    );
  });

  it("rejects invalid hour values", () => {
    expect(() =>
      parseCron("* 24 * * *")
    ).toThrow(
      "hour value must be between 0 and 23"
    );
  });

  it("rejects invalid month values", () => {
    expect(() =>
      parseCron("* * * 13 *")
    ).toThrow(
      "month value must be between 1 and 12"
    );
  });

  it("rejects invalid day of week values", () => {
    expect(() =>
      parseCron("* * * * 7")
    ).toThrow(
      "dayOfWeek value must be between 0 and 6"
    );
  });

  it("rejects reversed ranges", () => {
    expect(() =>
      parseCron("30-10 * * * *")
    ).toThrow(
      "minute range start cannot be greater than end"
    );
  });

  it("rejects invalid steps", () => {
    expect(() =>
      parseCron("*/0 * * * *")
    ).toThrow(
      "Step must be greater than 0"
    );
  });

  it("rejects steps without wildcard or range", () => {
    expect(() =>
      parseCron("5/2 * * * *")
    ).toThrow(
      "Step requires * or a range"
    );
  });

  it("rejects malformed fields", () => {
    expect(() =>
      parseCron("abc * * * *")
    ).toThrow(
      "Invalid value in minute field: abc"
    );
  });

  it("returns false for invalid expressions", () => {
    expect(
      isValidCron("invalid cron")
    ).toBe(false);
  });
});