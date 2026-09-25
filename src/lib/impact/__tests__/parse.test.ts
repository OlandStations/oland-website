import { describe, expect, it } from "vitest";
import {
  detectFormat,
  loadConsolidated,
  loadRangeExport,
  loadSheet,
  convertTableToLitres,
  convertTable,
  combineTables,
  sniffUnitsNote,
  findUnitsNoteText,
  dailyTotals,
  stationTotals,
  computeTableTotals,
  determineGranularity,
  aggregatePeriods,
  editKey,
  splitEditKey,
  applyEdits,
  parseEditValue,
  placeholderStationKey,
  isPlaceholderStation,
  withPlaceholderStation,
  stationNameExists,
  renameStation,
  type SheetData,
  type UsageTable,
} from "../parse";
import { calculateImpact, litresToDisplayVolume, LITRES_PER_US_GALLON } from "../formulas";
import { fmtExact, sumExact } from "../format";
import { FIXTURE_A_SHEET, FIXTURE_A_RANGE, FIXTURE_A_ROW_TOTALS, FIXTURE_B_SHEET } from "./fixtures";

describe("detectFormat", () => {
  it("recognises a consolidated (Station column) workbook", () => {
    expect(detectFormat(FIXTURE_A_SHEET.header)).toBe("consolidated");
  });

  it("recognises a range-export (Location_Name/Read_Time/Flow) workbook", () => {
    expect(detectFormat(["Location_Name", "Read_Time", "Flow"])).toBe("range_export");
  });

  it("throws for columns matching neither shape", () => {
    expect(() => detectFormat(["Foo", "Bar"])).toThrow();
  });
});

describe("loadConsolidated — Fixture A", () => {
  const table = loadConsolidated(FIXTURE_A_SHEET);

  it("stops at the first blank Station row (notes rows below aren't parsed)", () => {
    expect(table.stations).toEqual(["Station 1", "Station 2", "Station 3", "Station 4"]);
  });

  it("excludes the TOTAL * columns — station totals come only from date columns", () => {
    const totals = stationTotals(table, FIXTURE_A_RANGE.start, FIXTURE_A_RANGE.end);
    // If TOTAL PRE-EVENT/EVENT (9999 each) had leaked in, these would be far higher.
    totals.forEach(([, v], i) => expect(v).toBeCloseTo(FIXTURE_A_ROW_TOTALS[i], 6));
  });

  it("per-day totals match the fixture", () => {
    const daily = dailyTotals(table);
    expect(daily["2026-08-06"]).toBeCloseTo(530.2, 6);
    expect(daily["2026-08-07"]).toBeCloseTo(845.3, 6);
    expect(daily["2026-08-08"]).toBeCloseTo(1085.4, 6);
    expect(daily["2026-08-09"]).toBeCloseTo(770.2, 6);
  });
});

describe("stop-at-first-blank-row, isolated from Fixture A's other assertions", () => {
  it("does not read a valid station row that appears after a blank row", () => {
    const sheet: SheetData = {
      header: ["Station", "8/6/2026"],
      rows: [
        ["A", 10],
        ["", null],
        ["B", 20], // must never be reached
      ],
    };
    const table = loadConsolidated(sheet);
    expect(table.stations).toEqual(["A"]);
  });
});

describe("sniffUnitsNote / findUnitsNoteText", () => {
  it("matches 'all in gallons'", () => {
    expect(sniffUnitsNote(["Note: all in gallons"])).toBe("gallons");
  });

  it("matches 'values in litres'", () => {
    expect(sniffUnitsNote(["values in litres for this event"])).toBe("litres");
  });

  it("does not match '40 L bags avoided'", () => {
    expect(sniffUnitsNote(["40 L bags avoided"])).toBeNull();
  });

  it("findUnitsNoteText returns the verbatim matched text, for preserving in an export", () => {
    expect(findUnitsNoteText(["some other cell", "Note: all in gallons", "40 L bags avoided"])).toBe(
      "Note: all in gallons"
    );
    expect(findUnitsNoteText(["40 L bags avoided"])).toBeNull();
  });
});

