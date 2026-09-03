// File parsing — ported from _reference/impact_calculator.py and
// _reference/impact_chart.py: the units sniffer, the two input-file
// formats (consolidated / range export), and the rules for what gets
// excluded (TOTAL * columns, rows below the first blank Station cell).
//
// Everything down to `readUsageFile` is plain-data-in, plain-data-out and
// runs the same under Vitest as in the browser. `readUsageFile` is the one
// function that touches the DOM (File) and the xlsx package — it's kept at
// the bottom so tests can exercise everything above it by constructing
// SheetData directly, without needing a real workbook file.

import * as XLSX from "xlsx";
import { LITRES_PER_US_GALLON } from "./formulas";

// ---------------------------------------------------------------------------
// Units — a property of the input file, never assumed
// ---------------------------------------------------------------------------
// A units note has to look like a declaration ("all in gallons", "values in
// litres", "units: gallons") — a stray "40 L bags" in a notes row must not
// be mistaken for one.
export type Unit = "gallons" | "litres";

const UNIT_WORD = "(gallons?|gals?|litres?|liters?)";
const UNITS_NOTE_PATTERNS = [
  new RegExp(`\\bin\\b[^A-Za-z]{0,3}${UNIT_WORD}\\b`, "i"),
  new RegExp(`\\bunits?\\b\\s*[:=]\\s*${UNIT_WORD}\\b`, "i"),
];

const GALLON_ANSWERS = new Set(["g", "gal", "gals", "gallon", "gallons"]);
const LITRE_ANSWERS = new Set(["l", "litre", "litres", "liter", "liters"]);

/** Maps any accepted spelling to "gallons" or "litres". Null if unrecognised. */
export function normaliseUnit(word: string): Unit | null {
  const w = word.trim().toLowerCase();
  if (GALLON_ANSWERS.has(w)) return "gallons";
  if (LITRE_ANSWERS.has(w)) return "litres";
  return null;
}

/**
 * Looks for a free-text units declaration anywhere in a file's text cells /
 * lines — e.g. an "all in gallons" cell tucked into a notes row.
 *
 * Returns "gallons", "litres", or null. This is only ever used to pre-fill
 * the units selector: a mislabelled note is exactly as damaging as a wrong
 * guess, so it is never acted on without a human confirming it.
 */
function matchUnitsNotes(texts: string[]): Array<{ unit: Unit; text: string }> {
  const matches: Array<{ unit: Unit; text: string }> = [];
  for (const text of texts) {
    for (const pattern of UNITS_NOTE_PATTERNS) {
      const match = pattern.exec(text);
      if (match) {
        const unit = normaliseUnit(match[1]);
        if (unit) matches.push({ unit, text });
      }
    }
  }
  return matches;
}

export function sniffUnitsNote(texts: string[]): Unit | null {
  const found = new Set<Unit>(matchUnitsNotes(texts).map((m) => m.unit));
  if (found.size === 1) return [...found][0];
  return null; // nothing found, or the file contradicts itself
}

/**
 * Same detection as sniffUnitsNote, but also returns the matched source
 * text verbatim — so a corrected-workbook export can carry the original
 * units note forward instead of losing it.
 */
export function findUnitsNoteText(texts: string[]): string | null {
  const unit = sniffUnitsNote(texts);
  if (!unit) return null;
  const match = matchUnitsNotes(texts).find((m) => m.unit === unit);
  return match ? match.text : null;
}

// ---------------------------------------------------------------------------
// Usage table — Station x Date, in the file's own units unless noted
// ---------------------------------------------------------------------------
export type UsageTable = {
  /** Sorted ascending ISO ("YYYY-MM-DD") dates. */
  dates: string[];
  /** Station names, first-seen order. */
  stations: string[];
  /** values[date][station] = volume, in whatever unit the table currently holds. */
  values: Record<string, Record<string, number>>;
};

function emptyTable(): UsageTable {
  return { dates: [], stations: [], values: {} };
}

function setCell(table: UsageTable, date: string, station: string, value: number): void {
  if (!table.values[date]) {
    table.values[date] = {};
    table.dates.push(date);
  }
  if (!table.stations.includes(station)) table.stations.push(station);
  table.values[date][station] = value;
}

