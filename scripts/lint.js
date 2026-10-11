// Repo lint: style rules on src/ plus calendar golden values.
// Run with: node scripts/lint.js   (exits 1 on any problem)
import { readdirSync, readFileSync, statSync } from "node:fs";
import path from "node:path";
import { daysInclusive, daysInMonth } from "../src/lib/dates.js";

const problems = [];

function walk(dir) {
  for (const name of readdirSync(dir)) {
    const full = path.join(dir, name);
    if (statSync(full).isDirectory()) walk(full);
    else if (full.endsWith(".js")) {
      const text = readFileSync(full, "utf8");
      text.split("\n").forEach((line, i) => {
        if (/\bconsole\.log\(/.test(line)) problems.push(`${full}:${i + 1} console.log is not allowed in src/`);
        if (/\bdebugger\b/.test(line)) problems.push(`${full}:${i + 1} debugger statement`);
        if (/\s+$/.test(line)) problems.push(`${full}:${i + 1} trailing whitespace`);
      });
    }
  }
}
walk("src");

// Golden calendar values. Both days count, so a same-day range is 1 day.
const GOLDEN_INCLUSIVE = [
  ["2026-03-01", "2026-03-31", 31],
  ["2026-02-01", "2026-02-28", 28],
  ["2028-02-01", "2028-02-29", 29],
  ["2026-12-31", "2026-12-31", 1],
  ["2026-01-15", "2026-01-16", 2],
];
for (const [start, end, want] of GOLDEN_INCLUSIVE) {
  const got = daysInclusive(start, end);
  if (got !== want) problems.push(`golden: daysInclusive(${start}, ${end}) = ${got}, expected ${want}`);
}
const GOLDEN_MONTH = [[2026, 2, 28], [2028, 2, 29], [2026, 4, 30], [2026, 12, 31]];
for (const [year, month, want] of GOLDEN_MONTH) {
  const got = daysInMonth(year, month);
  if (got !== want) problems.push(`golden: daysInMonth(${year}, ${month}) = ${got}, expected ${want}`);
}

if (problems.length > 0) {
  console.error(`lint: ${problems.length} problem(s)`);
  for (const p of problems) console.error(`  ${p}`);
  process.exit(1);
}
console.log("lint: ok");