describe("convertTable", () => {
  it("is a no-op when from === to (returns the same reference)", () => {
    const table = loadConsolidated(FIXTURE_B_SHEET);
    expect(convertTable(table, "litres", "litres")).toBe(table);
  });

  it("gallons -> litres matches convertTableToLitres", () => {
    const table = loadConsolidated(FIXTURE_A_SHEET);
    const a = convertTable(table, "gallons", "litres");
    const b = convertTableToLitres(table, "gallons");
    expect(dailyTotals(a)).toEqual(dailyTotals(b));
  });

  it("round-trips gallons -> litres -> gallons back to the original values", () => {
    const table = loadConsolidated(FIXTURE_A_SHEET);
    const roundTripped = convertTable(convertTable(table, "gallons", "litres"), "litres", "gallons");
    const original = stationTotals(table, FIXTURE_A_RANGE.start, FIXTURE_A_RANGE.end);
    const roundTrip = stationTotals(roundTripped, FIXTURE_A_RANGE.start, FIXTURE_A_RANGE.end);
    roundTrip.forEach(([, v], i) => expect(v).toBeCloseTo(original[i][1], 6));
  });
});

describe("editKey / splitEditKey", () => {
  it("round-trips station and date, even when the station name itself contains a space", () => {
    const key = editKey("Station 1", "2026-08-06");
    expect(splitEditKey(key)).toEqual({ station: "Station 1", date: "2026-08-06" });

    const key2 = editKey("Main Stage / North", "2026-08-06");
    expect(splitEditKey(key2)).toEqual({ station: "Main Stage / North", date: "2026-08-06" });
  });
});

describe("applyEdits", () => {
  const table = loadConsolidated(FIXTURE_A_SHEET);

  it("overrides only the edited cells, leaving everything else untouched", () => {
    const key = editKey("Station 1", "2026-08-06");
    const edited = applyEdits(table, { [key]: 250.1 });
    expect(edited.values["2026-08-06"]["Station 1"]).toBe(250.1);
    expect(edited.values["2026-08-07"]["Station 1"]).toBeCloseTo(table.values["2026-08-07"]["Station 1"]!, 6);
    expect(edited.values["2026-08-06"]["Station 2"]).toBeCloseTo(table.values["2026-08-06"]["Station 2"]!, 6);
  });

  it("never mutates the input table", () => {
    const key = editKey("Station 1", "2026-08-06");
    const originalValue = table.values["2026-08-06"]["Station 1"];
    applyEdits(table, { [key]: 999 });
    expect(table.values["2026-08-06"]["Station 1"]).toBe(originalValue);
  });

  it("an empty edits map returns the table unchanged", () => {
    expect(applyEdits(table, {})).toBe(table);
  });

  it("can fill in a cell that was missing from the original (sparse) data", () => {
    const key = editKey("New Station", "2026-08-06");
    const edited = applyEdits(table, { [key]: 42 });
    expect(edited.stations).toContain("New Station");
    expect(edited.values["2026-08-06"]["New Station"]).toBe(42);
  });
});

describe("parseEditValue", () => {
  it("accepts non-negative numbers, tolerating thousands-separator commas", () => {
    expect(parseEditValue("250.1")).toEqual({ ok: true, value: 250.1 });
    expect(parseEditValue("0")).toEqual({ ok: true, value: 0 });
    expect(parseEditValue(" 1,200.4 ")).toEqual({ ok: true, value: 1200.4 });
  });

  it("rejects non-numeric text — does not coerce it to a number", () => {
    expect(parseEditValue("abc").ok).toBe(false);
    expect(parseEditValue("12abc").ok).toBe(false);
    expect(parseEditValue("").ok).toBe(false);
  });

  it("rejects negative numbers", () => {
    const result = parseEditValue("-5");
    expect(result.ok).toBe(false);
    if (!result.ok) expect(result.error).toMatch(/zero or greater/i);
  });
});

describe("computeTableTotals", () => {
  it("row totals, column totals, and the grand total all reconcile exactly (no per-cell rounding drift)", () => {
    const table = convertTableToLitres(loadConsolidated(FIXTURE_A_SHEET), "gallons");
    const totals = computeTableTotals(table, FIXTURE_A_RANGE.start, FIXTURE_A_RANGE.end);

    const rowSum = totals.rowTotals.reduce((a, r) => a + (r.rangeTotal ?? 0), 0);
    const colSum = table.dates
      .filter((d) => d >= FIXTURE_A_RANGE.start && d <= FIXTURE_A_RANGE.end)
      .reduce((a, d) => a + (totals.columnTotals[d] ?? 0), 0);

    expect(fmtExact(rowSum)).toBe(fmtExact(totals.grandTotalInRange!));
    expect(fmtExact(colSum)).toBe(fmtExact(totals.grandTotalInRange!));
  });

  it("range totals exclude dates outside the selection; full-file totals include them", () => {
    const sheet: SheetData = {
      header: ["Station", "8/1/2026", "8/2/2026", "8/6/2026", "8/7/2026"],
      rows: [["Station 1", 5000, 5000, 100, 100]],
    };
    const table = loadConsolidated(sheet);
    const totals = computeTableTotals(table, "2026-08-06", "2026-08-07");

    expect(totals.rowTotals).toEqual([{ station: "Station 1", rangeTotal: 200, fullTotal: 10200 }]);
    expect(totals.grandTotalInRange).toBe(200);
    expect(totals.grandTotalFullFile).toBe(10200);
    // Column totals are reported for every date; it's up to the caller to
    // treat out-of-range ones as excluded (e.g. a dash in the totals row).
    expect(totals.columnTotals["2026-08-01"]).toBe(5000);
  });
});

