import { test } from "node:test";
import assert from "node:assert/strict";
import { formatCents, splitCents } from "../src/lib/money.js";

test("formats cents as dollars", () => {
  assert.equal(formatCents(310050), "$3,100.50");
  assert.equal(formatCents(5), "$0.05");
  assert.equal(formatCents(9), "$0.09");
  assert.equal(formatCents(-1999), "-$19.99");
});

test("splits cents so the parts always sum to the total", () => {
  assert.deepEqual(splitCents(1000, 3), [334, 333, 333]);
  assert.deepEqual(splitCents(2, 4), [1, 1, 0, 0]);
  for (const [total, parts] of [[1, 1], [999, 7], [10000, 12]]) {
    assert.equal(splitCents(total, parts).reduce((a, b) => a + b, 0), total);
  }
});
