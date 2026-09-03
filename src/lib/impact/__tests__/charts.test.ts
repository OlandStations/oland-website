import { describe, expect, it } from "vitest";
import { niceTicks, computeBarLayout, computeLineLayout } from "../charts";
import type { ChartItem } from "../charts";

describe("niceTicks", () => {
  it("returns a placeholder tick for a zero/empty series", () => {
    expect(niceTicks(0)).toEqual({ ticks: [1], top: 1 });
  });

  it("produces round steps that cover the max value", () => {
    const { ticks, top } = niceTicks(3231.1);
    expect(top).toBeGreaterThanOrEqual(3231.1);
    expect(ticks[ticks.length - 1]).toBe(top);
    // every tick is an even multiple of the step
    const step = ticks[0];
    ticks.forEach((t, i) => expect(t).toBeCloseTo(step * (i + 1), 6));
  });
});

describe("computeBarLayout", () => {
  const items: ChartItem[] = [
    { label: "Aug 6", value: 530.2 },
    { label: "Aug 7", value: 845.3 },
    { label: "Aug 8", value: 1085.4 },
    { label: "Aug 9", value: 770.2 },
  ];

  it("gives every bar a positive height proportional to its value, tallest = the max", () => {
    const layout = computeBarLayout(items);
    expect(layout.bars).toHaveLength(4);
    const tallest = layout.bars.reduce((max, b) => (b.height > max.height ? b : max), layout.bars[0]);
    expect(tallest.value).toBe(1085.4);
    layout.bars.forEach((b) => expect(b.height).toBeGreaterThan(0));
  });

  it("labels every bar when there are 10 or fewer", () => {
    const layout = computeBarLayout(items);
    expect(layout.bars.every((b) => b.showValueLabel)).toBe(true);
  });

  it("labels only the max bar once there are more than 10", () => {
    const many: ChartItem[] = Array.from({ length: 14 }, (_, i) => ({
      label: `P${i}`,
      value: i === 7 ? 999 : 10 + i,
    }));
    const layout = computeBarLayout(many);
    const labeled = layout.bars.filter((b) => b.showValueLabel);
    expect(labeled).toHaveLength(1);
    expect(labeled[0].value).toBe(999);
  });
});

describe("computeLineLayout — bug fix #1: area closes at first/last DATA point", () => {
  const items: ChartItem[] = [
    { label: "Aug 6", value: 329.13 },
    { label: "Aug 7", value: 853.87 },
    { label: "Aug 8", value: 1527.65 },
    { label: "Aug 9", value: 2005.77 },
  ];

  it("closes the area polygon at the first/last point's x, not the plot edges (0 / plotWidth)", () => {
    const layout = computeLineLayout(items);
    const firstPointX = layout.points[0].x;
    const lastPointX = layout.points[layout.points.length - 1].x;

    expect(layout.areaPoints[0].x).toBe(firstPointX);
    expect(layout.areaPoints[layout.areaPoints.length - 1].x).toBe(lastPointX);

    // The buggy version would close at 0 and plotWidth instead.
    expect(layout.areaPoints[0].x).not.toBe(0);
    expect(layout.areaPoints[layout.areaPoints.length - 1].x).not.toBe(layout.plotWidth);
    expect(firstPointX).toBeGreaterThan(0);
    expect(lastPointX).toBeLessThan(layout.plotWidth);
  });

  it("the closing points sit on the chart baseline", () => {
    const layout = computeLineLayout(items);
    expect(layout.areaPoints[0].y).toBe(layout.chartHeight);
    expect(layout.areaPoints[layout.areaPoints.length - 1].y).toBe(layout.chartHeight);
  });
});

describe("computeLineLayout — bug fix #2: label drops below near the top, never clamps upward", () => {
  it("on a cumulative series, the final (maximum) point's label sits below the marker", () => {
    // Values chosen to push the last point close to y=0 (near the chart top).
    const items: ChartItem[] = [
      { label: "Aug 6", value: 10 },
      { label: "Aug 7", value: 50 },
      { label: "Aug 8", value: 100 }, // ~= top, so y is near 0
    ];
    const layout = computeLineLayout(items);
    const last = layout.points[layout.points.length - 1];

    expect(last.y).toBeLessThan(14); // confirms this point IS near the top
    expect(last.labelY).toBe(last.y + 22); // dropped below, not clamped
    expect(last.labelY).toBeGreaterThan(last.y); // below the marker
  });

  it("never clamps the label to a fixed minimum y near the top", () => {
    const items: ChartItem[] = [
      { label: "A", value: 1 },
      { label: "B", value: 1000 }, // pins the max right at the top
    ];
    const layout = computeLineLayout(items);
    const top = layout.points[1];
    // A clamp-upward bug would produce labelY === 14 (or some fixed floor).
    // The fix instead flips to y + 22.
    expect(top.labelY).not.toBe(14);
    expect(top.labelY).toBe(top.y + 22);
  });

  it("only labels the last point once there are more than 10 periods", () => {
    const many: ChartItem[] = Array.from({ length: 12 }, (_, i) => ({ label: `P${i}`, value: (i + 1) * 10 }));
    const layout = computeLineLayout(many);
    const shown = layout.points.filter((p) => p.showLabel);
    expect(shown).toHaveLength(1);
    expect(shown[0].label).toBe("P11");
  });
});
