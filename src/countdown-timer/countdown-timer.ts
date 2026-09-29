import { parseDateInput } from "../internal/validation.js";

export interface CountdownValue {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  milliseconds: number;
  totalMilliseconds: number;
  isCompleted: boolean;
}

export interface CountdownOptions {
  interval?: number;
  baseDate?: Date | string | number;
  onTick?: (value: CountdownValue) => void;
  onComplete?: () => void;
}

export interface CountdownTimer {
  start(): CountdownTimer;
  pause(): CountdownTimer;
  resume(): CountdownTimer;
  stop(): CountdownTimer;
  getState(): { isRunning: boolean; isPaused: boolean; isCompleted: boolean };
  getValue(): CountdownValue;
}

export function getCountdown(
  target: Date | string | number,
  baseDate: Date | string | number = new Date()
): CountdownValue {
  const targetDate = parseDateInput(target, "target");
  const base = parseDateInput(baseDate, "baseDate");

  const diffMs = targetDate.getTime() - base.getTime();

  if (diffMs <= 0) {
    return {
      days: 0,
      hours: 0,
      minutes: 0,
      seconds: 0,
      milliseconds: 0,
      totalMilliseconds: 0,
      isCompleted: true,
    };
  }

  const days = Math.floor(diffMs / 86400000);
  const hours = Math.floor((diffMs % 86400000) / 3600000);
  const minutes = Math.floor((diffMs % 3600000) / 60000);
  const seconds = Math.floor((diffMs % 60000) / 1000);
  const milliseconds = diffMs % 1000;

  return {
    days,
    hours,
    minutes,
    seconds,
    milliseconds,
    totalMilliseconds: diffMs,
    isCompleted: false,
  };
}

export function createCountdown(
  target: Date | string | number,
  options: CountdownOptions = {}
): CountdownTimer {
  const targetDate = parseDateInput(target, "target");
  const interval = options.interval ?? 1000;

  if (!Number.isFinite(interval) || interval <= 0) {
    throw new RangeError("interval must be a positive number");
  }

  let timerId: ReturnType<typeof setInterval> | null = null;
  let isRunning = false;
  let isPaused = false;
  let isCompleted = false;
  let remainingMs = Math.max(0, targetDate.getTime() - Date.now());

  function cleanup(): void {
    if (timerId !== null) {
      clearInterval(timerId);
      timerId = null;
    }
  }

  function tick(): void {
    const value = getCountdown(targetDate);
    if (options.onTick) {
      options.onTick(value);
    }
    if (value.isCompleted) {
      isCompleted = true;
      isRunning = false;
      cleanup();
      if (options.onComplete) {
        options.onComplete();
      }
    }
  }

  const timer: CountdownTimer = {
    start() {
      if (isRunning) return timer;

      const current = getCountdown(targetDate);
      if (current.isCompleted) {
        isCompleted = true;
        if (options.onTick) options.onTick(current);
        if (options.onComplete) options.onComplete();
        return timer;
      }

      isRunning = true;
      isPaused = false;
      // immediate tick
      if (options.onTick) {
        options.onTick(current);
      }

      timerId = setInterval(tick, interval);
      return timer;
    },

    pause() {
      if (!isRunning || isPaused || isCompleted) return timer;
      isPaused = true;
      isRunning = false;
      cleanup();
      return timer;
    },

    resume() {
      if (!isPaused || isCompleted) return timer;
      return timer.start();
    },

    stop() {
      isRunning = false;
      isPaused = false;
      cleanup();
      return timer;
    },

    getState() {
      return { isRunning, isPaused, isCompleted };
    },

    getValue() {
      return getCountdown(targetDate);
    },
  };

  return timer;
}