describe("Fixture A end-to-end (consolidated -> convert -> aggregate -> impact)", () => {
  const rawTable = loadConsolidated(FIXTURE_A_SHEET);
  const litresTable = convertTableToLitres(rawTable, "gallons");
  const daily = dailyTotals(litresTable);
  const totalLitres = sumExact(
    Object.keys(daily)
      .filter((d) => d >= FIXTURE_A_RANGE.start && d <= FIXTURE_A_RANGE.end)
      .map((d) => daily[d])
  );
  const impact = calculateImpact(totalLitres, "US");

  it("total gallons, bottles, CO2, bags all match the fixture", () => {
    expect(fmtExact(impact.totalVolume)).toBe("3,231.1");
    expect(fmtExact(impact.bottlesAvoided)).toBe("20,679.04");
    expect(fmtExact(impact.co2AvoidedKg)).toBe("2,005.77");
    expect(fmtExact(impact.bagsAvoided)).toBe("137.86");
  });

  it("granularity auto-selects 'day' for a 4-day range", () => {
    expect(determineGranularity(FIXTURE_A_RANGE.start, FIXTURE_A_RANGE.end)).toBe("day");
  });

  it("per-day bottles avoided match the fixture", () => {
    const periods = aggregatePeriods(daily, FIXTURE_A_RANGE.start, FIXTURE_A_RANGE.end, "day");
    const bottles = periods.map((p) => fmtExact((p.value / LITRES_PER_US_GALLON) * 6.4));
    expect(bottles).toEqual(["3,393.28", "5,409.92", "6,946.56", "4,929.28"]);
  });

  it("cumulative CO2 avoided matches the fixture", () => {
    const periods = aggregatePeriods(daily, FIXTURE_A_RANGE.start, FIXTURE_A_RANGE.end, "day");
    let running = 0;
    const cumulative = periods.map((p) => {
      running += p.value * 0.16399;
      return fmtExact(running);
    });
    expect(cumulative).toEqual(["329.13", "853.87", "1,527.65", "2,005.77"]);
  });

  it("displayed station figures (in the client's units) sum exactly to the displayed total", () => {
    const stations = stationTotals(litresTable, FIXTURE_A_RANGE.start, FIXTURE_A_RANGE.end);
    const gallonsPerStation = stations.map(([, litres]) => litresToDisplayVolume(litres, "US"));
    expect(gallonsPerStation.map((v) => fmtExact(v))).toEqual(["1,200.4", "900.2", "650.1", "480.4"]);
    expect(fmtExact(sumExact(gallonsPerStation))).toBe(fmtExact(impact.totalVolume));
  });
});