function finalizeTable(table: UsageTable): UsageTable {
  table.dates.sort();
  return table;
}

function isBlank(value: unknown): boolean {
  return value === null || value === undefined || String(value).trim() === "";
}

function toNumberOrZero(value: unknown): number {
  if (typeof value === "number") return isFinite(value) ? value : 0;
  if (typeof value === "string") {
    const n = Number(value.replace(/,/g, "").trim());
    return isFinite(n) ? n : 0;
  }
  return 0;
}

// ---------------------------------------------------------------------------
// Format detection — two shapes, auto-detected per file
// ---------------------------------------------------------------------------
export type DetectedFormat = "range_export" | "consolidated";

export type SheetData = {
  header: unknown[];
  rows: unknown[][];
};

export function detectFormat(header: unknown[]): DetectedFormat {
  const hasRangeExportCols =
    header.includes("Location_Name") && header.includes("Read_Time") && header.includes("Flow");
  if (hasRangeExportCols) return "range_export";

  const hasStationCol = header.some((c) => String(c ?? "").trim().toLowerCase() === "station");
  if (hasStationCol) return "consolidated";

  throw new Error(
    "Could not recognize this file's columns as either a range export " +
      "(needs Location_Name, Read_Time, Flow) or a consolidated view " +
      `(needs a Station column). Columns found: ${header.map((c) => String(c ?? "")).join(", ")}`
  );
}

// ---------------------------------------------------------------------------
// Date parsing — used for consolidated-format column headers and for
// range-export Read_Time cells. Anything that doesn't look like a date
// (e.g. "TOTAL PRE-EVENT", "TOTAL EVENT", "TOTAL RENTAL") returns null and
// the caller skips it, same as the Python loaders' behaviour.
// ---------------------------------------------------------------------------
const MONTH_ABBR = ["jan", "feb", "mar", "apr", "may", "jun", "jul", "aug", "sep", "oct", "nov", "dec"];
export const MONTH_NAMES = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

function isoFromUTC(y: number, m: number, d: number): string {
  const mm = String(m).padStart(2, "0");
  const dd = String(d).padStart(2, "0");
  return `${y}-${mm}-${dd}`;
}

function excelSerialToISO(serial: number): string {
  // Excel's epoch is 1899-12-30 (it carries the historical 1900 leap-year bug).
  const ms = Math.round((serial - 25569) * 86400 * 1000);
  const d = new Date(ms);
  return isoFromUTC(d.getUTCFullYear(), d.getUTCMonth() + 1, d.getUTCDate());
}

/**
 * Parses a consolidated-workbook date COLUMN HEADER. Real Excel date cells
 * arrive as Date objects (or serial numbers) via XLSX.read({cellDates:true});
 * text headers like "Aug 6" or "8/6/2024" are parsed loosely. Anything that
 * isn't a date returns null and the column is skipped.
 */
export function parseHeaderDate(value: unknown, fallbackYear: number): string | null {
  if (value instanceof Date && !isNaN(value.getTime())) {
    // SheetJS constructs date cells with UTC-anchored fields (spreadsheets
    // have no timezone concept), so read them back the same way.
    return isoFromUTC(value.getUTCFullYear(), value.getUTCMonth() + 1, value.getUTCDate());
  }
  if (typeof value === "number" && isFinite(value)) {
    return excelSerialToISO(value);
  }
  if (typeof value !== "string") return null;

  const text = value.trim();
  if (!text || !/\d/.test(text)) return null; // dates always contain a digit

  let m = /^(\d{4})-(\d{1,2})-(\d{1,2})/.exec(text);
  if (m) return isoFromUTC(+m[1], +m[2], +m[3]);

  m = /^(\d{1,2})\/(\d{1,2})(?:\/(\d{2,4}))?$/.exec(text);
  if (m) {
    let year = m[3] ? +m[3] : fallbackYear;
    if (year < 100) year += 2000;
    return isoFromUTC(year, +m[1], +m[2]);
  }

  m = /^([A-Za-z]{3,9})\.?\s+(\d{1,2})(?:st|nd|rd|th)?(?:,?\s+(\d{4}))?$/.exec(text);
  if (m) {
    const monthIdx = MONTH_ABBR.indexOf(m[1].slice(0, 3).toLowerCase());
    if (monthIdx === -1) return null;
    const year = m[3] ? +m[3] : fallbackYear;
    return isoFromUTC(year, monthIdx + 1, +m[2]);
  }

  return null;
}

