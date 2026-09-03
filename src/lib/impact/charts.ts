// Chart geometry + <canvas> rendering, ported from the HTML/CSS charts in
// _reference/impact_chart.py so exported PNGs keep the same colours,
// proportions and layout already used in delivered reports.
//
// Two rendering bugs are fixed in the Python reference and MUST stay fixed
// here — see computeLineLayout below for where each one lives:
//   1. The area fill under the CO2 line closes at the FIRST and LAST data
//      points, not the edges of the plot box. Closing at the edges paints
//      fill with no data behind it, which reads as the series continuing
//      past the first/last period.
//   2. Value labels sit above their marker, but drop BELOW it instead of
//      being clamped upward when within ~14px of the top. Clamping upward
//      would collide on every single run, since the last point of a
//      cumulative series is always the maximum.
//
// The geometry functions here are pure (no canvas, no DOM) and are what the
// tests exercise. The draw functions at the bottom paint that geometry onto
// a real <canvas> and aren't unit-tested directly.

import type { Period } from "./parse";
import { fmtExact } from "./format";

export type ChartItem = Period;

export type ChartColors = {
  bar: string;
  surface: string;
  grid: string;
  areaFill: string;
  textPrimary: string;
  textSecondary: string;
};

const CHART_HEIGHT = 300;
const WRAP_PADDING_X = 48;
const WRAP_PADDING_TOP = 40;
const WRAP_PADDING_BOTTOM = 40;
const YAXIS_TITLE_COL = 34; // vertical y-axis title column
const TICK_GUTTER = 64; // space for tick labels, left of the plot (matches CSS chart margin-left)
const XLABELS_MARGIN_TOP = 12;
const XLABELS_HEIGHT = 18;
const XAXIS_TITLE_MARGIN_TOP = 18;
const XAXIS_TITLE_HEIGHT = 18;

function columnWidth(n: number): number {
  return n <= 8 ? 140 : Math.max(64, Math.floor(1400 / n));
}

function chartWidthFor(plotWidth: number): number {
  return Math.max(900, Math.min(2400, plotWidth + 260));
}

function totalImageHeight(): number {
  return (
    WRAP_PADDING_TOP +
    CHART_HEIGHT +
    XLABELS_MARGIN_TOP +
    XLABELS_HEIGHT +
    XAXIS_TITLE_MARGIN_TOP +
    XAXIS_TITLE_HEIGHT +
    WRAP_PADDING_BOTTOM
  );
}

function plotOriginX(): number {
  return WRAP_PADDING_X + YAXIS_TITLE_COL + TICK_GUTTER;
}

/** Same "nice round numbers" tick algorithm as the Python nice_ticks(). */
export function niceTicks(maxVal: number, targetTicks = 4): { ticks: number[]; top: number } {
  if (maxVal <= 0) return { ticks: [1], top: 1 };
  const rawStep = maxVal / targetTicks;
  const magnitude = 10 ** Math.floor(Math.log10(rawStep));
  const residual = rawStep / magnitude;
  let step: number;
  if (residual > 5) step = 10 * magnitude;
  else if (residual > 2) step = 5 * magnitude;
  else if (residual > 1) step = 2 * magnitude;
  else step = magnitude;
  const top = Math.ceil(maxVal / step) * step;
  const count = Math.round(top / step);
  const ticks = Array.from({ length: count }, (_, i) => step * (i + 1));
  return { ticks, top };
}

// ---------------------------------------------------------------------------
// Bar chart layout — bottles-by-period and volume-by-station
// ---------------------------------------------------------------------------
export type BarLayout = {
  n: number;
  colWidth: number;
  plotWidth: number;
  imageWidth: number;
  imageHeight: number;
  chartHeight: number;
  originX: number;
  originY: number;
  ticks: number[];
  top: number;
  bars: Array<{ centerX: number; height: number; value: number; label: string; showValueLabel: boolean }>;
};

