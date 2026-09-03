// O'land Stations impact-report formulas — ported 1:1 from
// _reference/impact_calculator.py and _reference/impact_chart.py.
//
// The scripts always work internally in litres and convert to gallons for
// US-client display only. CO2 avoided is litres x CO2_KG_PER_LITRE either
// way, so it never needs a unit switch — keep that invariant when touching
// this file. See the reference scripts' module docstrings for the full
// rationale.

export type Country = "US" | "CA";

// Canadian / metric clients
export const BOTTLES_PER_LITRE = 2; // 500 mL bottles avoided = litres x 2
export const CO2_KG_PER_LITRE = 0.16399; // CO2 avoided (kg) = litres x 0.16399
export const BOTTLES_PER_BAG_METRIC = 180; // 40 L bags avoided = bottles / 180

// US clients
export const LITRES_PER_US_GALLON = 3.78541; // 1 US gallon = 3.78541 L
export const OZ_PER_US_GALLON = 128; // 1 US gallon = 128 fl oz
export const US_BOTTLE_SIZE_OZ = 20; // US bottle size used for this formula
export const BOTTLES_PER_GALLON_US = OZ_PER_US_GALLON / US_BOTTLE_SIZE_OZ; // = 6.4
export const BOTTLES_PER_BAG_US = 150;

export function litresToBottles(totalLitres: number, country: Country): number {
  if (country === "US") {
    const gallons = totalLitres / LITRES_PER_US_GALLON;
    return gallons * BOTTLES_PER_GALLON_US;
  }
  return totalLitres * BOTTLES_PER_LITRE;
}

export function litresToCo2Kg(totalLitres: number): number {
  return totalLitres * CO2_KG_PER_LITRE; // same formula for both countries
}

export function litresToDisplayVolume(totalLitres: number, country: Country): number {
  return country === "US" ? totalLitres / LITRES_PER_US_GALLON : totalLitres;
}

export function volumeUnitLabel(country: Country): string {
  return country === "US" ? "gallons" : "litres";
}

export function bottleUnitLabel(country: Country): string {
  return country === "US" ? "20 oz bottles" : "500 mL bottles";
}

export function bagUnitLabel(country: Country): string {
  return country === "US" ? "bags" : "40 L bags";
}

export type ImpactResult = {
  country: Country;
  totalVolume: number;
  volumeUnitLabel: string;
  bottlesAvoided: number;
  bottleUnitLabel: string;
  co2AvoidedKg: number;
  bagsAvoided: number;
  bagUnitLabel: string;
};

/** country is "US" or "CA". totalLitres must already be resolved to litres. */
export function calculateImpact(totalLitres: number, country: Country): ImpactResult {
  const bottlesAvoided = litresToBottles(totalLitres, country);
  const bagsAvoided =
    country === "US" ? bottlesAvoided / BOTTLES_PER_BAG_US : bottlesAvoided / BOTTLES_PER_BAG_METRIC;

  return {
    country,
    totalVolume: litresToDisplayVolume(totalLitres, country),
    volumeUnitLabel: volumeUnitLabel(country),
    bottlesAvoided,
    bottleUnitLabel: bottleUnitLabel(country),
    co2AvoidedKg: litresToCo2Kg(totalLitres),
    bagsAvoided,
    bagUnitLabel: bagUnitLabel(country),
  };
}