function parseDateTimeToISODate(value: unknown): string | null {
  if (value instanceof Date && !isNaN(value.getTime())) {
    return isoFromUTC(value.getUTCFullYear(), value.getUTCMonth() + 1, value.getUTCDate());
  }
  if (typeof value === "number" && isFinite(value)) {
    return excelSerialToISO(value);
  }
  if (typeof value === "string") {
    const text = value.trim();
    let m = /^(\d{4})-(\d{1,2})-(\d{1,2})/.exec(text);
    if (m) return isoFromUTC(+m[1], +m[2], +m[3]);
    m = /^(\d{1,2})\/(\d{1,2})\/(\d{2,4})/.exec(text);
    if (m) {
      let year = +m[3];
      if (year < 100) year += 2000;
      return isoFromUTC(year, +m[1], +m[2]);
    }
    const d = new Date(text);
    if (!isNaN(d.getTime())) return isoFromUTC(d.getFullYear(), d.getMonth() + 1, d.getDate());
  }
  return null;
}

// ---------------------------------------------------------------------------
// Loading — two input shapes, both reduced to a Station x Date table
// ---------------------------------------------------------------------------

/**
 * Station-rows / date-columns workbook -> Station x Date table.
 *
 * TOTAL PRE-EVENT / TOTAL EVENT / TOTAL RENTAL (and any other non-date
 * column) are excluded automatically: they simply don't parse as dates.
 * Stops at the first blank Station cell — notes/summary rows sit below the
 * data and must not be counted.
 */
export function loadConsolidated(sheet: SheetData, fallbackYear = new Date().getFullYear()): UsageTable {
  const { header, rows } = sheet;
  const stationIdx = header.findIndex((c) => String(c ?? "").trim().toLowerCase() === "station");
  if (stationIdx === -1) {
    throw new Error("loadConsolidated: no Station column found.");
  }

  const dateCols: Array<{ idx: number; date: string }> = [];
  header.forEach((col, idx) => {
    if (idx === stationIdx) return;
    const date = parseHeaderDate(col, fallbackYear);
    if (date) dateCols.push({ idx, date });
  });

  const table = emptyTable();
  for (const row of rows) {
    const station = row[stationIdx];
    if (isBlank(station)) break; // stop at the first blank Station cell
    const stationName = String(station).trim();
    for (const { idx, date } of dateCols) {
      setCell(table, date, stationName, toNumberOrZero(row[idx]));
    }
  }
  return finalizeTable(table);
}

/**
 * Raw hourly meter reads (Location_Name, Read_Time, Flow) -> Station x Date
 * table, grouped by calendar date and summed.
 */
export function loadRangeExport(sheet: SheetData): UsageTable {
  const { header, rows } = sheet;
  const locationIdx = header.indexOf("Location_Name");
  const readTimeIdx = header.indexOf("Read_Time");
  const flowIdx = header.indexOf("Flow");
  if (locationIdx === -1 || readTimeIdx === -1 || flowIdx === -1) {
    throw new Error("loadRangeExport: missing Location_Name, Read_Time, or Flow column.");
  }

  const sums = new Map<string, number>(); // key = `${station}\u0000${date}`
  const order: string[] = [];
  for (const row of rows) {
    const station = row[locationIdx];
    if (isBlank(station)) continue;
    const date = parseDateTimeToISODate(row[readTimeIdx]);
    if (!date) continue;
    const flow = toNumberOrZero(row[flowIdx]);
    const key = `${String(station).trim()}\u0000${date}`;
    if (!sums.has(key)) order.push(key);
    sums.set(key, (sums.get(key) ?? 0) + flow);
  }

  const table = emptyTable();
  for (const key of order) {
    const [station, date] = key.split("\u0000");
    setCell(table, date, station, sums.get(key)!);
  }
  return finalizeTable(table);
}

export function loadSheet(sheet: SheetData): { format: DetectedFormat; table: UsageTable } {
  const format = detectFormat(sheet.header);
  const table = format === "range_export" ? loadRangeExport(sheet) : loadConsolidated(sheet);
  return { format, table };
}