export function computeBarLayout(items: ChartItem[]): BarLayout {
  const n = items.length;
  const values = items.map((i) => i.value);
  const maxVal = values.length ? Math.max(...values) : 0;
  const { ticks, top } = niceTicks(maxVal);
  const colWidth = columnWidth(n);
  const plotWidth = colWidth * n;
  const imageWidth = chartWidthFor(plotWidth);
  const labelMany = n > 10;

  const bars = items.map((item, i) => {
    const height = top ? Math.round((item.value / top) * CHART_HEIGHT * 10) / 10 : 0;
    const showValueLabel = !labelMany || item.value === maxVal;
    return { centerX: (i + 0.5) * colWidth, height, value: item.value, label: item.label, showValueLabel };
  });

  return {
    n,
    colWidth,
    plotWidth,
    imageWidth,
    imageHeight: totalImageHeight(),
    chartHeight: CHART_HEIGHT,
    originX: plotOriginX(),
    originY: WRAP_PADDING_TOP,
    ticks,
    top,
    bars,
  };
}

// ---------------------------------------------------------------------------
// Line chart layout — cumulative CO2 avoided
// ---------------------------------------------------------------------------
export type LinePoint = {
  x: number;
  y: number;
  value: number;
  label: string;
  showLabel: boolean;
  labelY: number;
};

export type LineLayout = {
  n: number;
  colWidth: number;
  plotWidth: number;
  imageWidth: number;
  imageHeight: number;
  chartHeight: number;
  originX: number;
  originY: number;
  ticks: number[];
  top: number;
  points: LinePoint[];
  /** Area-fill polygon, closed at the FIRST/LAST data x — not the plot edges (bug fix #1). */
  areaPoints: Array<{ x: number; y: number }>;
};

export function computeLineLayout(items: ChartItem[]): LineLayout {
  const n = items.length;
  const values = items.map((i) => i.value);
  const maxVal = values.length ? Math.max(...values) : 0;
  const { ticks, top } = niceTicks(maxVal);
  const colWidth = columnWidth(n);
  const plotWidth = colWidth * n;
  const imageWidth = chartWidthFor(plotWidth);
  const labelMany = n > 10;

  const yPos = (v: number) => (top ? CHART_HEIGHT - (v / top) * CHART_HEIGHT : CHART_HEIGHT);

  const points: LinePoint[] = items.map((item, i) => {
    const x = (i + 0.5) * colWidth;
    const y = Math.round(yPos(item.value) * 10) / 10;
    const show = !labelMany || i === n - 1;

    // Bug fix #2: labels sit above the marker (y - 14); when that's within
    // ~14px of the top, drop BELOW the marker (y + 22) instead of clamping
    // upward — clamping collides on every run, since the last point of a
    // cumulative series is always the maximum.
    let labelY = y - 14;
    if (labelY < 14) labelY = y + 22;

    return { x, y, value: item.value, label: item.label, showLabel: show, labelY };
  });

  // Bug fix #1: close the area at the first/last DATA points, not at the
  // plot-box edges (x=0 / x=plotWidth).
  const areaPoints = points.length
    ? [
        { x: points[0].x, y: CHART_HEIGHT },
        ...points.map((p) => ({ x: p.x, y: p.y })),
        { x: points[points.length - 1].x, y: CHART_HEIGHT },
      ]
    : [];

  return {
    n,
    colWidth,
    plotWidth,
    imageWidth,
    imageHeight: totalImageHeight(),
    chartHeight: CHART_HEIGHT,
    originX: plotOriginX(),
    originY: WRAP_PADDING_TOP,
    ticks,
    top,
    points,
    areaPoints,
  };
}

// ---------------------------------------------------------------------------
// Canvas drawing — not unit-tested (needs a real 2D context); paints the
// layouts above using the brand colours passed in by the caller. Keeping
// hexes out of this file (they're read from @theme tokens by the caller) is
// what "brand values as tokens, not hardcoded hexes" means for a canvas
// renderer that can't read CSS itself.
// ---------------------------------------------------------------------------
const FONT_LABEL = "600 14px system-ui, -apple-system, Segoe UI, sans-serif";
const FONT_TICK = "13px system-ui, -apple-system, Segoe UI, sans-serif";
const FONT_VALUE = "600 14px system-ui, -apple-system, Segoe UI, sans-serif";