describe("editing a cell recalculates the full impact pipeline", () => {
  const rawTable = loadConsolidated(FIXTURE_A_SHEET); // gallons, unconverted
  const key = editKey("Station 1", "2026-08-06");

  function impactFor(table: ReturnType<typeof loadConsolidated>) {
    const litres = convertTableToLitres(table, "gallons");
    const daily = dailyTotals(litres);
    const total = sumExact(
      Object.keys(daily)
        .filter((d) => d >= FIXTURE_A_RANGE.start && d <= FIXTURE_A_RANGE.end)
        .map((d) => daily[d])
    );
    return calculateImpact(total, "US");
  }

  it("confirms the baseline (unedited) cell value is 200.1, matching the task's example", () => {
    expect(rawTable.values["2026-08-06"]["Station 1"]).toBe(200.1);
  });

  it("changing Station 1's day-one value from 200.1 to 250.1 raises total gallons to 3,281.1 and bottles to 20,999.04", () => {
    const edited = applyEdits(rawTable, { [key]: 250.1 });
    const impact = impactFor(edited);
    expect(fmtExact(impact.totalVolume)).toBe("3,281.1");
    expect(fmtExact(impact.bottlesAvoided)).toBe("20,999.04");
  });

  it("reverting that single edit restores the original total and bottles", () => {
    const edited = applyEdits(rawTable, { [key]: 250.1 });
    expect(fmtExact(impactFor(edited).totalVolume)).toBe("3,281.1"); // sanity: edit is in effect

    const reverted = applyEdits(rawTable, {}); // the one edit removed = back to source data
    const impact = impactFor(reverted);
    expect(fmtExact(impact.totalVolume)).toBe("3,231.1");
    expect(fmtExact(impact.bottlesAvoided)).toBe("20,679.04");
  });

  it("reverting one edit leaves a second, unrelated edit's effect intact", () => {
    const secondKey = editKey("Station 2", "2026-08-07");
    const both = { [key]: 250.1, [secondKey]: 999 };
    const afterRevertingFirst = { [secondKey]: 999 };

    const totalBoth = impactFor(applyEdits(rawTable, both)).totalVolume;
    const totalAfterRevert = impactFor(applyEdits(rawTable, afterRevertingFirst)).totalVolume;

    // The removed edit's own contribution (200.1 -> 250.1, i.e. +50 gallons)
    // should be exactly what's missing — the second edit's effect persists.
    expect(totalBoth - totalAfterRevert).toBeCloseTo(50, 6);
  });

  it("Undo all edits (clearing every edit) returns every headline metric to its pre-edit value", () => {
    const manyEdits = { [key]: 250.1, [editKey("Station 2", "2026-08-07")]: 999 };
    const editedImpact = impactFor(applyEdits(rawTable, manyEdits));
    expect(fmtExact(editedImpact.totalVolume)).not.toBe("3,231.1");

    const undoneImpact = impactFor(applyEdits(rawTable, {}));
    expect(fmtExact(undoneImpact.totalVolume)).toBe("3,231.1");
    expect(fmtExact(undoneImpact.bottlesAvoided)).toBe("20,679.04");
    expect(fmtExact(undoneImpact.co2AvoidedKg)).toBe("2,005.77");
    expect(fmtExact(undoneImpact.bagsAvoided)).toBe("137.86");
  });
});

describe("Fixture B — litres file, CA client, 3 stations", () => {
  const table = convertTableToLitres(loadConsolidated(FIXTURE_B_SHEET), "litres");
  const totalLitres = sumExact(Object.values(dailyTotals(table)));
  const impact = calculateImpact(totalLitres, "CA");

  it("total litres, bottles, CO2, bags all match the fixture", () => {
    expect(fmtExact(impact.totalVolume)).toBe("3,900");
    expect(fmtExact(impact.bottlesAvoided)).toBe("7,800");
    expect(fmtExact(impact.co2AvoidedKg)).toBe("639.56");
    expect(fmtExact(impact.bagsAvoided)).toBe("43.33");
  });
});

describe("Fixture C — the units regression, driven off Fixture A's raw (unconverted) numbers", () => {
  const rawTable = loadConsolidated(FIXTURE_A_SHEET); // same source data as Fixture A, untouched

  function totalFor(unit: "gallons" | "litres") {
    const litresTable = convertTableToLitres(rawTable, unit);
    const daily = dailyTotals(litresTable);
    return sumExact(
      Object.keys(daily)
        .filter((d) => d >= FIXTURE_A_RANGE.start && d <= FIXTURE_A_RANGE.end)
        .map((d) => daily[d])
    );
  }

  it("selecting 'gallons' (correct) reproduces Fixture A", () => {
    const impact = calculateImpact(totalFor("gallons"), "US");
    expect(fmtExact(impact.bottlesAvoided)).toBe("20,679.04");
    expect(fmtExact(impact.co2AvoidedKg)).toBe("2,005.77");
  });

  it("selecting 'litres' (wrong) produces exactly the regression figures — and ONLY when litres is selected", () => {
    const impact = calculateImpact(totalFor("litres"), "US");
    expect(fmtExact(impact.bottlesAvoided)).toBe("5,462.83");
    expect(fmtExact(impact.co2AvoidedKg)).toBe("529.87");

    // Proves the units answer drives the calculation, not just a screen label:
    // the two readings of the identical source data differ by exactly the
    // gallon<->litre conversion factor.
    const gallonsImpact = calculateImpact(totalFor("gallons"), "US");
    expect(gallonsImpact.bottlesAvoided / impact.bottlesAvoided).toBeCloseTo(LITRES_PER_US_GALLON, 3);
    expect(gallonsImpact.co2AvoidedKg / impact.co2AvoidedKg).toBeCloseTo(LITRES_PER_US_GALLON, 3);
  });
});

