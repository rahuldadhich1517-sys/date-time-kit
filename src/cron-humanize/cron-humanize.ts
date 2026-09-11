import {
  parseCron,
  type ParsedCron,
} from "../cron-parser/index.js";

const MONTH_NAMES = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

const DAY_NAMES = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
];

export function humanizeCron(
  expression: string
): string {
  const cron = parseCron(expression);

  return humanizeParsedCron(cron);
}

function humanizeParsedCron(
  cron: ParsedCron
): string {
  const {
    minute,
    hour,
    dayOfMonth,
    month,
    dayOfWeek,
  } = cron.fields;

  if (
    isEveryValue(minute.values, 0, 59) &&
    isEveryValue(hour.values, 0, 23) &&
    isEveryValue(
      dayOfMonth.values,
      1,
      31
    ) &&
    isEveryValue(month.values, 1, 12) &&
    isEveryValue(
      dayOfWeek.values,
      0,
      6
    )
  ) {
    return "Every minute";
  }

  if (
    isStepExpression(minute.expression) &&
    isEveryValue(hour.values, 0, 23) &&
    isEveryValue(
      dayOfMonth.values,
      1,
      31
    ) &&
    isEveryValue(month.values, 1, 12) &&
    isEveryValue(
      dayOfWeek.values,
      0,
      6
    )
  ) {
    const step = getStep(
      minute.expression
    );

    return `Every ${step} minutes`;
  }

  const time = formatTime(
    minute.values,
    hour.values
  );

  const scheduleParts: string[] = [];

  if (
    !isEveryValue(
      dayOfWeek.values,
      0,
      6
    )
  ) {
    scheduleParts.push(
      formatDaysOfWeek(
        dayOfWeek.values
      )
    );
  }

  if (
    !isEveryValue(
      dayOfMonth.values,
      1,
      31
    )
  ) {
    scheduleParts.push(
      formatDaysOfMonth(
        dayOfMonth.values
      )
    );
  }

  if (
    !isEveryValue(
      month.values,
      1,
      12
    )
  ) {
    scheduleParts.push(
      formatMonths(month.values)
    );
  }

  if (
    scheduleParts.length === 0 &&
    isEveryValue(
      hour.values,
      0,
      23
    ) &&
    minute.values.length === 1
  ) {
    return `Every hour at minute ${minute.values[0]}`;
  }

  if (scheduleParts.length === 0) {
    return `Every day at ${time}`;
  }

  return `${scheduleParts.join(
    ", "
  )} at ${time}`;
}

function formatTime(
  minutes: number[],
  hours: number[]
): string {
  if (
    hours.length !== 1 ||
    minutes.length !== 1
  ) {
    return formatComplexTime(
      minutes,
      hours
    );
  }

  const hour = hours[0];
  const minute = minutes[0];

  const period =
    hour >= 12 ? "PM" : "AM";

  const displayHour =
    hour % 12 || 12;

  return `${displayHour}:${String(
    minute
  ).padStart(2, "0")} ${period}`;
}

function formatComplexTime(
  minutes: number[],
  hours: number[]
): string {
  if (
    hours.length === 24 &&
    minutes.length === 60
  ) {
    return "any time";
  }

  if (minutes.length === 1) {
    return `minute ${minutes[0]}`;
  }

  return `${hours
    .map((hour) => {
      const period =
        hour >= 12 ? "PM" : "AM";

      const displayHour =
        hour % 12 || 12;

      return `${displayHour}:${String(
        minutes[0] ?? 0
      ).padStart(2, "0")} ${period}`;
    })
    .join(", ")}`;
}

function formatDaysOfWeek(
  values: number[]
): string {
  if (
    values.length === 5 &&
    values.every(
      (value) =>
        value >= 1 && value <= 5
    )
  ) {
    return "Every weekday";
  }

  if (
    values.length === 2 &&
    values.includes(0) &&
    values.includes(6)
  ) {
    return "Every weekend";
  }

  if (values.length === 1) {
    return `Every ${DAY_NAMES[values[0]]}`;
  }

  return `Every ${joinNatural(
    values.map(
      (value) => DAY_NAMES[value]
    )
  )}`;
}

function formatDaysOfMonth(
  values: number[]
): string {
  if (values.length === 1) {
    return `on day ${values[0]} of the month`;
  }

  return `on days ${joinNatural(
    values.map(String)
  )} of the month`;
}

function formatMonths(
  values: number[]
): string {
  if (values.length === 1) {
    return `in ${MONTH_NAMES[values[0] - 1]}`;
  }

  return `in ${joinNatural(
    values.map(
      (value) =>
        MONTH_NAMES[value - 1]
    )
  )}`;
}

function joinNatural(
  values: string[]
): string {
  if (values.length === 0) {
    return "";
  }

  if (values.length === 1) {
    return values[0];
  }

  if (values.length === 2) {
    return `${values[0]} and ${values[1]}`;
  }

  return `${values
    .slice(0, -1)
    .join(", ")}, and ${
    values[values.length - 1]
  }`;
}

function isEveryValue(
  values: number[],
  min: number,
  max: number
): boolean {
  if (values.length !== max - min + 1) {
    return false;
  }

  return values.every(
    (value, index) =>
      value === min + index
  );
}

function isStepExpression(
  expression: string
): boolean {
  return expression.startsWith("*/");
}

function getStep(
  expression: string
): number {
  return Number(
    expression.slice(2)
  );
}