// ---------------------------------------------------------------------------
// Units conversion + combining multiple files
// ---------------------------------------------------------------------------

/** Converts a table to litres. Gallons files are converted here, at the load
 *  boundary, so everything downstream stays in litres. */
export function convertTableToLitres(table: UsageTable, unit: Unit): UsageTable {
  if (unit === "litres") return table;
  const out: UsageTable = { dates: [...table.dates], stations: [...table.stations], values: {} };
  for (const date of table.dates) {
    out.values[date] = {};
    for (const station of Object.keys(table.values[date])) {
      out.values[date][station] = table.values[date][station] * LITRES_PER_US_GALLON;
    }
  }
  return out;
}

function scaleTable(table: UsageTable, factor: number): UsageTable {
  if (factor === 1) return table;
  const out: UsageTable = { dates: [...table.dates], stations: [...table.stations], values: {} };
  for (const date of table.dates) {
    out.values[date] = {};
    for (const station of Object.keys(table.values[date])) {
      out.values[date][station] = table.values[date][station] * factor;
    }
  }
  return out;
}

/** Converts a table between "gallons" and "litres" in either direction. */
export function convertTable(table: UsageTable, from: Unit, to: Unit): UsageTable {
  if (from === to) return table;
  if (to === "litres") return convertTableToLitres(table, from); // from must be "gallons" here
  return scaleTable(table, 1 / LITRES_PER_US_GALLON); // to === "gallons", from === "litres"
}

/** Sums overlapping (date, station) cells across files; missing cells count as 0. */
export function combineTables(tables: UsageTable[]): UsageTable {
  const combined = emptyTable();
  for (const table of tables) {
    for (const date of table.dates) {
      for (const station of Object.keys(table.values[date])) {
        const prev = combined.values[date]?.[station] ?? 0;
        setCell(combined, date, station, prev + table.values[date][station]);
      }
    }
  }
  return finalizeTable(combined);
}

// ---------------------------------------------------------------------------
// Date helpers — pure, ISO "YYYY-MM-DD" strings, UTC-anchored to dodge DST
// ---------------------------------------------------------------------------
function toUTCDate(iso: string): Date {
  const [y, m, d] = iso.split("-").map(Number);
  return new Date(Date.UTC(y, m - 1, d));
}

export function addDays(iso: string, n: number): string {
  const d = toUTCDate(iso);
  d.setUTCDate(d.getUTCDate() + n);
  return isoFromUTC(d.getUTCFullYear(), d.getUTCMonth() + 1, d.getUTCDate());
}

export function diffDays(a: string, b: string): number {
  return Math.round((toUTCDate(b).getTime() - toUTCDate(a).getTime()) / 86400000);
}

export function compareISO(a: string, b: string): number {
  return a < b ? -1 : a > b ? 1 : 0;
}

export function eachDate(start: string, end: string): string[] {
  const out: string[] = [];
  for (let d = start; compareISO(d, end) <= 0; d = addDays(d, 1)) out.push(d);
  return out;
}

export function fmtDay(iso: string): string {
  const [, m, d] = iso.split("-").map(Number);
  return `${MONTH_NAMES[m - 1]} ${d}`;
}

const FULL_MONTH_NAMES = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];

export function fmtDate(iso: string): string {
  const [y, m, d] = iso.split("-").map(Number);
  return `${FULL_MONTH_NAMES[m - 1]} ${d}, ${y}`;
}

export function fmtMonthYear(iso: string): string {
  const [y, m] = iso.split("-").map(Number);
  return `${MONTH_NAMES[m - 1]} ${y}`;
}

// ---------------------------------------------------------------------------
// Daily / station totals + granularity + period aggregation
// ---------------------------------------------------------------------------
export function dailyTotals(table: UsageTable): Record<string, number> {
  const out: Record<string, number> = {};
  for (const date of table.dates) {
    out[date] = Object.values(table.values[date]).reduce((a, b) => a + b, 0);
  }
  return out;
}