describe("pre-event days outside the selected range are excluded from every figure", () => {
  const sheet: SheetData = {
    header: ["Station", "8/1/2026", "8/2/2026", "8/6/2026", "8/7/2026"],
    rows: [["Station 1", 5000, 5000, 100, 100]], // huge pre-event days, small event days
  };
  const table = convertTableToLitres(loadConsolidated(sheet), "litres");
  const daily = dailyTotals(table);
  const eventRange = { start: "2026-08-06", end: "2026-08-07" };

  it("station totals exclude the pre-event days", () => {
    const totals = stationTotals(table, eventRange.start, eventRange.end);
    expect(totals).toEqual([["Station 1", 200]]);
  });

  it("period aggregation excludes the pre-event days", () => {
    const periods = aggregatePeriods(daily, eventRange.start, eventRange.end, "day");
    expect(periods.map((p) => p.value)).toEqual([100, 100]);
  });

  it("the headline total excludes the pre-event days", () => {
    const total = sumExact(
      Object.keys(daily)
        .filter((d) => d >= eventRange.start && d <= eventRange.end)
        .map((d) => daily[d])
    );
    expect(total).toBe(200);
  });
});

describe("loadRangeExport", () => {
  it("groups hourly Flow reads by station and calendar date", () => {
    const sheet: SheetData = {
      header: ["Location_Name", "Read_Time", "Flow"],
      rows: [
        ["Station 1", "2026-08-06 09:00:00", 40],
        ["Station 1", "2026-08-06 14:00:00", 60],
        ["Station 1", "2026-08-07 09:00:00", 30],
        ["Station 2", "2026-08-06 10:00:00", 20],
      ],
    };
    const table = loadRangeExport(sheet);
    expect(table.stations.sort()).toEqual(["Station 1", "Station 2"]);
    expect(table.values["2026-08-06"]["Station 1"]).toBe(100);
    expect(table.values["2026-08-07"]["Station 1"]).toBe(30);
    expect(table.values["2026-08-06"]["Station 2"]).toBe(20);
  });

  it("a station whose every reading has a blank Read_Time still appears — not silently dropped", () => {
    const sheet: SheetData = {
      header: ["Location_Name", "Read_Time", "Flow"],
      rows: [
        ["Station 1", "2026-08-06 09:00:00", 40],
        ["Station 2 (offline)", null, null],
        ["Station 2 (offline)", "", ""],
      ],
    };
    const table = loadRangeExport(sheet);
    expect(table.stations.sort()).toEqual(["Station 1", "Station 2 (offline)"]);
    // No usable date could be derived for it, so it has no date cells at
    // all — but it must still be a station the merged table knows about.
    expect(table.values["2026-08-06"]["Station 2 (offline)"]).toBeNull();
  });
});

