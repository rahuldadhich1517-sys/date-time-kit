import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import {
  createCountdown,
  getCountdown,
} from "../src/countdown-timer/index.js";

describe("countdown-timer", () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("calculates countdown values correctly for future target", () => {
    const base = new Date("2026-01-01T00:00:00.000Z");
    // 2 days, 3 hours, 4 minutes, 5 seconds, 500 ms
    const target = new Date("2026-01-03T03:04:05.500Z");

    const val = getCountdown(target, base);
    expect(val.days).toBe(2);
    expect(val.hours).toBe(3);
    expect(val.minutes).toBe(4);
    expect(val.seconds).toBe(5);
    expect(val.milliseconds).toBe(500);
    expect(val.isCompleted).toBe(false);
  });

  it("handles expired target date", () => {
    const base = new Date("2026-01-05T00:00:00.000Z");
    const target = new Date("2026-01-01T00:00:00.000Z");

    const val = getCountdown(target, base);
    expect(val.days).toBe(0);
    expect(val.hours).toBe(0);
    expect(val.minutes).toBe(0);
    expect(val.seconds).toBe(0);
    expect(val.totalMilliseconds).toBe(0);
    expect(val.isCompleted).toBe(true);
  });

  it("runs live countdown with ticks and onComplete", () => {
    const now = new Date("2026-01-01T00:00:00.000Z");
    vi.setSystemTime(now);

    const target = new Date("2026-01-01T00:00:03.000Z");
    const onTick = vi.fn();
    const onComplete = vi.fn();

    const timer = createCountdown(target, {
      interval: 1000,
      onTick,
      onComplete,
    });

    timer.start();
    expect(onTick).toHaveBeenCalledTimes(1);

    vi.advanceTimersByTime(1000);
    expect(onTick).toHaveBeenCalledTimes(2);

    vi.advanceTimersByTime(2000);
    expect(onComplete).toHaveBeenCalledTimes(1);
    expect(timer.getState().isCompleted).toBe(true);
  });

  it("pauses and resumes countdown", () => {
    const now = new Date("2026-01-01T00:00:00.000Z");
    vi.setSystemTime(now);

    const target = new Date("2026-01-01T00:00:10.000Z");
    const onTick = vi.fn();

    const timer = createCountdown(target, {
      interval: 1000,
      onTick,
    });

    timer.start();
    expect(timer.getState().isRunning).toBe(true);

    vi.advanceTimersByTime(2000);
    timer.pause();
    expect(timer.getState().isPaused).toBe(true);
    expect(timer.getState().isRunning).toBe(false);

    const tickCountAtPause = onTick.mock.calls.length;
    vi.advanceTimersByTime(5000);
    // Should not tick while paused
    expect(onTick.mock.calls.length).toBe(tickCountAtPause);

    timer.resume();
    expect(timer.getState().isRunning).toBe(true);
    timer.stop();
    expect(timer.getState().isRunning).toBe(false);
  });

  it("handles immediately completed countdown", () => {
    const past = new Date(Date.now() - 10000);
    const onComplete = vi.fn();

    const timer = createCountdown(past, { onComplete });
    timer.start();

    expect(onComplete).toHaveBeenCalledTimes(1);
    expect(timer.getState().isCompleted).toBe(true);
  });

  it("throws for invalid interval", () => {
    expect(() =>
      createCountdown(new Date(), { interval: 0 })
    ).toThrow("interval must be a positive number");
    expect(() =>
      createCountdown(new Date(), { interval: -10 })
    ).toThrow("interval must be a positive number");
  });
});