/** Per-station totals within [start, end] inclusive, litres (or the table's current unit). */
export function stationTotals(table: UsageTable, start: string, end: string): Array<[string, number]> {
  const totals = new Map<string, number>();
  for (const station of table.stations) totals.set(station, 0);
  for (const date of table.dates) {
    if (compareISO(date, start) < 0 || compareISO(date, end) > 0) continue;
    for (const [station, value] of Object.entries(table.values[date])) {
      totals.set(station, (totals.get(station) ?? 0) + value);
    }
  }
  return table.stations.map((s) => [s, totals.get(s) ?? 0]);
}

export type TableTotals = {
  /** One entry per station, in table order — rangeTotal sums only [start,
   *  end]; fullTotal sums every date in the table, so a differing full-file
   *  total (e.g. pre-event days) can be shown alongside it. */
  rowTotals: Array<{ station: string; rangeTotal: number; fullTotal: number }>;
  /** Per-date total across all stations, for every date in the table —
   *  callers decide how to treat out-of-range dates (e.g. a dash instead
   *  of a number in a totals row), this just reports the arithmetic. */
  columnTotals: Record<string, number>;
  grandTotalInRange: number;
  grandTotalFullFile: number;
};

/** Row/column/grand totals for a data table — the numbers behind an
 *  editable spreadsheet-style view. Range totals exclude dates outside
 *  [start, end]; full-file totals never do. */
export function computeTableTotals(table: UsageTable, start: string, end: string): TableTotals {
  const rangeTotals = stationTotals(table, start, end);
  const fullRange = table.dates.length ? [table.dates[0], table.dates[table.dates.length - 1]] : [start, end];
  const fullTotals = new Map(stationTotals(table, fullRange[0], fullRange[1]));

  const rowTotals = rangeTotals.map(([station, rangeTotal]) => ({
    station,
    rangeTotal,
    fullTotal: fullTotals.get(station) ?? rangeTotal,
  }));

  const columnTotals = dailyTotals(table);
  const grandTotalInRange = rowTotals.reduce((a, r) => a + r.rangeTotal, 0);
  const grandTotalFullFile = rowTotals.reduce((a, r) => a + r.fullTotal, 0);

  return { rowTotals, columnTotals, grandTotalInRange, grandTotalFullFile };
}

export type Granularity = "day" | "week" | "month";

export function determineGranularity(start: string, end: string, override?: Granularity | null): Granularity {
  if (override) return override;
  const days = diffDays(start, end) + 1;
  if (days <= 14) return "day";
  if (days <= 70) return "week";
  return "month";
}

export type Period = { label: string; value: number };

/** Returns periods covering [start, end], aggregated at the given granularity. */
export function aggregatePeriods(
  daily: Record<string, number>,
  start: string,
  end: string,
  granularity: Granularity
): Period[] {
  const allDays = eachDate(start, end);

  if (granularity === "day") {
    return allDays.map((d) => ({ label: fmtDay(d), value: daily[d] ?? 0 }));
  }

  if (granularity === "week") {
    const periods: Period[] = [];
    let cur = start;
    while (compareISO(cur, end) <= 0) {
      const candidateEnd = addDays(cur, 6);
      const periodEnd = compareISO(candidateEnd, end) < 0 ? candidateEnd : end;
      const total = eachDate(cur, periodEnd).reduce((sum, d) => sum + (daily[d] ?? 0), 0);
      const label = cur === periodEnd ? fmtDay(cur) : `${fmtDay(cur)}–${fmtDay(periodEnd)}`;
      periods.push({ label, value: total });
      cur = addDays(periodEnd, 1);
    }
    return periods;
  }

  // month
  const byMonth = new Map<string, number>();
  const order: string[] = [];
  for (const d of allDays) {
    const key = d.slice(0, 7); // YYYY-MM
    if (!byMonth.has(key)) {
      byMonth.set(key, 0);
      order.push(key);
    }
    byMonth.set(key, byMonth.get(key)! + (daily[d] ?? 0));
  }
  return order.map((key) => ({ label: fmtMonthYear(`${key}-01`), value: byMonth.get(key)! }));
}

// ---------------------------------------------------------------------------
// Edits — an overlay applied over the parsed data. Never written back to
// the uploaded file: this always produces a NEW table, so the original
// stays intact for revert / "undo all" / the original-value tooltip.
// ---------------------------------------------------------------------------

