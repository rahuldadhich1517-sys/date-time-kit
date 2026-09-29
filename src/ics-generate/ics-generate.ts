import { parseDateInput } from "../internal/validation.js";

export interface ICSRecurrence {
  frequency: "DAILY" | "WEEKLY" | "MONTHLY" | "YEARLY";
  interval?: number;
  count?: number;
  until?: Date | string | number;
  byDay?: string | string[];
  byMonthDay?: number | number[];
  byMonth?: number | number[];
}

export interface ICSOrganizer {
  name?: string;
  email: string;
}

export interface ICSAttendee {
  name?: string;
  email: string;
  rsvp?: boolean;
  role?: string;
}

export interface ICSEvent {
  title: string;
  start: Date | string | number;
  end: Date | string | number;
  description?: string;
  location?: string;
  url?: string;
  uid?: string;
  allDay?: boolean;
  status?: "CONFIRMED" | "TENTATIVE" | "CANCELLED";
  organizer?: ICSOrganizer;
  attendees?: ICSAttendee[];
  recurrence?: ICSRecurrence;
  created?: Date | string | number;
  lastModified?: Date | string | number;
}

export interface ICSCalendarOptions {
  prodId?: string;
  calendarName?: string;
}

const DEFAULT_PRODID = "-//DateTime Toolkit//datetime-kit//EN";

export function generateICSEvent(event: ICSEvent): string {
  return generateICS(event);
}

export function generateICS(
  eventsInput: ICSEvent | ICSEvent[],
  options: ICSCalendarOptions = {}
): string {
  const events = Array.isArray(eventsInput) ? eventsInput : [eventsInput];

  if (events.length === 0) {
    throw new RangeError("At least one event is required to generate an ICS calendar");
  }

  const lines: string[] = [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    `PRODID:${options.prodId ?? DEFAULT_PRODID}`,
    "CALSCALE:GREGORIAN",
  ];

  if (options.calendarName) {
    lines.push(`X-WR-CALNAME:${escapeICS(options.calendarName)}`);
  }

  for (const event of events) {
    validateEvent(event);
    lines.push(...buildEventLines(event));
  }

  lines.push("END:VCALENDAR");

  const formattedLines = lines.map(foldLine);
  return formattedLines.join("\r\n") + "\r\n";
}

function buildEventLines(event: ICSEvent): string[] {
  const lines: string[] = ["BEGIN:VEVENT"];

  const start = parseDateInput(event.start, "start");
  const end = parseDateInput(event.end, "end");

  if (start.getTime() > end.getTime()) {
    throw new RangeError("start date must be before end date");
  }

  const uid = event.uid ?? generateUID(start);
  lines.push(`UID:${uid}`);

  const dtstamp = event.created
    ? formatICSDateTime(parseDateInput(event.created, "created"))
    : formatICSDateTime(new Date());
  lines.push(`DTSTAMP:${dtstamp}`);

  if (event.allDay) {
    lines.push(`DTSTART;VALUE=DATE:${formatICSDateOnly(start)}`);
    lines.push(`DTEND;VALUE=DATE:${formatICSDateOnly(end)}`);
  } else {
    lines.push(`DTSTART:${formatICSDateTime(start)}`);
    lines.push(`DTEND:${formatICSDateTime(end)}`);
  }

  lines.push(`SUMMARY:${escapeICS(event.title)}`);

  if (event.description) {
    lines.push(`DESCRIPTION:${escapeICS(event.description)}`);
  }

  if (event.location) {
    lines.push(`LOCATION:${escapeICS(event.location)}`);
  }

  if (event.url) {
    lines.push(`URL:${event.url}`);
  }

  if (event.status) {
    lines.push(`STATUS:${event.status}`);
  }

  if (event.lastModified) {
    const mod = parseDateInput(event.lastModified, "lastModified");
    lines.push(`LAST-MODIFIED:${formatICSDateTime(mod)}`);
  }

  if (event.organizer) {
    const cn = event.organizer.name
      ? `;CN=${escapeICS(event.organizer.name)}`
      : "";
    lines.push(`ORGANIZER${cn}:mailto:${event.organizer.email}`);
  }

  if (event.attendees) {
    for (const attendee of event.attendees) {
      const cn = attendee.name ? `;CN=${escapeICS(attendee.name)}` : "";
      const rsvp = attendee.rsvp !== undefined ? `;RSVP=${attendee.rsvp ? "TRUE" : "FALSE"}` : "";
      const role = attendee.role ? `;ROLE=${attendee.role}` : "";
      lines.push(`ATTENDEE${cn}${role}${rsvp}:mailto:${attendee.email}`);
    }
  }

  if (event.recurrence) {
    lines.push(buildRRule(event.recurrence));
  }

  lines.push("END:VEVENT");
  return lines;
}

