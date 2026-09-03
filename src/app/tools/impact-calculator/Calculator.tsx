"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import {
  type Country,
  calculateImpact,
  litresToBottles,
  litresToCo2Kg,
  litresToDisplayVolume,
} from "@/lib/impact/formulas";
import {
  type Unit,
  type UsageTable,
  type DetectedFormat,
  type Granularity,
  readUsageFile,
  loadSheet,
  sniffUnitsNote,
  convertTableToLitres,
  combineTables,
  dailyTotals,
  stationTotals,
  determineGranularity,
  aggregatePeriods,
  eachDate,
  compareISO,
  fmtDate,
  fmtDay,
} from "@/lib/impact/parse";
import {
  fmtExact,
  sumExact,
  buildProvenanceText,
  buildPeriodSummary,
  buildStationSummary,
  buildCo2Summary,
  type FileProvenance,
} from "@/lib/impact/format";
import { renderChart, type ChartColors, type ChartItem } from "@/lib/impact/charts";

const COUNTRY_STORAGE_KEY = "oland:impact-calculator:country";

type LoadedFile = {
  id: string;
  name: string;
  format: DetectedFormat;
  table: UsageTable; // raw, in the file's own units — not yet converted
  detectedUnit: Unit | null;
  selectedUnit: Unit | null; // null = not yet confirmed; excluded from totals until it is
  error?: string;
};

// Shown whenever no real file has a confirmed unit yet, so the page never
// ships as an empty shell. Clearly labelled as sample data throughout.
const SAMPLE_TABLE: UsageTable = {
  dates: ["2026-07-10", "2026-07-11", "2026-07-12", "2026-07-13", "2026-07-14", "2026-07-15", "2026-07-16"],
  stations: ["Main Stage", "North Gate", "Food Court"],
  values: {
    "2026-07-10": { "Main Stage": 210.5, "North Gate": 120.2, "Food Court": 95.0 },
    "2026-07-11": { "Main Stage": 340.1, "North Gate": 180.6, "Food Court": 140.3 },
    "2026-07-12": { "Main Stage": 610.4, "North Gate": 290.8, "Food Court": 220.1 },
    "2026-07-13": { "Main Stage": 780.9, "North Gate": 350.2, "Food Court": 280.4 },
    "2026-07-14": { "Main Stage": 705.2, "North Gate": 330.6, "Food Court": 260.9 },
    "2026-07-15": { "Main Stage": 520.6, "North Gate": 250.1, "Food Court": 190.7 },
    "2026-07-16": { "Main Stage": 300.3, "North Gate": 160.4, "Food Court": 130.2 },
  },
};
const SAMPLE_FILE_LABEL = "Sample data — Demo Music Festival (not a real event)";

function capitalize(s: string): string {
  return s.length ? s.charAt(0).toUpperCase() + s.slice(1) : s;
}

function readChartColors(): ChartColors {
  const fallback: ChartColors = {
    bar: "#0099cc",
    surface: "#fcfcfd",
    grid: "#f2f2f1",
    areaFill: "rgba(0,153,204,0.10)",
    textPrimary: "#1a1a1a",
    textSecondary: "#4a4a4a",
  };
  if (typeof window === "undefined") return fallback;
  const style = getComputedStyle(document.documentElement);
  const get = (name: string, fb: string) => style.getPropertyValue(name).trim() || fb;
  return {
    bar: get("--color-blue", fallback.bar),
    surface: get("--color-nearwhite", fallback.surface),
    grid: get("--color-offwhite", fallback.grid),
    areaFill: get("--color-chart-area-fill", fallback.areaFill),
    textPrimary: fallback.textPrimary,
    textSecondary: fallback.textSecondary,
  };
}

