// Calendar helpers. Every date is a plain "YYYY-MM-DD" string read as UTC midnight,
// so results never depend on the machine's time zone.

const MS_PER_DAY = 86_400_000;
const ISO_DATE = /^\d{4}-\d{2}-\d{2}$/;

/** Parse "YYYY-MM-DD" as UTC midnight. Throws on anything else, including 2026-02-30. */
export function parseIsoDate(iso) {
  if (typeof iso !== "string" || !ISO_DATE.test(iso)) {
    throw new TypeError(`expected YYYY-MM-DD, got ${JSON.stringify(iso)}`);
  }
  const date = new Date(`${iso}T00:00:00Z`);
  if (Number.isNaN(date.getTime()) || date.toISOString().slice(0, 10) !== iso) {
    throw new RangeError(`not a real calendar date: ${iso}`);
  }
  return date;
}

/** Format a Date as "YYYY-MM-DD" in UTC. */
export function toIsoDate(date) {
  return date.toISOString().slice(0, 10);
}

/** Add n calendar days (n may be negative). */
export function addDays(iso, n) {
  return toIsoDate(new Date(parseIsoDate(iso).getTime() + n * MS_PER_DAY));
}

/** Days in a month. `month` is 1-12 (January is 1). */
export function daysInMonth(year, month) {
  return new Date(Date.UTC(year, month, 0)).getUTCDate();
}

/**
 * Billable days from start to end, counting BOTH the start day and the end day.
 * daysInclusive("2026-03-10", "2026-03-10") is 1. A full March is 31.
 */
export function daysInclusive(startIso, endIso) {
  const diff = parseIsoDate(endIso).getTime() - parseIsoDate(startIso).getTime();
  return Math.round(diff / MS_PER_DAY);
}
