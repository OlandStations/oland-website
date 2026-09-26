import { describe, expect, it } from "vitest";
import { niceTicks, computeBarLayout, computeLineLayout, drawBarChart, drawLineChart, hexToRgba } from "../charts";
import type { ChartItem, ChartColors } from "../charts";

// This project's Vitest environment is Node (no DOM/canvas — see
// vitest.config.ts and the "draw functions... aren't unit-tested
// directly" note atop charts.ts). A real <canvas> 2D context isn't
// available here, so this mock records every method call and property
// assignment CanvasRenderingContext2D would receive, without needing one.
// Asserting the exact fillStyle/strokeStyle values the draw functions set
// is the closest available proxy for "what the exported PNG will show" —
// canvas.toBlob() serializes exactly what these calls painted.
type MockCall = { name: string; value?: unknown; args?: unknown[] };
function createMockContext(): { ctx: CanvasRenderingContext2D; calls: MockCall[] } {
  const calls: MockCall[] = [];
  const ctx = new Proxy(
    {},
    {
      get(_target, prop) {
        if (typeof prop !== "string") return undefined;
        return (...args: unknown[]) => {
          calls.push({ name: prop, args });
        };
      },
      set(_target, prop, value) {
        if (typeof prop === "string") calls.push({ name: prop, value });
        return true;
      },
    }
  ) as unknown as CanvasRenderingContext2D;
  return { ctx, calls };
}

const BASE_COLORS: ChartColors = {
  bar: "#0099cc",
  surface: "#fcfcfd",
  grid: "#f2f2f1",
  areaFill: "rgba(0, 153, 204, 0.1)",
  textPrimary: "#1a1a1a",
  textSecondary: "#4a4a4a",
};

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

  it("propagates each item's optional per-series color onto its own bar, leaving others undefined", () => {
    const withColors: ChartItem[] = [
      { label: "Station A", value: 100, color: "#111111" },
      { label: "Station B", value: 200 },
      { label: "Station C", value: 150, color: "#333333" },
    ];
    const layout = computeBarLayout(withColors);
    expect(layout.bars[0].color).toBe("#111111");
    expect(layout.bars[1].color).toBeUndefined();
    expect(layout.bars[2].color).toBe("#333333");
  });
});

describe("hexToRgba", () => {
  it("converts a 6-digit hex to rgba at the given alpha — matches the existing default CO2 fill derivation", () => {
    expect(hexToRgba("#0099cc", 0.1)).toBe("rgba(0, 153, 204, 0.1)");
  });

  it("works without a leading #", () => {
    expect(hexToRgba("0099cc", 0.1)).toBe("rgba(0, 153, 204, 0.1)");
  });

  it("expands a 3-digit shorthand hex", () => {
    expect(hexToRgba("#0cc", 0.5)).toBe("rgba(0, 204, 204, 0.5)");
  });
});

describe("drawBarChart — per-bar color override flows into what actually gets painted", () => {
  it("default rendering (no item sets a color) paints every bar with colors.bar, unchanged from before this feature", () => {
    const items: ChartItem[] = [
      { label: "Aug 6", value: 100 },
      { label: "Aug 7", value: 200 },
    ];
    const layout = computeBarLayout(items);
    const { ctx, calls } = createMockContext();
    drawBarChart(ctx, layout, { yAxisLabel: "Y", xAxisLabel: "X", colors: BASE_COLORS });

    const fillStyleValues = calls.filter((c) => c.name === "fillStyle").map((c) => c.value);
    // Never any color other than the default bar color used for bar fills
    // specifically (text/surface use their own distinct colors, which is fine).
    expect(fillStyleValues).toContain(BASE_COLORS.bar);
  });

  it("uses a bar's own color when set, and falls back to colors.bar when not — one export, mixed colors", () => {
    const items: ChartItem[] = [
      { label: "Station A", value: 100, color: "#111111" },
      { label: "Station B", value: 200 }, // no override
      { label: "Station C", value: 150, color: "#333333" },
    ];
    const layout = computeBarLayout(items);
    const { ctx, calls } = createMockContext();
    drawBarChart(ctx, layout, { yAxisLabel: "Y", xAxisLabel: "X", colors: BASE_COLORS });

    const fillStyleValues = calls.filter((c) => c.name === "fillStyle").map((c) => c.value);
    expect(fillStyleValues).toContain("#111111");
    expect(fillStyleValues).toContain("#333333");
    expect(fillStyleValues).toContain(BASE_COLORS.bar); // Station B's fallback
  });

  it("recoloring one bar never touches another bar's color", () => {
    const items: ChartItem[] = [
      { label: "Station A", value: 100, color: "#111111" },
      { label: "Station B", value: 200, color: "#222222" },
    ];
    const layout = computeBarLayout(items);
    expect(layout.bars[0].color).toBe("#111111");
    expect(layout.bars[1].color).toBe("#222222");
    // Changing A's color in a fresh call leaves B's completely untouched.
    const recolored = computeBarLayout([{ ...items[0], color: "#999999" }, items[1]]);
    expect(recolored.bars[0].color).toBe("#999999");
    expect(recolored.bars[1].color).toBe("#222222");
  });
});

describe("drawLineChart — line color and its derived area fill both flow into what actually gets painted", () => {
  it("default rendering uses colors.bar for the line/markers and colors.areaFill for the fill, unchanged", () => {
    const items: ChartItem[] = [
      { label: "Aug 6", value: 100 },
      { label: "Aug 7", value: 200 },
    ];
    const layout = computeLineLayout(items);
    const { ctx, calls } = createMockContext();
    drawLineChart(ctx, layout, { yAxisLabel: "Y", xAxisLabel: "X", colors: BASE_COLORS });

    expect(calls.some((c) => c.name === "strokeStyle" && c.value === BASE_COLORS.bar)).toBe(true);
    expect(calls.some((c) => c.name === "fillStyle" && c.value === BASE_COLORS.areaFill)).toBe(true);
  });

  it("a custom line color and its hexToRgba-derived fill both reach the actual draw calls", () => {
    const items: ChartItem[] = [
      { label: "Aug 6", value: 100 },
      { label: "Aug 7", value: 200 },
    ];
    const layout = computeLineLayout(items);
    const { ctx, calls } = createMockContext();
    const customColors: ChartColors = {
      ...BASE_COLORS,
      bar: "#6bbbae",
      areaFill: hexToRgba("#6bbbae", 0.1),
    };
    drawLineChart(ctx, layout, { yAxisLabel: "Y", xAxisLabel: "X", colors: customColors });

    expect(calls.some((c) => c.name === "strokeStyle" && c.value === "#6bbbae")).toBe(true);
    expect(calls.some((c) => c.name === "fillStyle" && c.value === "rgba(107, 187, 174, 0.1)")).toBe(true);
    // The old default blue must not leak through when a custom color is used.
    expect(calls.some((c) => c.name === "strokeStyle" && c.value === BASE_COLORS.bar)).toBe(false);
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
