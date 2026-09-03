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

describe("detectAnomalies — median-ratio rule", () => {
  it("flags a value more than 5x the station's in-range median", () => {
    const sheet: SheetData = {
      header: ["Station", "8/6/2026", "8/7/2026", "8/8/2026", "8/9/2026"],
      rows: [["Station A", 100, 110, 105, 600]], // median of [100,105,110,600] = 107.5; 600 > 5x
    };
    const table = loadConsolidated(sheet);
    const flags = detectAnomalies(table, "2026-08-06", "2026-08-09");

    expect(flags).toHaveLength(1);
    expect(flags[0].date).toBe("2026-08-09");
    expect(flags[0].reasons.join(" ")).toMatch(/median/i);
  });

  it("flags a value less than 1/5 of the station's in-range median", () => {
    const sheet: SheetData = {
      header: ["Station", "8/6/2026", "8/7/2026", "8/8/2026", "8/9/2026"],
      rows: [["Station A", 500, 480, 520, 10]], // median ~500; 10 < 500/5
    };
    const table = loadConsolidated(sheet);
    const flags = detectAnomalies(table, "2026-08-06", "2026-08-09");

    expect(flags.some((f) => f.date === "2026-08-09" && f.reasons.join(" ").match(/median/i))).toBe(true);
  });

  it("is skipped when a station has fewer than 3 non-zero in-range values", () => {
    const sheet: SheetData = {
      header: ["Station", "8/6/2026", "8/7/2026"],
      rows: [["Station A", 10, 1000]], // only 2 non-zero values — extreme ratio, but too small a sample
    };
    const table = loadConsolidated(sheet);
    const flags = detectAnomalies(table, "2026-08-06", "2026-08-07");
    expect(flags.filter((f) => f.reasons.some((r) => /median/i.test(r)))).toHaveLength(0);
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
