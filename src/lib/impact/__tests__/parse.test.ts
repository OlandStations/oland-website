import { describe, expect, it } from "vitest";
import {
  detectFormat,
  loadConsolidated,
  loadRangeExport,
  convertTableToLitres,
  convertTable,
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
  type SheetData,
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
    expect(edited.values["2026-08-07"]["Station 1"]).toBeCloseTo(table.values["2026-08-07"]["Station 1"], 6);
    expect(edited.values["2026-08-06"]["Station 2"]).toBeCloseTo(table.values["2026-08-06"]["Station 2"], 6);
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

    const rowSum = totals.rowTotals.reduce((a, r) => a + r.rangeTotal, 0);
    const colSum = table.dates
      .filter((d) => d >= FIXTURE_A_RANGE.start && d <= FIXTURE_A_RANGE.end)
      .reduce((a, d) => a + totals.columnTotals[d], 0);

    expect(fmtExact(rowSum)).toBe(fmtExact(totals.grandTotalInRange));
    expect(fmtExact(colSum)).toBe(fmtExact(totals.grandTotalInRange));
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
});