function drawGridAndAxes(
  ctx: CanvasRenderingContext2D,
  layout: { originX: number; originY: number; plotWidth: number; chartHeight: number; ticks: number[]; top: number },
  colors: ChartColors,
  yAxisLabel: string,
  xAxisLabel: string
): void {
  const { originX, originY, plotWidth, chartHeight, ticks, top } = layout;

  ctx.strokeStyle = colors.grid;
  ctx.fillStyle = colors.textSecondary;
  ctx.font = FONT_TICK;
  ctx.textAlign = "right";
  ctx.textBaseline = "middle";
  ctx.lineWidth = 1;

  for (const tick of ticks) {
    const y = originY + (top ? chartHeight - (tick / top) * chartHeight : chartHeight);
    ctx.beginPath();
    ctx.moveTo(originX, y);
    ctx.lineTo(originX + plotWidth, y);
    ctx.stroke();
    ctx.fillText(tick.toLocaleString("en-US"), originX - 10, y);
  }

  // baseline
  ctx.beginPath();
  ctx.moveTo(originX, originY + chartHeight);
  ctx.lineTo(originX + plotWidth, originY + chartHeight);
  ctx.stroke();

  // y-axis title, rotated
  ctx.save();
  ctx.fillStyle = colors.textSecondary;
  ctx.font = FONT_LABEL;
  ctx.textAlign = "center";
  ctx.translate(WRAP_PADDING_X + YAXIS_TITLE_COL / 2, originY + chartHeight / 2);
  ctx.rotate(-Math.PI / 2);
  ctx.fillText(yAxisLabel, 0, 0);
  ctx.restore();

  // x-axis title
  ctx.fillStyle = colors.textSecondary;
  ctx.font = FONT_LABEL;
  ctx.textAlign = "center";
  ctx.textBaseline = "alphabetic";
  ctx.fillText(
    xAxisLabel,
    originX + plotWidth / 2,
    originY + chartHeight + XLABELS_MARGIN_TOP + XLABELS_HEIGHT + XAXIS_TITLE_MARGIN_TOP + 12
  );
}

function drawXLabels(
  ctx: CanvasRenderingContext2D,
  originX: number,
  originY: number,
  chartHeight: number,
  colWidth: number,
  colors: ChartColors,
  labels: string[]
): void {
  ctx.fillStyle = colors.textSecondary;
  ctx.font = FONT_TICK;
  ctx.textAlign = "center";
  ctx.textBaseline = "top";
  const y = originY + chartHeight + XLABELS_MARGIN_TOP;
  labels.forEach((label, i) => {
    ctx.fillText(label, originX + (i + 0.5) * colWidth, y);
  });
}

function roundRectTop(ctx: CanvasRenderingContext2D, x: number, yTop: number, w: number, h: number, r: number): void {
  const yBottom = yTop + h;
  const radius = Math.min(r, w / 2, Math.max(h, 0));
  ctx.beginPath();
  ctx.moveTo(x, yBottom);
  ctx.lineTo(x, yTop + radius);
  ctx.arcTo(x, yTop, x + radius, yTop, radius);
  ctx.lineTo(x + w - radius, yTop);
  ctx.arcTo(x + w, yTop, x + w, yTop + radius, radius);
  ctx.lineTo(x + w, yBottom);
  ctx.closePath();
  ctx.fill();
}

