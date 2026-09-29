export function toDateString(
  year: number,
  month: number,
  day: number
): string {
  const m = String(month).padStart(2, "0");
  const d = String(day).padStart(2, "0");
  return `${year}-${m}-${d}`;
}

export function nthDayOfWeekInMonth(
  year: number,
  month: number, // 1-12
  dayOfWeek: number, // 0 = Sunday, 1 = Monday...
  n: number // 1st, 2nd, 3rd, 4th...
): string {
  let count = 0;
  for (let day = 1; day <= 31; day++) {
    const d = new Date(Date.UTC(year, month - 1, day));
    if (d.getUTCMonth() !== month - 1) break;
    if (d.getUTCDay() === dayOfWeek) {
      count++;
      if (count === n) {
        return toDateString(year, month, day);
      }
    }
  }
  throw new RangeError(`Could not find ${n}th day of week in month ${month}`);
}

export function lastDayOfWeekInMonth(
  year: number,
  month: number, // 1-12
  dayOfWeek: number
): string {
  const lastDate = new Date(Date.UTC(year, month, 0)).getUTCDate();
  for (let day = lastDate; day >= 1; day--) {
    const d = new Date(Date.UTC(year, month - 1, day));
    if (d.getUTCDay() === dayOfWeek) {
      return toDateString(year, month, day);
    }
  }
  throw new RangeError(`Could not find last day of week in month ${month}`);
}

// Anonymous Gregorian algorithm to calculate Easter Sunday
export function calculateEaster(year: number): { month: number; day: number } {
  const a = year % 19;
  const b = Math.floor(year / 100);
  const c = year % 100;
  const d = Math.floor(b / 4);
  const e = b % 4;
  const f = Math.floor((b + 8) / 25);
  const g = Math.floor((b - f + 1) / 3);
  const h = (19 * a + b - d - g + 15) % 30;
  const i = Math.floor(c / 4);
  const k = c % 4;
  const l = (32 + 2 * e + 2 * i - h - k) % 7;
  const m = Math.floor((a + 11 * h + 22 * l) / 451);
  const month = Math.floor((h + l - 7 * m + 114) / 31);
  const day = ((h + l - 7 * m + 114) % 31) + 1;
  return { month, day };
}

export function addDaysToDate(dateStr: string, days: number): string {
  const [y, m, d] = dateStr.split("-").map(Number);
  const dt = new Date(Date.UTC(y, m - 1, d + days));
  return toDateString(
    dt.getUTCFullYear(),
    dt.getUTCMonth() + 1,
    dt.getUTCDate()
  );
}