/** Key for one editable cell, stable across re-renders and re-parses. Uses
 *  U+0000 as the join character -- station names routinely contain spaces
 *  ("Station 1", "Main Stage"), so a plain space would be ambiguous to
 *  split back apart; dates are always plain ISO with no such character. */
export function editKey(station: string, date: string): string {
  return `${station}\u0000${date}`;
}

export function splitEditKey(key: string): { station: string; date: string } {
  const sep = key.indexOf("\u0000");
  return { station: key.slice(0, sep), date: key.slice(sep + 1) };
}

/**
 * Applies an edits overlay (editKey -> new value) over a table, returning a
 * NEW table — the input table is never mutated. An edit may also fill in a
 * cell that was missing from the original (sparse) data.
 */
export function applyEdits(table: UsageTable, edits: Record<string, number>): UsageTable {
  const keys = Object.keys(edits);
  if (keys.length === 0) return table;

  const out: UsageTable = { dates: [...table.dates], stations: [...table.stations], values: {} };
  for (const date of out.dates) out.values[date] = { ...table.values[date] };

  for (const key of keys) {
    const { station, date } = splitEditKey(key);
    if (!out.values[date]) {
      out.values[date] = {};
      out.dates.push(date);
    }
    if (!out.stations.includes(station)) out.stations.push(station);
    out.values[date][station] = edits[key];
  }
  out.dates.sort();
  return out;
}

/**
 * Validates a typed cell edit. Only non-negative numbers are accepted;
 * everything else is rejected with a reason to show inline — never
 * silently coerced, and the caller must leave the previous value in place
 * on rejection rather than committing anything.
 */
export function parseEditValue(text: string): { ok: true; value: number } | { ok: false; error: string } {
  const cleaned = text.trim().replace(/,/g, "");
  if (cleaned === "") return { ok: false, error: "Enter a number." };
  const value = Number(cleaned);
  if (!Number.isFinite(value)) return { ok: false, error: "Enter a valid number." };
  if (value < 0) return { ok: false, error: "Must be zero or greater." };
  return { ok: true, value };
}

// ---------------------------------------------------------------------------
// Corrected-workbook export — the inverse of loadConsolidated: table -> AOA,
// same shape as the input (Station column, one column per date).
// ---------------------------------------------------------------------------

/** Builds the AOA for a corrected-workbook export. Pure — the browser-only
 *  part (actually writing the .xlsx) is exportCorrectedWorkbook, below. */
export function buildCorrectedAOA(table: UsageTable, unitsNoteText?: string | null): unknown[][] {
  const header = ["Station", ...table.dates.map((d) => fmtDate(d))];
  const rows = table.stations.map((station) => [
    station,
    ...table.dates.map((d) => table.values[d]?.[station] ?? 0),
  ]);
  const aoa: unknown[][] = [header, ...rows];
  if (unitsNoteText) {
    aoa.push([]);
    aoa.push([unitsNoteText]);
  }
  return aoa;
}

// ---------------------------------------------------------------------------
// Browser file reading — the one part of this module that isn't pure. Kept
// last so everything above can be unit-tested without a real workbook file.
// ---------------------------------------------------------------------------
export type LoadedSheet = { sheet: SheetData; allText: string[] };

export async function readUsageFile(file: File): Promise<LoadedSheet> {
  const isCsv = /\.csv$/i.test(file.name);
  const workbook = isCsv
    ? XLSX.read(await file.text(), { type: "string", raw: true })
    : XLSX.read(await file.arrayBuffer(), { type: "array", cellDates: true, raw: true });

  const allText: string[] = [];
  for (const wsName of workbook.SheetNames) {
    const ws = workbook.Sheets[wsName];
    const rows = XLSX.utils.sheet_to_json<unknown[]>(ws, { header: 1, raw: true, defval: null });
    for (const row of rows) {
      for (const cell of row) {
        if (typeof cell === "string") allText.push(cell);
      }
    }
  }

  const firstSheet = workbook.Sheets[workbook.SheetNames[0]];
  const aoa = XLSX.utils.sheet_to_json<unknown[]>(firstSheet, { header: 1, raw: true, defval: null });
  const [header, ...rows] = aoa;
  return { sheet: { header: header ?? [], rows }, allText };
}