// ---------------------------------------------------------------------------
// Regression coverage for: a station with all-null values was silently
// dropped from the file entirely (loadRangeExport lost it when every one of
// its readings had a blank Read_Time), and every layer that touched a value
// defaulted a blank cell to 0, making "no reading" indistinguishable from a
// measured zero. Fixed by tracking null cells explicitly end-to-end.
// ---------------------------------------------------------------------------
describe("all-null station rows are never dropped, and null stays distinct from a measured 0", () => {
  it("consolidated: a station with every date cell blank still appears, with blank (null) cells", () => {
    const sheet: SheetData = {
      header: ["Station", "8/6/2026", "8/7/2026"],
      rows: [
        ["Station 1", 100, 200],
        ["Station 2 (all null)", null, null],
      ],
    };
    const table = loadConsolidated(sheet);
    expect(table.stations).toEqual(["Station 1", "Station 2 (all null)"]);
    expect(table.values["2026-08-06"]["Station 2 (all null)"]).toBeNull();
    expect(table.values["2026-08-07"]["Station 2 (all null)"]).toBeNull();
    // The real station's own values are completely unaffected.
    expect(table.values["2026-08-06"]["Station 1"]).toBe(100);
    expect(table.values["2026-08-07"]["Station 1"]).toBe(200);
  });

  it("consolidated: an all-null station is still counted in the file's own station/date counts", () => {
    const sheet: SheetData = {
      header: ["Station", "8/6/2026", "8/7/2026", "8/8/2026"],
      rows: [["Station 2 (all null)", null, null, null]],
    };
    const table = loadConsolidated(sheet);
    expect(table.stations).toHaveLength(1);
    expect(table.dates).toHaveLength(3);
  });

  it("a mix of null and real values for the same station: nulls stay blank, real values are unaffected", () => {
    const sheet: SheetData = {
      header: ["Station", "8/6/2026", "8/7/2026", "8/8/2026"],
      rows: [["Station 1", 100, null, 300]],
    };
    const table = loadConsolidated(sheet);
    expect(table.values["2026-08-06"]["Station 1"]).toBe(100);
    expect(table.values["2026-08-07"]["Station 1"]).toBeNull();
    expect(table.values["2026-08-08"]["Station 1"]).toBe(300);
  });

  it("3-file upload where one file is entirely null: every station survives the merge, including the all-null one", () => {
    const fileA = loadConsolidated({
      header: ["Station", "8/6/2026", "8/7/2026"],
      rows: [["Main Stage", 500, 600]],
    });
    const fileB = loadConsolidated({
      header: ["Station", "8/6/2026", "8/7/2026"],
      rows: [["North Gate", 200, 250]],
    });
    const fileC = loadConsolidated({
      header: ["Station", "8/6/2026", "8/7/2026"],
      rows: [["Food Court (offline all event)", null, null]],
    });

    const merged = combineTables([fileA, fileB, fileC]);

    expect(merged.stations.sort()).toEqual(["Food Court (offline all event)", "Main Stage", "North Gate"]);
    expect(merged.values["2026-08-06"]["Food Court (offline all event)"]).toBeNull();
    expect(merged.values["2026-08-07"]["Food Court (offline all event)"]).toBeNull();
    // The other two files' real numbers are untouched by the merge.
    expect(merged.values["2026-08-06"]["Main Stage"]).toBe(500);
    expect(merged.values["2026-08-06"]["North Gate"]).toBe(200);
  });

  it("an all-null file uploaded alone still keeps its own dates, with the station present and every cell blank", () => {
    const soloNullFile = loadConsolidated({
      header: ["Station", "8/6/2026", "8/7/2026"],
      rows: [["Food Court (offline all event)", null, null]],
    });
    const merged = combineTables([soloNullFile]);
    expect(merged.stations).toEqual(["Food Court (offline all event)"]);
    expect(merged.dates).toEqual(["2026-08-06", "2026-08-07"]);
    expect(merged.values["2026-08-06"]["Food Court (offline all event)"]).toBeNull();
    expect(merged.values["2026-08-07"]["Food Court (offline all event)"]).toBeNull();
  });

  it("row/column/grand totals are null (not 0) when every contributing cell is null", () => {
    const sheet: SheetData = {
      header: ["Station", "8/6/2026", "8/7/2026"],
      rows: [
        ["Main Stage", 500, 600],
        ["Food Court (all null)", null, null],
      ],
    };
    const table = loadConsolidated(sheet);
    const totals = computeTableTotals(table, "2026-08-06", "2026-08-07");

    const foodCourt = totals.rowTotals.find((r) => r.station === "Food Court (all null)");
    expect(foodCourt).toEqual({ station: "Food Court (all null)", rangeTotal: null, fullTotal: null });

    // A real station's row total is completely unaffected.
    const mainStage = totals.rowTotals.find((r) => r.station === "Main Stage");
    expect(mainStage).toEqual({ station: "Main Stage", rangeTotal: 1100, fullTotal: 1100 });

    // Column/grand totals still reconcile off only the real numbers —
    // the all-null station contributes nothing, not a manufactured 0.
    expect(totals.columnTotals["2026-08-06"]).toBe(500);
    expect(totals.grandTotalInRange).toBe(1100);
  });

  it("a column (date) that's null for every station reports null, not 0", () => {
    const sheet: SheetData = {
      header: ["Station", "8/6/2026", "8/7/2026"],
      rows: [["Station 1 (down on the 7th)", 100, null]],
    };
    const table = loadConsolidated(sheet);
    const totals = computeTableTotals(table, "2026-08-06", "2026-08-07");
    expect(totals.columnTotals["2026-08-06"]).toBe(100);
    expect(totals.columnTotals["2026-08-07"]).toBeNull();
  });

  it("gallons->litres conversion never turns a null cell into a measured 0", () => {
    const table = loadConsolidated({
      header: ["Station", "8/6/2026"],
      rows: [["Station 1", null]],
    });
    const litres = convertTableToLitres(table, "gallons");
    expect(litres.values["2026-08-06"]["Station 1"]).toBeNull();
  });

  it("the 'stop at first blank Station cell' rule still ends the data region correctly, and isn't tripped by a present name with blank values", () => {
    const sheet: SheetData = {
      header: ["Station", "8/6/2026"],
      rows: [
        ["Station 1", 10],
        ["Station 2 (all null, name still present)", null],
        ["", null], // genuinely blank Station name — this ends the data region
        ["Station 3", 30], // must never be reached
      ],
    };
    const table = loadConsolidated(sheet);
    expect(table.stations).toEqual(["Station 1", "Station 2 (all null, name still present)"]);
    expect(table.values["2026-08-06"]["Station 2 (all null, name still present)"]).toBeNull();
  });
});

