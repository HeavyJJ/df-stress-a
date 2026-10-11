import { daysInclusive, daysInMonth, parseIsoDate } from "../lib/dates.js";
import { formatCents } from "../lib/money.js";

/**
 * Charge for part of one calendar month.
 * The customer pays for every day from start to end, both days included,
 * as a share of that month's length. A full month costs exactly monthlyCents.
 */
export function prorate(monthlyCents, startIso, endIso) {
  const start = parseIsoDate(startIso);
  const end = parseIsoDate(endIso);
  if (start.getUTCFullYear() !== end.getUTCFullYear() || start.getUTCMonth() !== end.getUTCMonth()) {
    throw new RangeError("prorate() only handles a single calendar month");
  }
  if (end < start) {
    throw new RangeError(`end ${endIso} is before start ${startIso}`);
  }
  const billable = daysInclusive(startIso, endIso);
  if (billable <= 0) {
    throw new RangeError(
      `cannot prorate ${formatCents(monthlyCents)}: billable days must be positive, got ${billable} for ${startIso}..${endIso}`,
    );
  }
  const monthDays = daysInMonth(start.getUTCFullYear(), start.getUTCMonth() + 1);
  return Math.round((monthlyCents * billable) / monthDays);
}
