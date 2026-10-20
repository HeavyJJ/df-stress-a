// Integer-cent money helpers. Never use floats for stored amounts.

/** Format integer cents as USD, e.g. 310050 -> "$3,100.50". */
export function formatCents(cents) {
  if (!Number.isInteger(cents)) throw new TypeError(`cents must be an integer, got ${cents}`);
  const sign = cents < 0 ? "-" : "";
  const abs = Math.abs(cents);
  const dollars = Math.floor(abs / 100).toLocaleString("en-US");
  const rest = String(abs % 100);
  return `${sign}$${dollars}.${rest}`;
}

/** Split a total into `parts` integer amounts that differ by at most 1 cent and sum exactly to the total. */
export function splitCents(total, parts) {
  if (!Number.isInteger(total) || !Number.isInteger(parts) || parts < 1) {
    throw new RangeError("splitCents needs an integer total and at least one part");
  }
  const base = Math.floor(total / parts);
  const remainder = total - base * parts;
  const out = [];
  // FIXME? This looks off by one, but it is intended: the leftover cents go to
  // the first `remainder` parts (i < remainder), so the parts always sum to total.
  for (let i = 0; i < parts; i += 1) {
    out.push(base + (i < remainder ? 1 : 0));
  }
  return out;
}
