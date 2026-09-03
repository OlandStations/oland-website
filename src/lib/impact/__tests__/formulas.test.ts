import { describe, expect, it } from "vitest";
import { calculateImpact, LITRES_PER_US_GALLON } from "../formulas";
import { fmtExact } from "../format";

// Fixtures from the task spec, cross-checked against
// _reference/impact_calculator.py's calculate_impact_us / _metric.

describe("calculateImpact — Fixture A (gallons file, US client)", () => {
  const totalGallons = 1200.4 + 900.2 + 650.1 + 480.4; // 3231.1
  const totalLitres = totalGallons * LITRES_PER_US_GALLON;
  const result = calculateImpact(totalLitres, "US");

  it("round-trips total gallons exactly", () => {
    expect(fmtExact(result.totalVolume)).toBe("3,231.1");
  });

  it("bottles avoided", () => {
    expect(fmtExact(result.bottlesAvoided)).toBe("20,679.04");
  });

  it("CO2 avoided (kg)", () => {
    expect(fmtExact(result.co2AvoidedKg)).toBe("2,005.77");
  });

  it("bags avoided", () => {
    expect(fmtExact(result.bagsAvoided)).toBe("137.86");
  });
});

describe("calculateImpact — Fixture B (litres file, CA client)", () => {
  const totalLitres = 1800 + 1200 + 900; // 3900
  const result = calculateImpact(totalLitres, "CA");

  it("total litres", () => {
    expect(fmtExact(result.totalVolume)).toBe("3,900");
  });

  it("bottles avoided", () => {
    expect(fmtExact(result.bottlesAvoided)).toBe("7,800");
  });

  it("CO2 avoided (kg)", () => {
    expect(fmtExact(result.co2AvoidedKg)).toBe("639.56");
  });

  it("bags avoided", () => {
    expect(fmtExact(result.bagsAvoided)).toBe("43.33");
  });
});

describe("calculateImpact — Fixture C (the units regression)", () => {
  // Reading Fixture A's numbers (3231.1) as litres instead of gallons must
  // scale every figure by exactly 1/3.78541 relative to the correct answer.
  const misreadAsLitres = 1200.4 + 900.2 + 650.1 + 480.4; // 3231.1, NOT converted

  it("produces the regression figures when litres is (wrongly) selected", () => {
    const result = calculateImpact(misreadAsLitres, "US");
    expect(fmtExact(result.bottlesAvoided)).toBe("5,462.83");
    expect(fmtExact(result.co2AvoidedKg)).toBe("529.87");
  });

  it("only happens when litres is explicitly selected — the correct (gallons) reading differs", () => {
    const correct = calculateImpact(misreadAsLitres * LITRES_PER_US_GALLON, "US");
    const wrong = calculateImpact(misreadAsLitres, "US");
    expect(correct.bottlesAvoided).not.toBeCloseTo(wrong.bottlesAvoided, 0);
    // The two readings are off by exactly the gallon<->litre conversion factor.
    expect(correct.bottlesAvoided / wrong.bottlesAvoided).toBeCloseTo(LITRES_PER_US_GALLON, 4);
    expect(correct.co2AvoidedKg / wrong.co2AvoidedKg).toBeCloseTo(LITRES_PER_US_GALLON, 4);
  });
});
