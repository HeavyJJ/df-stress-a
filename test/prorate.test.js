import { test } from "node:test";
import assert from "node:assert/strict";
import { prorate } from "../src/billing/prorate.js";

test("a full calendar month costs exactly the monthly price", () => {
  assert.equal(prorate(3100, "2026-03-01", "2026-03-31"), 3100);
  assert.equal(prorate(3100, "2026-03-10", "2026-03-10"), 100);
});

test("signing up and cancelling on the same day bills one day", () => {
  assert.equal(prorate(3100, "2026-03-10", "2026-03-10"), 100);
});

test("the first half of April is half the price", () => {
  assert.equal(prorate(3000, "2026-04-01", "2026-04-15"), 1500);
});

test("rejects a range that crosses months", () => {
  assert.throws(() => prorate(3000, "2026-04-20", "2026-05-02"), RangeError);
});