// ---------------------------------------------------------------------------
// Follow-up regression: a file that yields ZERO usable stations at all (a
// header-only export with no data rows, or every row fails to yield a
// station name) must still produce exactly one placeholder station, with a
// REAL editable 0 across every date column in the merged table — not the
// blank/"—" treatment a real station's null cell gets.
// ---------------------------------------------------------------------------
describe("placeholder stations for a file with zero identifiable rows", () => {
  it("withPlaceholderStation is a no-op for a file that has any real station", () => {
    const table = loadConsolidated({
      header: ["Station", "8/6/2026"],
      rows: [["Station 1", 100]],
    });
    const withPlaceholder = withPlaceholderStation(table, "file-1");
    expect(withPlaceholder).toBe(table); // same reference — nothing changed
    expect(withPlaceholder.stations.some(isPlaceholderStation)).toBe(false);
  });

  it("a header-only file (0 data rows) gets exactly one placeholder station, and it's the file's only station", () => {
    const headerOnly: SheetData = {
      header: ["Location_Name", "Register_Number", "Endpoint_SN", "Read_Time", "Flow", "Demand_Zone_ID"],
      rows: [],
    };
    const { table } = loadSheet(headerOnly);
    expect(table.stations).toHaveLength(0); // confirms the loader itself found nothing

    const withPlaceholder = withPlaceholderStation(table, "file-empty");
    expect(withPlaceholder.stations).toHaveLength(1);
    expect(isPlaceholderStation(withPlaceholder.stations[0])).toBe(true);
    expect(withPlaceholder.stations[0]).toBe(placeholderStationKey("file-empty"));
  });

  it("a mix of real rows and junk rows (at least one real station) does NOT get a placeholder", () => {
    const table = loadRangeExport({
      header: ["Location_Name", "Read_Time", "Flow"],
      rows: [
        ["Station 1", "2026-08-06 09:00:00", 40],
        [null, null, null], // junk row — no station name at all
        ["", "2026-08-06 10:00:00", 5], // junk row — blank station name
      ],
    });
    expect(table.stations).toEqual(["Station 1"]);
    const withPlaceholder = withPlaceholderStation(table, "file-mixed");
    expect(withPlaceholder).toBe(table); // unchanged: this file DID register a real station
    expect(withPlaceholder.stations.some(isPlaceholderStation)).toBe(false);
  });

  it("3-file merge, one header-only: all three files' stations survive, the placeholder is 0 (not null/blank) across every merged date", () => {
    const fileA = withPlaceholderStation(
      loadConsolidated({ header: ["Station", "8/6/2026", "8/7/2026"], rows: [["Main Stage", 500, 600]] }),
      "file-a"
    );
    const fileB = withPlaceholderStation(
      loadConsolidated({ header: ["Station", "8/6/2026", "8/7/2026"], rows: [["North Gate", 200, 250]] }),
      "file-b"
    );
    const fileC = withPlaceholderStation(
      loadSheet({
        header: ["Location_Name", "Register_Number", "Read_Time", "Flow"],
        rows: [],
      }).table,
      "file-c"
    );
    expect(fileC.stations).toHaveLength(1); // this file's own summary: 1 station

    const merged = combineTables([fileA, fileB, fileC]);
    const placeholderKey = placeholderStationKey("file-c");

    expect(merged.stations).toContain(placeholderKey);
    expect(merged.stations).toHaveLength(3); // never fewer than the number of files
    expect(merged.values["2026-08-06"][placeholderKey]).toBe(0);
    expect(merged.values["2026-08-07"][placeholderKey]).toBe(0);
    // The real stations' own numbers are completely unaffected.
    expect(merged.values["2026-08-06"]["Main Stage"]).toBe(500);
    expect(merged.values["2026-08-06"]["North Gate"]).toBe(200);

    // The placeholder's row participates in totals as a real, measured 0 —
    // not excluded like a genuine null/no-reading cell.
    const totals = computeTableTotals(merged, "2026-08-06", "2026-08-07");
    const placeholderRow = totals.rowTotals.find((r) => r.station === placeholderKey);
    expect(placeholderRow).toEqual({ station: placeholderKey, rangeTotal: 0, fullTotal: 0 });
  });

  it("editing a placeholder's cell (via the same edit-overlay applyEdits uses) updates its value like any other station", () => {
    const solo = withPlaceholderStation(
      loadSheet({ header: ["Location_Name", "Read_Time", "Flow"], rows: [] }).table,
      "file-solo"
    );
    // Give it a date axis the way a real merge would (a lone empty file has
    // none of its own — see the standalone-file test in the null-fix suite).
    const withDates: UsageTable = {
      ...solo,
      dates: ["2026-08-06"],
      values: { "2026-08-06": { [solo.stations[0]]: 0 } },
    };
    const key = editKey(solo.stations[0], "2026-08-06");
    const edited = applyEdits(withDates, { [key]: 450 });
    expect(edited.values["2026-08-06"][solo.stations[0]]).toBe(450);
  });
});