export default function Calculator() {
  const [files, setFiles] = useState<LoadedFile[]>([]);
  const [country, setCountry] = useState<Country>("CA");
  const [dateRange, setDateRange] = useState<{ start: string; end: string } | null>(null);
  const [granularityOverride, setGranularityOverride] = useState<Granularity | null>(null);
  const [dragActive, setDragActive] = useState(false);
  const [chartStatus, setChartStatus] = useState<Record<string, string>>({});
  const [textStatus, setTextStatus] = useState<Record<string, string>>({});

  const bottlesCanvasRef = useRef<HTMLCanvasElement>(null);
  const stationCanvasRef = useRef<HTMLCanvasElement>(null);
  const co2CanvasRef = useRef<HTMLCanvasElement>(null);

  // Country preference is the ONE thing this tool remembers across visits —
  // nothing else (no file data, no date range) touches localStorage.
  useEffect(() => {
    try {
      const saved = localStorage.getItem(COUNTRY_STORAGE_KEY);
      if (saved === "US" || saved === "CA") setCountry(saved);
    } catch {
      // localStorage may be unavailable (private mode, etc.) — fine, just don't persist.
    }
  }, []);
  useEffect(() => {
    try {
      localStorage.setItem(COUNTRY_STORAGE_KEY, country);
    } catch {
      // ignore
    }
  }, [country]);

  const resolvedFiles = files.filter((f) => !f.error && f.selectedUnit !== null);
  const pendingFiles = files.filter((f) => !f.error && f.selectedUnit === null);
  const erroredFiles = files.filter((f) => f.error);
  const usingSample = resolvedFiles.length === 0;
  const resolvedFilesKey = resolvedFiles.map((f) => `${f.id}:${f.selectedUnit}`).join("|");

  const combinedTable: UsageTable = useMemo(() => {
    if (usingSample) return SAMPLE_TABLE;
    return combineTables(resolvedFiles.map((f) => convertTableToLitres(f.table, f.selectedUnit!)));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [usingSample, resolvedFilesKey]);

  const dataMin = combinedTable.dates[0] ?? null;
  const dataMax = combinedTable.dates[combinedTable.dates.length - 1] ?? null;
  const daily = useMemo(() => dailyTotals(combinedTable), [combinedTable]);

  // No silent "use the whole range" default for real data — selecting the
  // full span has to be a deliberate act, since workbooks routinely include
  // pre-event setup days that would otherwise inflate every figure. The
  // bundled sample is demo data, not ops data, so it gets a sensible
  // default range so the page never renders as an empty shell.
  useEffect(() => {
    if (usingSample) {
      setDateRange({ start: SAMPLE_TABLE.dates[0], end: SAMPLE_TABLE.dates[SAMPLE_TABLE.dates.length - 1] });
    } else {
      setDateRange(null);
    }
    setGranularityOverride(null);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [usingSample, resolvedFilesKey]);

  const allDaysInData = dataMin && dataMax ? eachDate(dataMin, dataMax) : [];
  const rangeDays = dateRange ? eachDate(dateRange.start, dateRange.end) : [];
  const rangeTotalLitres = sumExact(rangeDays.map((d) => daily[d] ?? 0));
  const impact = calculateImpact(rangeTotalLitres, country);

  const granularity = dateRange ? determineGranularity(dateRange.start, dateRange.end, granularityOverride) : null;
  const periodsLitres = dateRange && granularity ? aggregatePeriods(daily, dateRange.start, dateRange.end, granularity) : [];
  const bottlePeriods: ChartItem[] = periodsLitres.map((p) => ({ label: p.label, value: litresToBottles(p.value, country) }));

  const stationRawLitres = dateRange ? stationTotals(combinedTable, dateRange.start, dateRange.end) : [];
  const stationSortedLitres = [...stationRawLitres].sort((a, b) => b[1] - a[1]);
  const stationItems: ChartItem[] = stationSortedLitres.map(([name, litres]) => ({
    label: name,
    value: litresToDisplayVolume(litres, country),
  }));
  const showStationChart = stationRawLitres.length > 1;

  let co2Running = 0;
  const co2Cumulative: ChartItem[] = periodsLitres.map((p) => {
    co2Running += litresToCo2Kg(p.value);
    return { label: p.label, value: co2Running };
  });

  // --- Render the three charts onto <canvas> whenever their inputs change ---
  useEffect(() => {
    if (!dateRange || !granularity) return;
    const colors = readChartColors();

    if (bottlesCanvasRef.current) {
      renderChart(bottlesCanvasRef.current, "bar", bottlePeriods, {
        yAxisLabel: `${capitalize(impact.bottleUnitLabel)} Avoided`,
        xAxisLabel: capitalize(granularity),
        colors,
      });
    }
    if (stationCanvasRef.current && showStationChart) {
      renderChart(stationCanvasRef.current, "bar", stationItems, {
        yAxisLabel: `${capitalize(impact.volumeUnitLabel)} Dispensed`,
        xAxisLabel: "Station",
        colors,
      });
    }
    if (co2CanvasRef.current) {
      renderChart(co2CanvasRef.current, "line", co2Cumulative, {
        yAxisLabel: "CO2 Avoided (kg)",
        xAxisLabel: capitalize(granularity),
        colors,
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dateRange?.start, dateRange?.end, granularity, country, showStationChart, resolvedFilesKey, usingSample]);

  // --- File loading ---
  async function handleFiles(fileList: FileList | File[]) {
    const incoming = Array.from(fileList).filter((f) => /\.(xlsx|xlsm|csv)$/i.test(f.name));
    for (const file of incoming) {
      const id = `${file.name}-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
      try {
        const { sheet, allText } = await readUsageFile(file);
        const { format, table } = loadSheet(sheet);
        const detectedUnit = sniffUnitsNote(allText);
        setFiles((prev) => [...prev, { id, name: file.name, format, table, detectedUnit, selectedUnit: detectedUnit }]);
      } catch (err) {
        setFiles((prev) => [
          ...prev,
          {
            id,
            name: file.name,
            format: "consolidated",
            table: { dates: [], stations: [], values: {} },
            detectedUnit: null,
            selectedUnit: null,
            error: err instanceof Error ? err.message : "Could not read this file.",
          },
        ]);
      }
    }
  }

  function onInputChange(e: React.ChangeEvent<HTMLInputElement>) {
    if (e.target.files?.length) void handleFiles(e.target.files);
    e.target.value = "";
  }
  function onDrop(e: React.DragEvent<HTMLDivElement>) {
    e.preventDefault();
    setDragActive(false);
    if (e.dataTransfer.files?.length) void handleFiles(e.dataTransfer.files);
  }
  function setFileUnit(id: string, unit: Unit) {
    setFiles((prev) => prev.map((f) => (f.id === id ? { ...f, selectedUnit: unit } : f)));
  }
  function removeFile(id: string) {
    setFiles((prev) => prev.filter((f) => f.id !== id));
  }

  function updateStart(newStart: string) {
    setDateRange((prev) => {
      const end = prev && compareISO(prev.end, newStart) >= 0 ? prev.end : newStart;
      return { start: newStart, end };
    });
  }
  function updateEnd(newEnd: string) {
    setDateRange((prev) => {
      const start = prev && compareISO(prev.start, newEnd) <= 0 ? prev.start : newEnd;
      return { start, end: newEnd };
    });
  }

  // --- Copy / download ---
  const clipboardSupported =
    typeof window !== "undefined" && !!navigator.clipboard?.write && typeof window.ClipboardItem !== "undefined";

  function flash(setter: typeof setChartStatus, key: string, message: string) {
    setter((prev) => ({ ...prev, [key]: message }));
    setTimeout(() => setter((prev) => ({ ...prev, [key]: "" })), 2500);
  }

  async function copyChart(key: string, canvas: HTMLCanvasElement | null) {
    if (!canvas) return;
    const blob = await new Promise<Blob | null>((resolve) => canvas.toBlob(resolve, "image/png"));
    if (!blob) return;
    try {
      await navigator.clipboard.write([new ClipboardItem({ "image/png": blob })]);
      flash(setChartStatus, key, "Copied to clipboard.");
    } catch {
      flash(setChartStatus, key, "Could not copy — try Download PNG instead.");
    }
  }

  function downloadChart(canvas: HTMLCanvasElement | null, filename: string) {
    if (!canvas) return;
    canvas.toBlob((blob) => {
      if (!blob) return;
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      a.remove();
      URL.revokeObjectURL(url);
    }, "image/png");
  }

  async function copyText(key: string, text: string) {
    try {
      await navigator.clipboard.writeText(text);
      flash(setTextStatus, key, "Copied.");
    } catch {
      flash(setTextStatus, key, "Could not copy — select the text manually.");
    }
  }

  // --- Provenance + summaries ---
  const provenanceFiles: FileProvenance[] = usingSample
    ? [{ name: SAMPLE_FILE_LABEL, unit: "litres" }]
    : resolvedFiles.map((f) => ({ name: f.name, unit: f.selectedUnit! }));

  const provenanceText = dateRange
    ? buildProvenanceText({ files: provenanceFiles, country, start: dateRange.start, end: dateRange.end })
    : "";
  const bottlesSummary = dateRange ? buildPeriodSummary(bottlePeriods, impact.bottleUnitLabel) : "";
  const stationSummary = dateRange && showStationChart ? buildStationSummary(stationItems, impact.volumeUnitLabel) : "";
  const co2Summary = dateRange ? buildCo2Summary(co2Cumulative) : "";

  return (
    <div className="mx-auto max-w-5xl px-6 py-10">
      <header>
        <p className="eyebrow text-coral">Internal tool</p>
        <h1 className="mt-2 text-3xl font-extrabold text-ink">Impact Calculator</h1>
        <p className="mt-2 max-w-2xl text-ink/70">
          Calculates the standard O&apos;land impact-report figures and charts from event usage data,
          entirely in your browser. Nothing here is uploaded — the file never leaves this machine.
        </p>
      </header>

      {/* --- File loading --- */}
      <section className="mt-10">
        <h2 className="text-lg font-bold text-ink">1. Load usage files</h2>
        <div
          onDragOver={(e) => {
            e.preventDefault();
            setDragActive(true);
          }}
          onDragLeave={() => setDragActive(false)}
          onDrop={onDrop}
          className={`mt-3 rounded-xl border-2 border-dashed p-8 text-center transition-colors ${
            dragActive ? "border-blue bg-blue/5" : "border-ink/20 bg-offwhite"
          }`}
        >
          <p className="text-sm text-ink/70">Drop .xlsx, .xlsm, or .csv usage files here, or</p>
          <label className="mt-3 inline-block cursor-pointer rounded-md bg-blue px-4 py-2 text-sm font-bold text-white hover:bg-blue/90">
            Choose files
            <input type="file" multiple accept=".xlsx,.xlsm,.csv" onChange={onInputChange} className="hidden" />
          </label>
        </div>

        {files.length > 0 && (
          <ul className="mt-4 divide-y divide-ink/10 rounded-md border border-ink/10">
            {files.map((f) => (
              <li key={f.id} className="p-4">
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <p className="font-semibold text-ink">{f.name}</p>
                    {f.error ? (
                      <p className="mt-1 text-sm font-semibold text-coral">{f.error}</p>
                    ) : (
                      <p className="text-sm text-ink/60">
                        Detected as <span className="font-semibold">{f.format === "range_export" ? "range export" : "consolidated"}</span>
                        {" · "}
                        {f.table.stations.length} station{f.table.stations.length === 1 ? "" : "s"}
                        {" · "}
                        {f.table.dates.length} date{f.table.dates.length === 1 ? "" : "s"}
                      </p>
                    )}
                  </div>
                  <button
                    type="button"
                    onClick={() => removeFile(f.id)}
                    className="text-sm font-semibold text-ink/50 hover:text-coral"
                  >
                    Remove
                  </button>
                </div>

                {!f.error && (
                  <div className="mt-3">
                    <span className="text-xs font-bold uppercase tracking-widest text-steel">Units in this file</span>
                    <div className="mt-1.5 flex flex-wrap items-center gap-2">
                      {(["gallons", "litres"] as const).map((u) => (
                        <button
                          key={u}
                          type="button"
                          onClick={() => setFileUnit(f.id, u)}
                          aria-pressed={f.selectedUnit === u}
                          className={`rounded-md border px-3 py-1.5 text-sm font-semibold capitalize transition-colors ${
                            f.selectedUnit === u ? "border-blue bg-blue text-white" : "border-ink/20 text-ink hover:bg-ink/5"
                          }`}
                        >
                          {u}
                          {f.detectedUnit === u && (
                            <span className="ml-1.5 text-xs font-normal opacity-80">(detected in this file)</span>
                          )}
                        </button>
                      ))}
                    </div>
                    {f.selectedUnit && f.detectedUnit && f.selectedUnit !== f.detectedUnit && (
                      <p className="mt-1.5 text-xs font-semibold text-coral">
                        You&apos;re overriding this file&apos;s own units note — it suggests {f.detectedUnit}.
                      </p>
                    )}
                    {!f.selectedUnit && (
                      <p className="mt-1.5 text-xs text-ink/60">
                        {f.detectedUnit
                          ? "Confirm the units before this file counts toward the totals."
                          : "No units note found in this file — pick gallons or litres before it counts toward the totals."}
                      </p>
                    )}
                  </div>
                )}
              </li>
            ))}
          </ul>
        )}

        {usingSample && (
          <p className="mt-3 text-sm text-steel">
            {files.length === 0
              ? "Showing sample data below. Drop a usage file above to calculate your event's real numbers."
              : `${pendingFiles.length} file${pendingFiles.length === 1 ? "" : "s"} loaded — confirm units above to include ${
                  pendingFiles.length === 1 ? "it" : "them"
                } and replace the sample data.`}
          </p>
        )}
        {erroredFiles.length > 0 && (
          <p className="mt-2 text-sm font-semibold text-coral">
            {erroredFiles.length} file{erroredFiles.length === 1 ? "" : "s"} could not be read — see above.
          </p>
        )}
      </section>

      {/* --- Client country --- */}
      <section className="mt-10">
        <h2 className="text-lg font-bold text-ink">2. Client country</h2>
        <div className="mt-3 flex flex-wrap gap-2">
          {(["CA", "US"] as const).map((c) => (
            <button
              key={c}
              type="button"
              onClick={() => setCountry(c)}
              aria-pressed={country === c}
              className={`rounded-md border px-4 py-2 text-sm font-semibold transition-colors ${
                country === c ? "border-blue bg-blue text-white" : "border-ink/20 text-ink hover:bg-ink/5"
              }`}
            >
              {c === "CA" ? "Canada" : "United States"}
            </button>
          ))}
        </div>
        <p className="mt-2 text-sm text-ink/60">
          {country === "CA"
            ? "Figures shown in litres and 500 mL bottles."
            : "Figures shown in gallons and 20 oz bottles."}
        </p>
      </section>

      {/* --- Date range --- */}
      <section className="mt-10">
        <h2 className="text-lg font-bold text-ink">3. Date range</h2>
        {!dataMin || !dataMax ? (
          <p className="mt-3 text-sm text-ink/60">Load a file to select a date range.</p>
        ) : (
          <>
            {!usingSample && !dateRange && (
              <div className="mt-3 rounded-md border-2 border-dashed border-coral/40 bg-coral/5 p-4 text-sm text-ink">
                <p className="font-semibold">Select a date range before any figures are calculated.</p>
                <p className="mt-1 text-ink/70">
                  Data spans {fmtDate(dataMin)} to {fmtDate(dataMax)}. Workbooks often include pre-event
                  setup days — pick the range deliberately below, or use &quot;full range&quot; if you
                  really do want the entire span.
                </p>
              </div>
            )}

            <div className="mt-3 flex flex-wrap items-center gap-4">
              <label className="flex items-center gap-2 text-sm">
                <span className="font-bold uppercase tracking-widest text-steel">Start</span>
                <input
                  type="date"
                  min={dataMin}
                  max={dataMax}
                  value={dateRange?.start ?? ""}
                  onChange={(e) => e.target.value && updateStart(e.target.value)}
                  className="rounded-md border border-ink/20 px-2 py-1.5"
                />
              </label>
              <label className="flex items-center gap-2 text-sm">
                <span className="font-bold uppercase tracking-widest text-steel">End</span>
                <input
                  type="date"
                  min={dataMin}
                  max={dataMax}
                  value={dateRange?.end ?? ""}
                  onChange={(e) => e.target.value && updateEnd(e.target.value)}
                  className="rounded-md border border-ink/20 px-2 py-1.5"
                />
              </label>
              <button
                type="button"
                onClick={() => setDateRange({ start: dataMin, end: dataMax })}
                className="rounded-md border border-ink/20 px-3 py-1.5 text-sm font-semibold text-ink hover:bg-ink/5"
              >
                Use full range
              </button>
            </div>

            <div className="mt-4 flex flex-wrap gap-1" aria-hidden="true">
              {allDaysInData.map((d) => {
                const inRange = !!dateRange && compareISO(d, dateRange.start) >= 0 && compareISO(d, dateRange.end) <= 0;
                return (
                  <span
                    key={d}
                    title={fmtDate(d)}
                    className={`rounded px-1.5 py-1 text-xs font-semibold ${
                      inRange ? "bg-blue text-white" : "bg-offwhite text-ink/35"
                    }`}
                  >
                    {fmtDay(d)}
                  </span>
                );
              })}
            </div>

            {dateRange && (
              <p className="mt-3 text-sm text-ink/70" aria-live="polite">
                Running total for the selected range:{" "}
                <span className="font-bold text-ink">
                  {fmtExact(litresToDisplayVolume(rangeTotalLitres, country))} {impact.volumeUnitLabel}
                </span>{" "}
                across {rangeDays.length} day{rangeDays.length === 1 ? "" : "s"}.
              </p>
            )}

            {dateRange && granularity && (
              <div className="mt-3 flex flex-wrap items-center gap-2 text-sm">
                <span className="font-bold uppercase tracking-widest text-steel">Granularity</span>
                {(["auto", "day", "week", "month"] as const).map((g) => {
                  const active = g === "auto" ? granularityOverride === null : granularityOverride === g;
                  return (
                    <button
                      key={g}
                      type="button"
                      onClick={() => setGranularityOverride(g === "auto" ? null : g)}
                      aria-pressed={active}
                      className={`rounded-md px-2.5 py-1 font-semibold capitalize ${
                        active ? "bg-blue text-white" : "text-ink/70 hover:bg-ink/5"
                      }`}
                    >
                      {g}
                    </button>
                  );
                })}
                <span className="text-ink/50">
                  ({granularity}
                  {granularityOverride ? " — manual" : " — auto-selected from range length"})
                </span>
              </div>
            )}
          </>
        )}
      </section>

      {/* --- Headline metrics --- */}
      <section className="mt-10">
        <h2 className="text-lg font-bold text-ink">4. Headline figures</h2>
        {!dateRange ? (
          <p className="mt-3 text-sm text-ink/60">Select a date range above to calculate figures.</p>
        ) : (
          <div className="mt-3 grid grid-cols-2 gap-4 sm:grid-cols-4">
            <MetricTile
              label={`Total ${impact.volumeUnitLabel}`}
              value={fmtExact(impact.totalVolume)}
              unit={capitalize(impact.volumeUnitLabel)}
            />
            <MetricTile
              label="Bottles avoided"
              value={fmtExact(impact.bottlesAvoided)}
              unit={capitalize(impact.bottleUnitLabel)}
            />
            <MetricTile label="CO2 avoided" value={fmtExact(impact.co2AvoidedKg)} unit="kg" />
            <MetricTile
              label="Bags avoided"
              value={fmtExact(impact.bagsAvoided)}
              unit={capitalize(impact.bagUnitLabel)}
            />
          </div>
        )}
      </section>

      {/* --- Charts --- */}
      <section className="mt-10 space-y-6">
        <h2 className="text-lg font-bold text-ink">5. Charts</h2>
        {!dateRange ? (
          <p className="text-sm text-ink/60">Select a date range above to render charts.</p>
        ) : (
          <>
            <ChartCard
              title={`${capitalize(impact.bottleUnitLabel)} avoided by ${granularity}`}
              canvasRef={bottlesCanvasRef}
              onCopy={() => copyChart("bottles", bottlesCanvasRef.current)}
              onDownload={() => downloadChart(bottlesCanvasRef.current, `impact_by_${granularity}.png`)}
              clipboardSupported={clipboardSupported}
              status={chartStatus.bottles}
              summary={bottlesSummary}
              summaryStatus={textStatus.bottles}
              onCopySummary={() => copyText("bottles", bottlesSummary)}
            />

            {showStationChart ? (
              <ChartCard
                title={`${capitalize(impact.volumeUnitLabel)} dispensed by station`}
                canvasRef={stationCanvasRef}
                onCopy={() => copyChart("station", stationCanvasRef.current)}
                onDownload={() => downloadChart(stationCanvasRef.current, "impact_by_station.png")}
                clipboardSupported={clipboardSupported}
                status={chartStatus.station}
                summary={stationSummary}
                summaryStatus={textStatus.station}
                onCopySummary={() => copyText("station", stationSummary)}
              />
            ) : (
              <div className="rounded-xl border border-ink/10 bg-white p-5">
                <h3 className="text-lg font-bold text-ink">Volume dispensed by station</h3>
                <p className="mt-2 text-sm text-ink/60">Only one station in the selected range — skipping this chart.</p>
              </div>
            )}

            <ChartCard
              title="Cumulative CO2 avoided (kg)"
              canvasRef={co2CanvasRef}
              onCopy={() => copyChart("co2", co2CanvasRef.current)}
              onDownload={() => downloadChart(co2CanvasRef.current, `impact_cumulative_co2_${granularity}.png`)}
              clipboardSupported={clipboardSupported}
              status={chartStatus.co2}
              summary={co2Summary}
              summaryStatus={textStatus.co2}
              onCopySummary={() => copyText("co2", co2Summary)}
            />
          </>
        )}
      </section>

      {/* --- Provenance --- */}
      <section className="mt-10 mb-16">
        <h2 className="text-lg font-bold text-ink">6. Provenance</h2>
        <p className="mt-1 text-sm text-ink/60">
          Paste this into the report so a figure can be traced back to its source months later.
        </p>
        {!dateRange ? (
          <p className="mt-3 text-sm text-ink/60">Select a date range above to generate this block.</p>
        ) : (
          <div className="mt-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-widest text-steel">How this run read the data</span>
              <button type="button" onClick={() => copyText("provenance", provenanceText)} className="text-xs font-semibold text-blue hover:underline">
                Copy text
              </button>
            </div>
            <textarea
              readOnly
              value={provenanceText}
              rows={provenanceFiles.length + 4}
              className="mt-1 w-full resize-none rounded-md border border-ink/10 bg-offwhite p-3 font-mono text-sm text-ink"
            />
            {textStatus.provenance && <p className="mt-1 text-xs font-semibold text-teal">{textStatus.provenance}</p>}
          </div>
        )}
      </section>
    </div>
  );
}

function MetricTile({ label, value, unit }: { label: string; value: string; unit: string }) {
  return (
    <div className="rounded-xl border border-ink/10 bg-white p-5">
      <div className="text-xs font-bold uppercase tracking-widest text-steel">{label}</div>
      <div className="mt-2 text-3xl font-extrabold text-ink">{value}</div>
      <div className="text-sm text-ink/60">{unit}</div>
    </div>
  );
}

function ChartCard({
  title,
  canvasRef,
  onCopy,
  onDownload,
  clipboardSupported,
  status,
  summary,
  onCopySummary,
  summaryStatus,
}: {
  title: string;
  canvasRef: React.RefObject<HTMLCanvasElement | null>;
  onCopy: () => void;
  onDownload: () => void;
  clipboardSupported: boolean;
  status?: string;
  summary: string;
  onCopySummary: () => void;
  summaryStatus?: string;
}) {
  return (
    <div className="rounded-xl border border-ink/10 bg-white p-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h3 className="text-lg font-bold text-ink">{title}</h3>
        <div className="flex gap-2">
          {clipboardSupported && (
            <button
              type="button"
              onClick={onCopy}
              className="rounded-md bg-blue px-3 py-1.5 text-sm font-semibold text-white hover:bg-blue/90"
            >
              Copy to Clipboard
            </button>
          )}
          <button
            type="button"
            onClick={onDownload}
            className="rounded-md border border-ink/20 px-3 py-1.5 text-sm font-semibold text-ink hover:bg-ink/5"
          >
            Download PNG
          </button>
        </div>
      </div>
      {status && <p className="mt-1 text-xs font-semibold text-teal">{status}</p>}

      <div className="mt-4 overflow-x-auto">
        <canvas ref={canvasRef} />
      </div>

      <div className="mt-4">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold uppercase tracking-widest text-steel">Summary</span>
          <button type="button" onClick={onCopySummary} className="text-xs font-semibold text-blue hover:underline">
            Copy text
          </button>
        </div>
        <textarea
          readOnly
          value={summary}
          rows={3}
          className="mt-1 w-full resize-none rounded-md border border-ink/10 bg-offwhite p-3 text-sm text-ink"
        />
        {summaryStatus && <p className="mt-1 text-xs font-semibold text-teal">{summaryStatus}</p>}
      </div>
    </div>
  );
}
