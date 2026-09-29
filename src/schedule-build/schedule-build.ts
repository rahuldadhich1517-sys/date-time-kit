export interface TimeSlot {
  start: string;
  end: string;
}

export interface ScheduleSlot extends TimeSlot {
  index: number;
  durationMinutes: number;
}

export interface ScheduleOptions {
  start: string | Date;
  end: string | Date;
  slotDuration: number; // in minutes
  breakDuration?: number; // in minutes, default 0
  excludeSlots?: TimeSlot[];
  maxSlots?: number;
}

export function buildSchedule(options: ScheduleOptions): ScheduleSlot[] {
  if (!options || typeof options !== "object") {
    throw new TypeError("options must be an object");
  }

  const { slotDuration, breakDuration = 0, excludeSlots = [], maxSlots } = options;

  if (typeof slotDuration !== "number" || !Number.isFinite(slotDuration) || slotDuration <= 0) {
    throw new RangeError("slotDuration must be greater than 0");
  }

  if (typeof breakDuration !== "number" || !Number.isFinite(breakDuration) || breakDuration < 0) {
    throw new RangeError("breakDuration must be non-negative");
  }

  const startMinutes = parseTimeToMinutes(options.start);
  const endMinutes = parseTimeToMinutes(options.end);

  if (endMinutes <= startMinutes) {
    throw new RangeError("end time must be after start time");
  }

  const excludedRanges = excludeSlots.map((slot) => ({
    start: parseTimeToMinutes(slot.start),
    end: parseTimeToMinutes(slot.end),
  }));

  const slots: ScheduleSlot[] = [];
  let cursor = startMinutes;
  let index = 0;
  const loopLimit = 10000;
  let iterations = 0;

  while (cursor + slotDuration <= endMinutes) {
    iterations++;
    if (iterations > loopLimit) {
      throw new RangeError("Maximum schedule iterations reached");
    }

    const slotStart = cursor;
    const slotEnd = cursor + slotDuration;

    // Check if slot overlaps with any excluded slot
    const overlaps = excludedRanges.some(
      (ex) => slotStart < ex.end && slotEnd > ex.start
    );

    if (!overlaps) {
      slots.push({
        index,
        start: formatMinutesToTime(slotStart),
        end: formatMinutesToTime(slotEnd),
        durationMinutes: slotDuration,
      });
      index++;

      if (maxSlots !== undefined && slots.length >= maxSlots) {
        break;
      }
    }

    cursor = slotEnd + breakDuration;
  }

  return slots;
}

function parseTimeToMinutes(timeInput: string | Date): number {
  if (timeInput instanceof Date) {
    if (Number.isNaN(timeInput.getTime())) {
      throw new RangeError("Invalid date for schedule time");
    }
    return timeInput.getUTCHours() * 60 + timeInput.getUTCMinutes();
  }

  if (typeof timeInput !== "string") {
    throw new TypeError("Schedule time must be a string or Date");
  }

  const trimmed = timeInput.trim();
  const match = trimmed.match(/^(\d{1,2}):(\d{2})(?::(\d{2}))?$/);
  if (!match) {
    throw new RangeError(`Invalid time format: ${timeInput}. Expected HH:mm`);
  }

  const hours = Number(match[1]);
  const minutes = Number(match[2]);

  if (hours < 0 || hours > 24 || (hours === 24 && minutes > 0) || minutes < 0 || minutes > 59) {
    throw new RangeError(`Invalid time values: ${timeInput}`);
  }

  return hours * 60 + minutes;
}

function formatMinutesToTime(totalMinutes: number): string {
  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;
  return `${String(hours).padStart(2, "0")}:${String(minutes).padStart(2, "0")}`;
}
