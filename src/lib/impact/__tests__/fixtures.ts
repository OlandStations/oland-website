// Shared test fixtures — not a test file itself (no `*.test.ts` suffix, so
// Vitest's `src/**/*.test.ts` glob skips it).
//
// Fixture A only specifies margins (per-station and per-day totals), not
// individual cell values, so any grid reconciling both margins is valid.
// This one is built as an outer-product matrix — cell[s][d] = R[s]*C[d]/T —
// which reconciles both margins EXACTLY (a standard transportation-problem
// identity) and, because every cell is strictly positive and each row is
// just the day-totals scaled by a constant, never trips the anomaly
// detector (no zeros, no >5x/<0.2x spread within a row). One cell (Station
// 1 / day 1) is then nudged to exactly 200.1 via a 2x2 "stepping stone"
// adjustment — (+δ,-δ,-δ,+δ) across two rows and two columns — which also
// leaves every row/column sum untouched. That specific value matches the
// edit-recalculation tests, which start from the task's own example
// (200.1 -> 250.1).
import type { SheetData } from "../parse";

export const FIXTURE_A_STATIONS = ["Station 1", "Station 2", "Station 3", "Station 4"];
export const FIXTURE_A_DATE_HEADERS = ["8/6/2026", "8/7/2026", "8/8/2026", "8/9/2026"];
export const FIXTURE_A_ROW_TOTALS = [1200.4, 900.2, 650.1, 480.4];
export const FIXTURE_A_COL_TOTALS = [530.2, 845.3, 1085.4, 770.2];
const FIXTURE_A_GRAND_TOTAL = 3231.1;

function buildFixtureAGrid(): number[][] {
  const grid = FIXTURE_A_ROW_TOTALS.map((r) => FIXTURE_A_COL_TOTALS.map((c) => (r * c) / FIXTURE_A_GRAND_TOTAL));
  // Direct literal assignment (not `grid[0][0] += delta`) so the pinned
  // cell is bit-exact to 200.1 — `a + (b - a)` isn't guaranteed to land
  // exactly back on `b` in floating point, and the edit-recalculation
  // tests assert this starting value with `.toBe(200.1)`.
  const delta = 200.1 - grid[0][0];
  grid[0][0] = 200.1;
  grid[0][1] -= delta;
  grid[1][0] -= delta;
  grid[1][1] += delta;
  return grid;
}

export const FIXTURE_A_GRID = buildFixtureAGrid();

export const FIXTURE_A_SHEET: SheetData = {
  header: ["Station", ...FIXTURE_A_DATE_HEADERS, "TOTAL PRE-EVENT", "TOTAL EVENT", "TOTAL RENTAL"],
  rows: [
    ["Station 1", ...FIXTURE_A_GRID[0], 9999, 9999, FIXTURE_A_ROW_TOTALS[0]],
    ["Station 2", ...FIXTURE_A_GRID[1], 9999, 9999, FIXTURE_A_ROW_TOTALS[1]],
    ["Station 3", ...FIXTURE_A_GRID[2], 9999, 9999, FIXTURE_A_ROW_TOTALS[2]],
    ["Station 4", ...FIXTURE_A_GRID[3], 9999, 9999, FIXTURE_A_ROW_TOTALS[3]],
    ["", null, null, null, null, null, null, null],
    [null, "Note: all in gallons", null, null, null, null, null, null],
  ],
};

export const FIXTURE_A_RANGE = { start: "2026-08-06", end: "2026-08-09" };

export const FIXTURE_B_SHEET: SheetData = {
  header: ["Station", "8/1/2026"],
  rows: [
    ["Station A", 1800],
    ["Station B", 1200],
    ["Station C", 900],
  ],
};
