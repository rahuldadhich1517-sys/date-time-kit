import { describe, expect, it } from "vitest";
import { buildSchedule } from "../src/schedule-build/index.js";

describe("schedule-build", () => {
  it("builds contiguous schedule grid without breaks", () => {
    const slots = buildSchedule({
      start: "09:00",
      end: "11:00",
      slotDuration: 30,
    });

    expect(slots).toEqual([
      { index: 0, start: "09:00", end: "09:30", durationMinutes: 30 },
      { index: 1, start: "09:30", end: "10:00", durationMinutes: 30 },
      { index: 2, start: "10:00", end: "10:30", durationMinutes: 30 },
      { index: 3, start: "10:30", end: "11:00", durationMinutes: 30 },
    ]);
  });

  it("builds schedule grid with break durations", () => {
    const slots = buildSchedule({
      start: "09:00",
      end: "11:00",
      slotDuration: 30,
      breakDuration: 10,
    });

    expect(slots).toEqual([
      { index: 0, start: "09:00", end: "09:30", durationMinutes: 30 },
      { index: 1, start: "09:40", end: "10:10", durationMinutes: 30 },
      { index: 2, start: "10:20", end: "10:50", durationMinutes: 30 },
    ]);
  });

  it("excludes specific slots (e.g. lunch break)", () => {
    const slots = buildSchedule({
      start: "11:00",
      end: "14:00",
      slotDuration: 60,
      excludeSlots: [{ start: "12:00", end: "13:00" }],
    });

    expect(slots).toEqual([
      { index: 0, start: "11:00", end: "12:00", durationMinutes: 60 },
      { index: 1, start: "13:00", end: "14:00", durationMinutes: 60 },
    ]);
  });

  it("limits number of slots using maxSlots", () => {
    const slots = buildSchedule({
      start: "09:00",
      end: "17:00",
      slotDuration: 60,
      maxSlots: 3,
    });

    expect(slots.length).toBe(3);
    expect(slots[2].end).toBe("12:00");
  });

  it("throws when end time is not after start time", () => {
    expect(() =>
      buildSchedule({
        start: "17:00",
        end: "09:00",
        slotDuration: 30,
      })
    ).toThrow("end time must be after start time");

    expect(() =>
      buildSchedule({
        start: "09:00",
        end: "09:00",
        slotDuration: 30,
      })
    ).toThrow("end time must be after start time");
  });

  it("throws for invalid durations", () => {
    expect(() =>
      buildSchedule({
        start: "09:00",
        end: "10:00",
        slotDuration: 0,
      })
    ).toThrow("slotDuration must be greater than 0");

    expect(() =>
      buildSchedule({
        start: "09:00",
        end: "10:00",
        slotDuration: 30,
        breakDuration: -5,
      })
    ).toThrow("breakDuration must be non-negative");
  });
});
