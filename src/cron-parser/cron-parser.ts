export type CronFieldName =
  | "minute"
  | "hour"
  | "dayOfMonth"
  | "month"
  | "dayOfWeek";

export interface CronField {
  name: CronFieldName;
  expression: string;
  values: number[];
}

export interface ParsedCron {
  expression: string;
  fields: {
    minute: CronField;
    hour: CronField;
    dayOfMonth: CronField;
    month: CronField;
    dayOfWeek: CronField;
  };
}

interface FieldDefinition {
  name: CronFieldName;
  min: number;
  max: number;
}

const FIELD_DEFINITIONS: FieldDefinition[] = [
  {
    name: "minute",
    min: 0,
    max: 59,
  },
  {
    name: "hour",
    min: 0,
    max: 23,
  },
  {
    name: "dayOfMonth",
    min: 1,
    max: 31,
  },
  {
    name: "month",
    min: 1,
    max: 12,
  },
  {
    name: "dayOfWeek",
    min: 0,
    max: 6,
  },
];

export function parseCron(
  expression: string
): ParsedCron {
  if (typeof expression !== "string") {
    throw new TypeError(
      "Cron expression must be a string"
    );
  }

  const normalized = expression.trim();

  if (!normalized) {
    throw new RangeError(
      "Cron expression cannot be empty"
    );
  }

  const parts = normalized.split(/\s+/);

  if (parts.length !== 5) {
    throw new RangeError(
      "Cron expression must contain exactly 5 fields"
    );
  }

  const parsedFields = FIELD_DEFINITIONS.map(
    (definition, index) =>
      parseField(
        parts[index],
        definition
      )
  );

  return {
    expression: normalized,
    fields: {
      minute: parsedFields[0],
      hour: parsedFields[1],
      dayOfMonth: parsedFields[2],
      month: parsedFields[3],
      dayOfWeek: parsedFields[4],
    },
  };
}

export function isValidCron(
  expression: string
): boolean {
  try {
    parseCron(expression);
    return true;
  } catch {
    return false;
  }
}

function parseField(
  expression: string,
  definition: FieldDefinition
): CronField {
  if (!expression) {
    throw new RangeError(
      `${definition.name} field cannot be empty`
    );
  }

  const values = new Set<number>();

  for (const part of expression.split(",")) {
    if (!part) {
      throw new RangeError(
        `Invalid ${definition.name} field: ${expression}`
      );
    }

    parsePart(
      part,
      definition
    ).forEach((value) =>
      values.add(value)
    );
  }

  const sortedValues = [...values].sort(
    (a, b) => a - b
  );

  if (sortedValues.length === 0) {
    throw new RangeError(
      `Invalid ${definition.name} field: ${expression}`
    );
  }

  return {
    name: definition.name,
    expression,
    values: sortedValues,
  };
}

function parsePart(
  part: string,
  definition: FieldDefinition
): number[] {
  const [base, stepText] =
    part.split("/");

  if (
    part.split("/").length > 2
  ) {
    throw new RangeError(
      `Invalid ${definition.name} field: ${part}`
    );
  }

  let step = 1;

  if (stepText !== undefined) {
    if (!/^\d+$/.test(stepText)) {
      throw new RangeError(
        `Invalid step in ${definition.name} field: ${part}`
      );
    }

    step = Number(stepText);

    if (step < 1) {
      throw new RangeError(
        `Step must be greater than 0 in ${definition.name} field`
      );
    }
  }

  if (base === "*") {
    return createRange(
      definition.min,
      definition.max,
      step
    );
  }

  const rangeMatch =
    base.match(
      /^(\d+)-(\d+)$/
    );

  if (rangeMatch) {
    const start = Number(
      rangeMatch[1]
    );
    const end = Number(
      rangeMatch[2]
    );

    validateRange(
      start,
      end,
      definition
    );

    return createRange(
      start,
      end,
      step
    );
  }

  if (
    stepText !== undefined
  ) {
    throw new RangeError(
      `Step requires * or a range in ${definition.name} field`
    );
  }

  if (!/^\d+$/.test(base)) {
    throw new RangeError(
      `Invalid value in ${definition.name} field: ${base}`
    );
  }

  const value = Number(base);

  validateValue(
    value,
    definition
  );

  return [value];
}

function createRange(
  start: number,
  end: number,
  step: number
): number[] {
  const values: number[] = [];

  for (
    let value = start;
    value <= end;
    value += step
  ) {
    values.push(value);
  }

  return values;
}

function validateValue(
  value: number,
  definition: FieldDefinition
): void {
  if (
    value < definition.min ||
    value > definition.max
  ) {
    throw new RangeError(
      `${definition.name} value must be between ${definition.min} and ${definition.max}`
    );
  }
}

function validateRange(
  start: number,
  end: number,
  definition: FieldDefinition
): void {
  validateValue(start, definition);
  validateValue(end, definition);

  if (start > end) {
    throw new RangeError(
      `${definition.name} range start cannot be greater than end`
    );
  }
}