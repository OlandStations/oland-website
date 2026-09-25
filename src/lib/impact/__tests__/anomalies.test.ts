import { describe, expect, it } from "vitest";
import { loadConsolidated, type SheetData } from "../parse";
import { detectAnomalies } from "../anomalies";
import { FIXTURE_A_SHEET, FIXTURE_A_RANGE } from "./fixtures";

describe("detectAnomalies — Fixture A unmodified", () => {
  it("flags nothing — the fixture's grid is realistic (no zeros, no extreme outliers, nothing negative)", () => {
    const table = loadConsolidated(FIXTURE_A_SHEET);
    const flags = detectAnomalies(table, FIXTURE_A_RANGE.start, FIXTURE_A_RANGE.end);
    expect(flags).toHaveLength(0);
  });
});

describe("detectAnomalies — zero-on-a-busy-day rule", () => {
  it("flags a station reading 0 on a date when another station recorded volume", () => {
    const sheet: SheetData = {
      header: ["Station", "8/6/2026"],
      rows: [
        ["Station A", 200],
        ["Station B", 0],
      ],
    };
    const table = loadConsolidated(sheet);
    const flags = detectAnomalies(table, "2026-08-06", "2026-08-06");

    expect(flags).toHaveLength(1);
    expect(flags[0].station).toBe("Station B");
    expect(flags[0].date).toBe("2026-08-06");
    expect(flags[0].reasons.join(" ")).toMatch(/zero/i);
  });

  it("does not fire when every station is 0 on that date (nobody was busy)", () => {
    const sheet: SheetData = {
      header: ["Station", "8/6/2026"],
      rows: [
        ["Station A", 0],
        ["Station B", 0],
      ],
    };
    const table = loadConsolidated(sheet);
    const flags = detectAnomalies(table, "2026-08-06", "2026-08-06");
    expect(flags).toHaveLength(0);
  });

  it("does not fire on a date outside the selected range", () => {
    const sheet: SheetData = {
      header: ["Station", "8/5/2026", "8/6/2026"],
      rows: [
        ["Station A", 200, 200],
        ["Station B", 0, 150],
      ],
    };
    const table = loadConsolidated(sheet);
    // Range excludes 8/5, where Station B's 0 would otherwise flag.
    const flags = detectAnomalies(table, "2026-08-06", "2026-08-06");
    expect(flags).toHaveLength(0);
  });
});

describe("detectAnomalies — median-ratio rule removed", () => {
  // These are the exact fixtures the median rule used to flag (see git
  // history) — kept as a regression test that removal actually stuck,
  // not a test of the rule itself.
  it("no longer flags a value that used to be 'more than 5x the median'", () => {
    const sheet: SheetData = {
      header: ["Station", "8/6/2026", "8/7/2026", "8/8/2026", "8/9/2026"],
      rows: [["Station A", 100, 110, 105, 600]], // used to flag 600 as 5.6x the 107.5 median
    };
    const table = loadConsolidated(sheet);
    const flags = detectAnomalies(table, "2026-08-06", "2026-08-09");
    expect(flags).toHaveLength(0);
  });

  it("no longer flags a value that used to be 'less than 1/5 of the median'", () => {
    const sheet: SheetData = {
      header: ["Station", "8/6/2026", "8/7/2026", "8/8/2026", "8/9/2026"],
      rows: [["Station A", 500, 480, 520, 10]], // used to flag 10 as under 1/5 of the ~500 median
    };
    const table = loadConsolidated(sheet);
    const flags = detectAnomalies(table, "2026-08-06", "2026-08-09");
    expect(flags).toHaveLength(0);
  });

  it("no longer references 'median' anywhere in a flag reason, for any dataset", () => {
    const sheet: SheetData = {
      header: ["Station", "8/6/2026", "8/7/2026", "8/8/2026", "8/9/2026"],
      rows: [["Station A", 100, 110, 105, 600]],
    };
    const table = loadConsolidated(sheet);
    const flags = detectAnomalies(table, "2026-08-06", "2026-08-09");
    expect(flags.every((f) => !f.reasons.some((r) => /median/i.test(r)))).toBe(true);
  });

  // The real dataset that motivated this removal: OLS0077's actual Aug
  // 2026 series spans a quiet pre-event period (~0.26-1.6) followed by an
  // event ramp-up (~15-186) — one median across the whole range used to
  // flag the quiet days as suspiciously low and the ramp-up days as
  // suspiciously high, when neither was. Neither end of that spread should
  // flag now — only a genuine 0-on-a-busy-day or negative value should.
  it("a quiet pre-event reading (0.264172) and an event-week reading (186.5) are both left unflagged", () => {
    const sheet: SheetData = {
      header: [
        "Station",
        "8/6/2026",
        "8/7/2026",
        "8/8/2026",
        "8/14/2026",
        "8/15/2026",
        "8/22/2026",
        "8/23/2026",
      ],
      rows: [["OLS0077", 0.264172, 1.0566881, 0.264172, 1.5850321, 1.5850322, 107.5180236, 186.505464]],
    };
    const table = loadConsolidated(sheet);
    const flags = detectAnomalies(table, "2026-08-06", "2026-08-23");
    expect(flags).toHaveLength(0);
  });
});

describe("detectAnomalies — negative-value rule", () => {
  it("flags a negative reading", () => {
    const sheet: SheetData = {
      header: ["Station", "8/6/2026"],
      rows: [["Station A", -5]],
    };
    const table = loadConsolidated(sheet);
    const flags = detectAnomalies(table, "2026-08-06", "2026-08-06");
    expect(flags.some((f) => f.reasons.some((r) => /negative/i.test(r)))).toBe(true);
  });
});

describe("detectAnomalies — advisory only", () => {
  it("a flagged cell's value is untouched — flags never alter, exclude, or block", () => {
    const sheet: SheetData = {
      header: ["Station", "8/6/2026"],
      rows: [["Station A", -5]],
    };
    const table = loadConsolidated(sheet);
    detectAnomalies(table, "2026-08-06", "2026-08-06");
    expect(table.values["2026-08-06"]["Station A"]).toBe(-5); // still there, unmodified
  });
});
