import { describe, expect, it } from "vitest";
import {
  generateICS,
  generateICSEvent,
} from "../src/ics-generate/index.js";

describe("ics-generate", () => {
  it("generates a valid basic ICS event", () => {
    const ics = generateICS({
      title: "Team Sync",
      start: "2026-10-01T10:00:00Z",
      end: "2026-10-01T11:00:00Z",
      description: "Weekly sync meeting",
      location: "Room 101, Headquarters",
      uid: "test-uid-123",
      created: "2026-09-01T00:00:00Z",
    });

    expect(ics).toContain("BEGIN:VCALENDAR\r\n");
    expect(ics).toContain("VERSION:2.0\r\n");
    expect(ics).toContain("BEGIN:VEVENT\r\n");
    expect(ics).toContain("UID:test-uid-123\r\n");
    expect(ics).toContain("DTSTART:20261001T100000Z\r\n");
    expect(ics).toContain("DTEND:20261001T110000Z\r\n");
    expect(ics).toContain("SUMMARY:Team Sync\r\n");
    expect(ics).toContain("LOCATION:Room 101\\, Headquarters\r\n");
    expect(ics).toContain("END:VEVENT\r\n");
    expect(ics).toContain("END:VCALENDAR\r\n");
    expect(ics.endsWith("\r\n")).toBe(true);
  });

  it("generates all-day event correctly", () => {
    const ics = generateICSEvent({
      title: "Company Holiday",
      start: "2026-12-25",
      end: "2026-12-26",
      allDay: true,
      uid: "holiday-uid",
      created: "2026-01-01T00:00:00Z",
    });

    expect(ics).toContain("DTSTART;VALUE=DATE:20261225\r\n");
    expect(ics).toContain("DTEND;VALUE=DATE:20261226\r\n");
  });

  it("escapes special characters correctly", () => {
    const ics = generateICS({
      title: "Project; Planning, & Review",
      start: "2026-10-01T10:00:00Z",
      end: "2026-10-01T11:00:00Z",
      description: "Line 1\nLine 2\\with backslash; and comma,",
      uid: "escape-uid",
      created: "2026-01-01T00:00:00Z",
    });

    expect(ics).toContain("SUMMARY:Project\\; Planning\\, & Review\r\n");
    expect(ics).toContain("DESCRIPTION:Line 1\\nLine 2\\\\with backslash\\; and comma\\,\r\n");
  });

  it("folds long lines according to RFC 5545", () => {
    const longDesc =
      "This is an extremely long meeting description intended to test whether lines longer than 75 octets are properly folded using CRLF and space according to the iCalendar specification RFC 5545.";

    const ics = generateICS({
      title: "Long Description Event",
      start: "2026-10-01T10:00:00Z",
      end: "2026-10-01T11:00:00Z",
      description: longDesc,
      uid: "fold-uid",
      created: "2026-01-01T00:00:00Z",
    });

    // Check that there is a folded line with \r\n followed by space
    expect(ics).toContain("DESCRIPTION:This is an extremely");
    expect(ics).toContain("\r\n whether lines longer than 75 octets are properly folded");
    expect(ics).toMatch(/\r\n /);
  });

  it("supports recurrence rules (RRULE)", () => {
    const ics = generateICS({
      title: "Weekly Standup",
      start: "2026-10-01T09:00:00Z",
      end: "2026-10-01T09:30:00Z",
      uid: "rrule-uid",
      created: "2026-01-01T00:00:00Z",
      recurrence: {
        frequency: "WEEKLY",
        interval: 2,
        count: 10,
        byDay: ["MO", "WE", "FR"],
      },
    });

    expect(ics).toContain("RRULE:FREQ=WEEKLY;INTERVAL=2;COUNT=10;BYDAY=MO,WE,FR\r\n");
  });

  it("supports organizer and attendees", () => {
    const ics = generateICS({
      title: "Performance Review",
      start: "2026-10-01T14:00:00Z",
      end: "2026-10-01T15:00:00Z",
      uid: "review-uid",
      created: "2026-01-01T00:00:00Z",
      organizer: {
        name: "Jane Doe",
        email: "jane@example.com",
      },
      attendees: [
        {
          name: "John",
          email: "j@example.com",
          rsvp: true,
          role: "REQ-PARTICIPANT",
        },
      ],
    });

    expect(ics).toContain("ORGANIZER;CN=Jane Doe:mailto:jane@example.com\r\n");
    expect(ics).toContain(
      "ATTENDEE;CN=John;ROLE=REQ-PARTICIPANT;RSVP=TRUE:mailto:j@example.com\r\n"
    );
  });

  it("throws on reversed dates", () => {
    expect(() =>
      generateICS({
        title: "Bad Event",
        start: "2026-10-02T10:00:00Z",
        end: "2026-10-01T10:00:00Z",
      })
    ).toThrow("start date must be before end date");
  });

  it("throws on invalid recurrence count", () => {
    expect(() =>
      generateICS({
        title: "Bad Recurrence",
        start: "2026-10-01T10:00:00Z",
        end: "2026-10-01T11:00:00Z",
        recurrence: {
          frequency: "DAILY",
          count: 0,
        },
      })
    ).toThrow("count must be greater than 0");
  });
});
