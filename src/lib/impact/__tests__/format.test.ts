import { describe, expect, it } from "vitest";
import {
  fmtExact,
  sumExact,
  buildPeriodSummary,
  buildStationSummary,
  buildCo2Summary,
  buildProvenanceText,
  buildEditsSummaryLine,
  type EditProvenance,
} from "../format";
import type { Period } from "../parse";

describe("fmtExact", () => {
  it("prints a whole value with no decimal", () => {
    expect(fmtExact(3900)).toBe("3,900");
    expect(fmtExact(7800)).toBe("7,800");
  });

  it("prints the decimal a value actually has, never rounding it away", () => {
    expect(fmtExact(3231.1)).toBe("3,231.1");
    expect(fmtExact(1200.4)).toBe("1,200.4");
  });

  it("caps at 2dp for figures that need it (CO2, bags)", () => {
    expect(fmtExact(2005.767963)).toBe("2,005.77");
    expect(fmtExact(137.86026666)).toBe("137.86");
  });

  it("strips trailing zeros from the 2dp form", () => {
    expect(fmtExact(639.5)).toBe("639.5");
    expect(fmtExact(639.56)).toBe("639.56");
  });
});

describe("sumExact — totals from full precision, never from displayed figures", () => {
  // The regression this guards: naive per-figure rounding once made four
  // station bars (1750.4, 1293.2, 956.1, 718.4) display as
  // 1,750 + 1,293 + 956 + 718 = 4,717 against a true total of 4,718.1.
  const stationGallons = [1200.4, 900.2, 650.1, 480.4]; // Fixture A

  it("the displayed total is the exact sum, formatted once", () => {
    const total = sumExact(stationGallons);
    expect(fmtExact(total)).toBe("3,231.1");
  });

  it("summing the naively-rounded-to-whole figures first gives the wrong (and must-never-ship) total", () => {
    const naiveTotal = stationGallons.reduce((acc, v) => acc + Math.round(v), 0);
    expect(naiveTotal).toBe(3230);
    expect(naiveTotal).not.toBe(Math.round(sumExact(stationGallons)));
  });

  it("displayed station figures sum exactly to the displayed total", () => {
    const displayedStations = stationGallons.map((v) => fmtExact(v));
    expect(displayedStations).toEqual(["1,200.4", "900.2", "650.1", "480.4"]);
    const reconstructed = stationGallons.reduce((a, b) => a + b, 0);
    expect(fmtExact(reconstructed)).toBe(fmtExact(sumExact(stationGallons)));
    expect(fmtExact(reconstructed)).toBe("3,231.1");
  });
});

describe("buildPeriodSummary", () => {
  const periods: Period[] = [
    { label: "Aug 6", value: 100 },
    { label: "Aug 7", value: 400 },
    { label: "Aug 8", value: 250 },
  ];

  it("names the peak period and compares it to the opening period", () => {
    const text = buildPeriodSummary(periods, "500 mL bottles");
    expect(text).toContain("Aug 7");
    expect(text).toContain("Aug 6");
    expect(text).toMatch(/higher/);
    expect(text).not.toMatch(/cars off the road|equivalent to/i);
  });

  it("handles the peak being the opening period", () => {
    const flat: Period[] = [
      { label: "Aug 6", value: 400 },
      { label: "Aug 7", value: 100 },
    ];
    expect(buildPeriodSummary(flat, "500 mL bottles")).toContain("also the opening period");
  });
});

describe("buildStationSummary", () => {
  it("names the busiest station and its share of the total", () => {
    const items: Period[] = [
      { label: "Main Stage", value: 1200.4 },
      { label: "North Gate", value: 900.2 },
      { label: "Food Court", value: 650.1 },
      { label: "Side Bar", value: 480.4 },
    ];
    const text = buildStationSummary(items, "gallons");
    expect(text).toContain("Main Stage");
    expect(text).toContain("3,231.1");
    expect(text).toMatch(/%/);
  });
});

describe("buildEditsSummaryLine / buildProvenanceText — edits disclosure", () => {
  const baseOpts = {
    files: [{ name: "usage.xlsx", unit: "gallons" }],
    country: "US" as const,
    start: "2026-01-05",
    end: "2026-01-08",
  };

  it("says 'No manual adjustments' when nothing was edited", () => {
    expect(buildEditsSummaryLine([])).toBe("No manual adjustments.");
    const text = buildProvenanceText({ ...baseOpts, edits: [] });
    expect(text).toContain("No manual adjustments.");
  });

  it("counts and lists every edit with its before and after values", () => {
    const edits: EditProvenance[] = [
      { station: "STN-A", date: "2026-01-06", original: 300.1, edited: 310.1 },
      { station: "STN-B", date: "2026-01-07", original: 250.1, edited: 255 },
      { station: "STN-C", date: "2026-01-08", original: 0, edited: 12.5 },
    ];

    expect(buildEditsSummaryLine(edits)).toBe("3 values manually adjusted:");

    const text = buildProvenanceText({ ...baseOpts, edits });
    expect(text).toContain("3 values manually adjusted:");
    expect(text).toContain("STN-A · Jan 6 · 300.1 → 310.1");
    expect(text).toContain("STN-B · Jan 7 · 250.1 → 255");
    expect(text).toContain("STN-C · Jan 8 · 0 → 12.5");
  });

  it("omitting `edits` entirely still produces a valid provenance block (treated as no edits)", () => {
    const text = buildProvenanceText(baseOpts);
    expect(text).toContain("No manual adjustments.");
  });
});

describe("buildCo2Summary", () => {
  it("states the total CO2 avoided with no invented equivalence", () => {
    const cumulative: Period[] = [
      { label: "Aug 6", value: 329.13 },
      { label: "Aug 7", value: 853.87 },
      { label: "Aug 8", value: 1527.65 },
      { label: "Aug 9", value: 2005.77 },
    ];
    const text = buildCo2Summary(cumulative);
    expect(text).toContain("2,005.77");
    expect(text).not.toMatch(/cars off the road|equivalent to|trees planted/i);
  });
});
