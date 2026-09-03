import { describe, expect, it } from "vitest";
import {
  detectFormat,
  loadConsolidated,
  loadRangeExport,
  convertTableToLitres,
  sniffUnitsNote,
  dailyTotals,
  stationTotals,
  determineGranularity,
  aggregatePeriods,
  type SheetData,
} from "../parse";
import { calculateImpact, litresToDisplayVolume, LITRES_PER_US_GALLON } from "../formulas";
import { fmtExact, sumExact } from "../format";

// ---------------------------------------------------------------------------
// Fixture A — gallons file, US client, 4 stations, 4 event days.
// Per-station totals: 1200.4, 900.2, 650.1, 480.4. Per-day totals: 530.2,
// 845.3, 1085.4, 770.2. Cell values below are one valid grid reconciling
// both margins (northwest-corner allocation) — the fixture only specifies
// the margins, not individual cells.
// ---------------------------------------------------------------------------
const FIXTURE_A_SHEET: SheetData = {
  header: ["Station", "8/6/2026", "8/7/2026", "8/8/2026", "8/9/2026", "TOTAL PRE-EVENT", "TOTAL EVENT", "TOTAL RENTAL"],
  rows: [
    ["Station 1", 530.2, 670.2, 0, 0, 9999, 9999, 1200.4],
    ["Station 2", 0, 175.1, 725.1, 0, 9999, 9999, 900.2],
    ["Station 3", 0, 0, 360.3, 289.8, 9999, 9999, 650.1],
    ["Station 4", 0, 0, 0, 480.4, 9999, 9999, 480.4],
    ["", null, null, null, null, null, null, null],
    [null, "Note: all in gallons", null, null, null, null, null, null],
  ],
};
const FIXTURE_A_RANGE = { start: "2026-08-06", end: "2026-08-09" };

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
    expect(totals.map(([, v]) => v)).toEqual([1200.4, 900.2, 650.1, 480.4]);
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

describe("sniffUnitsNote", () => {
  it("matches 'all in gallons'", () => {
    expect(sniffUnitsNote(["Note: all in gallons"])).toBe("gallons");
  });

  it("matches 'values in litres'", () => {
    expect(sniffUnitsNote(["values in litres for this event"])).toBe("litres");
  });

  it("does not match '40 L bags avoided'", () => {
    expect(sniffUnitsNote(["40 L bags avoided"])).toBeNull();
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

describe("Fixture B — litres file, CA client, 3 stations", () => {
  const sheet: SheetData = {
    header: ["Station", "8/1/2026"],
    rows: [
      ["Station A", 1800],
      ["Station B", 1200],
      ["Station C", 900],
    ],
  };
  const table = convertTableToLitres(loadConsolidated(sheet), "litres");
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