describe("stationNameExists / renameStation", () => {
  it("stationNameExists ignores the station being excluded (so a placeholder never collides with itself)", () => {
    const table = loadConsolidated({
      header: ["Station", "8/6/2026"],
      rows: [["OLS0099", 100]],
    });
    const placeholder = placeholderStationKey("file-1");
    const merged = combineTables([table, withPlaceholderStation({ dates: [], stations: [], values: {} }, "file-1")]);
    expect(stationNameExists(merged, "OLS0099", placeholder)).toBe(true);
    expect(stationNameExists(merged, "OLS0099")).toBe(true);
    expect(stationNameExists(merged, "Some New Name", placeholder)).toBe(false);
  });

  it("renameStation performs a plain rename when the new name doesn't collide with anything", () => {
    const placeholder = placeholderStationKey("file-1");
    const table: UsageTable = {
      dates: ["2026-08-06", "2026-08-07"],
      stations: [placeholder],
      values: { "2026-08-06": { [placeholder]: 0 }, "2026-08-07": { [placeholder]: 0 } },
    };
    const renamed = renameStation(table, placeholder, "OLS0099");
    expect(renamed.stations).toEqual(["OLS0099"]);
    expect(renamed.values["2026-08-06"]["OLS0099"]).toBe(0);
    expect(renamed.stations.some(isPlaceholderStation)).toBe(false);
  });

  it("renaming a placeholder to an existing station's name merges (sums) their cells rather than silently overwriting either", () => {
    const placeholder = placeholderStationKey("file-1");
    const table: UsageTable = {
      dates: ["2026-08-06", "2026-08-07"],
      stations: ["OLS0099", placeholder],
      values: {
        "2026-08-06": { OLS0099: 500, [placeholder]: 0 },
        "2026-08-07": { OLS0099: 600, [placeholder]: 50 }, // ops already filled in a real reading here
      },
    };
    expect(stationNameExists(table, "OLS0099", placeholder)).toBe(true); // the collision the caller must gate behind confirmation

    const merged = renameStation(table, placeholder, "OLS0099");
    expect(merged.stations).toEqual(["OLS0099"]); // one row, not two
    expect(merged.values["2026-08-06"]["OLS0099"]).toBe(500); // 500 + 0
    expect(merged.values["2026-08-07"]["OLS0099"]).toBe(650); // 600 + 50 — both numbers preserved, summed
  });

  it("renaming to a null-only (no-reading) existing station's cell still yields the placeholder's real number, not a manufactured sum", () => {
    const placeholder = placeholderStationKey("file-1");
    const table: UsageTable = {
      dates: ["2026-08-06"],
      stations: ["Offline Station", placeholder],
      values: { "2026-08-06": { "Offline Station": null, [placeholder]: 75 } },
    };
    const merged = renameStation(table, placeholder, "Offline Station");
    expect(merged.values["2026-08-06"]["Offline Station"]).toBe(75);
  });
});