function buildRRule(rec: ICSRecurrence): string {
  const parts: string[] = [`FREQ=${rec.frequency}`];

  if (rec.interval !== undefined) {
    if (!Number.isInteger(rec.interval) || rec.interval < 1) {
      throw new RangeError("interval must be a positive integer");
    }
    parts.push(`INTERVAL=${rec.interval}`);
  }

  if (rec.count !== undefined) {
    if (!Number.isInteger(rec.count) || rec.count < 1) {
      throw new RangeError("count must be greater than 0");
    }
    parts.push(`COUNT=${rec.count}`);
  }

  if (rec.until !== undefined) {
    const untilDate = parseDateInput(rec.until, "until");
    parts.push(`UNTIL=${formatICSDateTime(untilDate)}`);
  }

  if (rec.byDay !== undefined) {
    const days = Array.isArray(rec.byDay) ? rec.byDay.join(",") : rec.byDay;
    parts.push(`BYDAY=${days}`);
  }

  if (rec.byMonthDay !== undefined) {
    const days = Array.isArray(rec.byMonthDay)
      ? rec.byMonthDay.join(",")
      : rec.byMonthDay;
    parts.push(`BYMONTHDAY=${days}`);
  }

  if (rec.byMonth !== undefined) {
    const months = Array.isArray(rec.byMonth)
      ? rec.byMonth.join(",")
      : rec.byMonth;
    parts.push(`BYMONTH=${months}`);
  }

  return `RRULE:${parts.join(";")}`;
}

function escapeICS(text: string): string {
  return text
    .replace(/\\/g, "\\\\")
    .replace(/;/g, "\\;")
    .replace(/,/g, "\\,")
    .replace(/\r?\n/g, "\\n");
}

function foldLine(line: string): string {
  if (line.length <= 75) {
    return line;
  }

  let result = "";
  let remaining = line;
  let isFirst = true;

  while (remaining.length > 0) {
    const maxLen = isFirst ? 75 : 74;
    if (remaining.length <= maxLen) {
      result += (isFirst ? "" : "\r\n ") + remaining;
      break;
    } else {
      result += (isFirst ? "" : "\r\n ") + remaining.slice(0, maxLen);
      remaining = remaining.slice(maxLen);
      isFirst = false;
    }
  }

  return result;
}

function formatICSDateTime(date: Date): string {
  const year = date.getUTCFullYear();
  const month = String(date.getUTCMonth() + 1).padStart(2, "0");
  const day = String(date.getUTCDate()).padStart(2, "0");
  const hours = String(date.getUTCHours()).padStart(2, "0");
  const minutes = String(date.getUTCMinutes()).padStart(2, "0");
  const seconds = String(date.getUTCSeconds()).padStart(2, "0");

  return `${year}${month}${day}T${hours}${minutes}${seconds}Z`;
}

function formatICSDateOnly(date: Date): string {
  const year = date.getUTCFullYear();
  const month = String(date.getUTCMonth() + 1).padStart(2, "0");
  const day = String(date.getUTCDate()).padStart(2, "0");

  return `${year}${month}${day}`;
}

function generateUID(seedDate: Date): string {
  return `${seedDate.getTime()}-${Math.random().toString(36).slice(2, 10)}@datetime-kit`;
}

function validateEvent(event: ICSEvent): void {
  if (!event || typeof event !== "object") {
    throw new TypeError("event must be an object");
  }
  if (typeof event.title !== "string" || event.title.trim().length === 0) {
    throw new RangeError("Event title cannot be empty");
  }
}
