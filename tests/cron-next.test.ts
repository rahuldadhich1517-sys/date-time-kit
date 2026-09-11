import {
  describe,
  expect,
  it,
} from "vitest";

import {
  nextCronRun,
  nextCronRuns,
} from "../src/cron-next/index.js";

describe("cron-next", () => {
  it("finds the next minute", () => {
    const fromDate = new Date(
      "2026-09-11T10:00:30"
    );

    const result = nextCronRun(
      "* * * * *",
      fromDate
    );

    expect(result).toEqual(
      new Date("2026-09-11T10:01:00")
    );
  });

  it("finds the next daily run", () => {
    const fromDate = new Date(
      "2026-09-11T10:30:00"
    );

    const result = nextCronRun(
      "0 9 * * *",
      fromDate
    );

    expect(result).toEqual(
      new Date("2026-09-12T09:00:00")
    );
  });

  it("finds the next run when today's time has not passed", () => {
    const fromDate = new Date(
      "2026-09-11T08:00:00"
    );

    const result = nextCronRun(
      "0 9 * * *",
      fromDate
    );

    expect(result).toEqual(
      new Date("2026-09-11T09:00:00")
    );
  });

  it("finds weekday schedules", () => {
    const fromDate = new Date(
      "2026-09-11T10:00:00"
    );

    const result = nextCronRun(
      "0 9 * * 1-5",
      fromDate
    );

    expect(result).toEqual(
      new Date("2026-09-14T09:00:00")
    );
  });

  it("finds monthly schedules", () => {
    const fromDate = new Date(
      "2026-09-15T10:00:00"
    );

    const result = nextCronRun(
      "0 0 1 * *",
      fromDate
    );

    expect(result).toEqual(
      new Date("2026-10-01T00:00:00")
    );
  });

  it("returns multiple upcoming runs", () => {
    const fromDate = new Date(
      "2026-09-11T10:00:00"
    );

    const result = nextCronRuns(
      "*/15 * * * *",
      fromDate,
      {
        count: 3,
      }
    );

    expect(result).toEqual([
      new Date("2026-09-11T10:15:00"),
      new Date("2026-09-11T10:30:00"),
      new Date("2026-09-11T10:45:00"),
    ]);
  });

  it("does not include the from date itself", () => {
    const fromDate = new Date(
      "2026-09-11T09:00:00"
    );

    const result = nextCronRun(
      "0 9 * * *",
      fromDate
    );

    expect(result).toEqual(
      new Date("2026-09-12T09:00:00")
    );
  });

  it("handles day-of-month schedules", () => {
    const fromDate = new Date(
      "2026-09-10T12:00:00"
    );

    const result = nextCronRun(
      "30 18 15 * *",
      fromDate
    );

    expect(result).toEqual(
      new Date("2026-09-15T18:30:00")
    );
  });

it("handles day-of-week schedules", () => {
  const fromDate = new Date(
    "2026-09-11T12:00:00"
  );

  const result = nextCronRun(
    "30 18 * * 5",
    fromDate
  );

  expect(result).toEqual(
    new Date("2026-09-11T18:30:00")
  );
});

  it("supports custom iteration limits", () => {
    const fromDate = new Date(
      "2026-09-11T10:00:00"
    );

    expect(() =>
      nextCronRun(
        "0 0 1 12 *",
        fromDate,
        {
          maxIterations: 10,
        }
      )
    ).toThrow(
      "Unable to find 1 scheduled run(s) within the search limit"
    );
  });

  it("validates count", () => {
    expect(() =>
      nextCronRuns(
        "* * * * *",
        new Date(),
        {
          count: 0,
        }
      )
    ).toThrow(
      "count must be a positive integer"
    );
  });

  it("validates fromDate", () => {
    expect(() =>
      nextCronRun(
        "* * * * *",
        new Date("invalid")
      )
    ).toThrow(
      "Invalid fromDate"
    );
  });

  it("validates cron expressions", () => {
    expect(() =>
      nextCronRun(
        "invalid",
        new Date()
      )
    ).toThrow();
  });

  it("handles leap-year schedules", () => {
  const fromDate = new Date(
    "2027-01-01T00:00:00"
  );

  const result = nextCronRun(
    "0 0 29 2 *",
    fromDate,
    {
      maxIterations: 700000,
    }
  );

  expect(result).toEqual(
    new Date("2028-02-29T00:00:00")
  );
});

it("supports multiple runs with count", () => {
  const fromDate = new Date(
    "2026-09-11T10:00:00"
  );

  const result = nextCronRuns(
    "0 * * * *",
    fromDate,
    {
      count: 3,
    }
  );

  expect(result).toEqual([
    new Date("2026-09-11T11:00:00"),
    new Date("2026-09-11T12:00:00"),
    new Date("2026-09-11T13:00:00"),
  ]);
});

it("rejects invalid maxIterations", () => {
  expect(() =>
    nextCronRun(
      "* * * * *",
      new Date(),
      {
        maxIterations: 0,
      }
    )
  ).toThrow(
    "maxIterations must be a positive integer"
  );
});

it("rejects non-integer count", () => {
  expect(() =>
    nextCronRuns(
      "* * * * *",
      new Date(),
      {
        count: 1.5,
      }
    )
  ).toThrow(
    "count must be a positive integer"
  );
});

});