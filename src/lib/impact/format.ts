// Number formatting and copyable-text builders.
//
// fmtExact is ported directly from both reference scripts' fmt_exact():
// individual figures are never rounded away, and totals are always summed
// from full-precision numbers first, never from the already-rounded
// display strings. Independently rounding each figure is what once let
// four station bars (1750.4, 1293.2, 956.1, 718.4) display as
// 1,750 + 1,293 + 956 + 718 = 4,717 against a true total of 4,718.1.

import type { Country } from "./formulas";
import type { Period } from "./parse";
import { fmtDate, fmtDay } from "./parse";

/**
 * Formats a figure WITHOUT rounding it away: a whole value prints with no
 * decimal, one that isn't whole prints the decimal it actually has.
 */
export function fmtExact(value: number, maxDp = 2): string {
  const factor = 10 ** maxDp;
  const rounded = Math.round((value + Number.EPSILON) * factor) / factor;
  const nearestInt = Math.round(rounded);
  if (Math.abs(rounded - nearestInt) < 10 ** -(maxDp + 2)) {
    return nearestInt.toLocaleString("en-US");
  }
  const fixed = rounded.toFixed(maxDp);
  const trimmed = fixed.replace(/0+$/, "").replace(/\.$/, "");
  const [intPart, decPart] = trimmed.split(".");
  const withCommas = Number(intPart).toLocaleString("en-US");
  return decPart ? `${withCommas}.${decPart}` : withCommas;
}

/** Totals are always summed from full-precision values, never from displayed figures. */
export function sumExact(values: number[]): number {
  return values.reduce((a, b) => a + b, 0);
}

// ---------------------------------------------------------------------------
// Provenance — restates what was read, so a report figure can be traced
// back months later. Mirrors the "How this run read the data" block the
// scripts print at the end of a run.
// ---------------------------------------------------------------------------
export type FileProvenance = { name: string; unit: string };

/**
 * One manual correction made in the data table — station, date, and the
 * before/after values. Every edit that can reach a chart, a metric, or a
 * summary must appear here: this is what makes an edit impossible to hide.
 */
export type EditProvenance = { station: string; date: string; original: number; edited: number };

export function buildProvenanceText(opts: {
  files: FileProvenance[];
  country: Country;
  start: string;
  end: string;
  edits?: EditProvenance[];
}): string {
  const lines: string[] = [];
  lines.push("How this run read the data");
  lines.push("");
  lines.push("Files:");
  for (const f of opts.files) {
    lines.push(`  ${f.name} — read as ${f.unit}`);
  }
  lines.push(
    `Client: ${opts.country === "US" ? "United States (gallons / 20 oz)" : "Canada (litres / 500 mL)"}`
  );
  lines.push(`Date range: ${fmtDate(opts.start)} to ${fmtDate(opts.end)}`);
  lines.push("");
  lines.push(buildEditsSummaryLine(opts.edits ?? []));
  for (const e of opts.edits ?? []) {
    lines.push(`  ${e.station} · ${fmtDay(e.date)} · ${fmtExact(e.original)} → ${fmtExact(e.edited)}`);
  }
  return lines.join("\n");
}

/** "No manual adjustments" or "N values manually adjusted" — the headline
 *  line of the edits disclosure, usable on its own in the UI as well as
 *  inside the full provenance text. */
export function buildEditsSummaryLine(edits: EditProvenance[]): string {
  if (edits.length === 0) return "No manual adjustments.";
  return `${edits.length} value${edits.length === 1 ? "" : "s"} manually adjusted:`;
}

// ---------------------------------------------------------------------------
// Auto-written chart summaries — plain factual sentences, no invented
// equivalences (no sourced conversion factor for "cars off the road" etc.).
// ---------------------------------------------------------------------------
function pctChange(peak: number, opening: number): number {
  return opening === 0 ? Infinity : ((peak - opening) / opening) * 100;
}

export function buildPeriodSummary(periods: Period[], bottleUnitLabel: string): string {
  if (periods.length === 0) return "No data in the selected range.";

  const opening = periods[0];
  const peak = periods.reduce((max, p) => (p.value > max.value ? p : max), periods[0]);
  const total = sumExact(periods.map((p) => p.value));
  const totalSentence = `A total of ${fmtExact(total)} ${bottleUnitLabel} were avoided across ${periods.length} period${periods.length === 1 ? "" : "s"}.`;

  if (peak.label === opening.label) {
    return `${totalSentence} The peak period was ${peak.label}, with ${fmtExact(peak.value)} ${bottleUnitLabel} avoided — also the opening period.`;
  }

  const change = pctChange(peak.value, opening.value);
  const changeText =
    change === Infinity
      ? `up from ${fmtExact(opening.value)} in the opening period (${opening.label})`
      : `${Math.round(Math.abs(change))}% ${change >= 0 ? "higher" : "lower"} than the opening period (${opening.label}, ${fmtExact(opening.value)})`;

  return `${totalSentence} The peak period was ${peak.label} with ${fmtExact(peak.value)} ${bottleUnitLabel} avoided, ${changeText}.`;
}

export function buildStationSummary(items: Period[], unitWord: string): string {
  if (items.length === 0) return "No station data in the selected range.";

  const total = sumExact(items.map((i) => i.value));
  const busiest = items.reduce((max, item) => (item.value > max.value ? item : max), items[0]);
  const share = total === 0 ? 0 : (busiest.value / total) * 100;

  return `${busiest.label} was the busiest station, dispensing ${fmtExact(busiest.value)} ${unitWord} — ${Math.round(share)}% of the ${fmtExact(total)} ${unitWord} total across ${items.length} stations.`;
}

export function buildCo2Summary(cumulative: Period[]): string {
  if (cumulative.length === 0) return "No data in the selected range.";
  const last = cumulative[cumulative.length - 1];
  return `A total of ${fmtExact(last.value)} kg of CO2 was avoided over the selected range, as of ${last.label}.`;
}
