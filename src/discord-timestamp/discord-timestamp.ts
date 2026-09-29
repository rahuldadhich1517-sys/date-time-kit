import { parseDateInput } from "../internal/validation.js";

export type DiscordTimestampStyle =
  | "t"
  | "T"
  | "d"
  | "D"
  | "f"
  | "F"
  | "R";

const VALID_STYLES = new Set<string>(["t", "T", "d", "D", "f", "F", "R"]);

export function createDiscordTimestamp(
  date: Date | string | number,
  style?: DiscordTimestampStyle
): string {
  if (style !== undefined) {
    if (typeof style !== "string" || !VALID_STYLES.has(style)) {
      throw new RangeError(
        `Invalid Discord timestamp style: ${style}. Supported styles: t, T, d, D, f, F, R`
      );
    }
  }

  let unixSeconds: number;

  if (typeof date === "number") {
    if (!Number.isFinite(date)) {
      throw new TypeError("date must be a finite number");
    }
    // If greater than 1e11, it is in milliseconds
    unixSeconds = date > 1e11 ? Math.floor(date / 1000) : Math.floor(date);
  } else {
    const parsed = parseDateInput(date, "date");
    unixSeconds = Math.floor(parsed.getTime() / 1000);
  }

  return style ? `<t:${unixSeconds}:${style}>` : `<t:${unixSeconds}>`;
}

export const discordTimestamp = createDiscordTimestamp;