export function drawBarChart(
  ctx: CanvasRenderingContext2D,
  layout: BarLayout,
  opts: { yAxisLabel: string; xAxisLabel: string; colors: ChartColors }
): void {
  const { colors } = opts;
  const { originX, originY, chartHeight, bars } = layout;

  ctx.fillStyle = colors.surface;
  ctx.fillRect(0, 0, layout.imageWidth, layout.imageHeight);

  drawGridAndAxes(ctx, layout, colors, opts.yAxisLabel, opts.xAxisLabel);

  const barWidth = 24;
  ctx.fillStyle = colors.bar;
  for (const bar of bars) {
    const x = originX + bar.centerX - barWidth / 2;
    const yTop = originY + chartHeight - bar.height;
    roundRectTop(ctx, x, yTop, barWidth, bar.height, 4);
  }

  ctx.fillStyle = colors.textPrimary;
  ctx.font = FONT_VALUE;
  ctx.textAlign = "center";
  ctx.textBaseline = "bottom";
  for (const bar of bars) {
    if (!bar.showValueLabel) continue;
    const x = originX + bar.centerX;
    const yTop = originY + chartHeight - bar.height;
    ctx.fillText(fmtExact(bar.value), x, yTop - 8);
  }

  drawXLabels(ctx, originX, originY, chartHeight, layout.colWidth, colors, bars.map((b) => b.label));
}

export function drawLineChart(
  ctx: CanvasRenderingContext2D,
  layout: LineLayout,
  opts: { yAxisLabel: string; xAxisLabel: string; colors: ChartColors }
): void {
  const { colors } = opts;
  const { originX, originY, points, areaPoints } = layout;

  ctx.fillStyle = colors.surface;
  ctx.fillRect(0, 0, layout.imageWidth, layout.imageHeight);

  drawGridAndAxes(ctx, layout, colors, opts.yAxisLabel, opts.xAxisLabel);

  if (points.length > 0) {
    ctx.save();
    ctx.translate(originX, originY);

    ctx.fillStyle = colors.areaFill;
    ctx.beginPath();
    areaPoints.forEach((p, i) => (i === 0 ? ctx.moveTo(p.x, p.y) : ctx.lineTo(p.x, p.y)));
    ctx.closePath();
    ctx.fill();

    ctx.strokeStyle = colors.bar;
    ctx.lineWidth = 2;
    ctx.lineJoin = "round";
    ctx.lineCap = "round";
    ctx.beginPath();
    points.forEach((p, i) => (i === 0 ? ctx.moveTo(p.x, p.y) : ctx.lineTo(p.x, p.y)));
    ctx.stroke();

    ctx.fillStyle = colors.bar;
    ctx.strokeStyle = colors.surface;
    ctx.lineWidth = 2;
    for (const p of points) {
      ctx.beginPath();
      ctx.arc(p.x, p.y, 5, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();
    }

    ctx.fillStyle = colors.textPrimary;
    ctx.font = FONT_VALUE;
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    for (const p of points) {
      if (!p.showLabel) continue;
      ctx.fillText(fmtExact(p.value), p.x, p.labelY);
    }

    ctx.restore();
  }

  drawXLabels(ctx, originX, originY, layout.chartHeight, layout.colWidth, colors, points.map((p) => p.label));
}

/**
 * Renders a chart to a <canvas> at 2x pixel density (independent of the
 * viewing device's actual DPR) so copied/downloaded PNGs are crisp.
 */
export function renderChart(
  canvas: HTMLCanvasElement,
  kind: "bar" | "line",
  items: ChartItem[],
  opts: { yAxisLabel: string; xAxisLabel: string; colors: ChartColors }
): void {
  const dpr = 2;
  const layout = kind === "bar" ? computeBarLayout(items) : computeLineLayout(items);

  canvas.width = Math.round(layout.imageWidth * dpr);
  canvas.height = Math.round(layout.imageHeight * dpr);
  canvas.style.width = `${layout.imageWidth}px`;
  canvas.style.height = `${layout.imageHeight}px`;

  const ctx = canvas.getContext("2d");
  if (!ctx) return;
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  ctx.clearRect(0, 0, layout.imageWidth, layout.imageHeight);

  if (kind === "bar") drawBarChart(ctx, layout as BarLayout, opts);
  else drawLineChart(ctx, layout as LineLayout, opts);
}
