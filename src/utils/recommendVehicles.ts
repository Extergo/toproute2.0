// src/utils/recommendVehicles.ts
import { cars, Car } from "../data/cars";

export interface RecommendationInput {
  house: { lat: number; lng: number };
  workplace: { lat: number; lng: number };
  holiday: { lat: number; lng: number };
  minSeats: number;
  habits: {
    hasKids: boolean;
    trunkPreference: boolean;
  };
}

export interface RecommendationResult {
  primary: Car;
  runnerUp: Car;
  summary: string;
  priceBreakdown: {
    primary: number;
    runnerUp: number;
  };
  carbonRating: number; // 1 (high combustion) to 5 (low/no combustion)
}

export const recommendVehicles = (
  input: RecommendationInput
): RecommendationResult => {
  if (!input.house || !input.workplace || !input.holiday) {
    throw new Error("Not enough location data to provide a recommendation.");
  }

  const toRad = (x: number): number => (x * Math.PI) / 180;
  const computeDistance = (
    p1: { lat: number; lng: number },
    p2: { lat: number; lng: number }
  ): number => {
    const R = 6371; // Earth's radius in km
    const dLat = toRad(p2.lat - p1.lat);
    const dLng = toRad(p2.lng - p1.lng);
    const lat1 = toRad(p1.lat);
    const lat2 = toRad(p2.lat);
    const a =
      Math.sin(dLat / 2) ** 2 +
      Math.sin(dLng / 2) ** 2 * Math.cos(lat1) * Math.cos(lat2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  };

  const commuteDistance = computeDistance(input.house, input.workplace);
  const holidayDistance = computeDistance(input.house, input.holiday);
  const totalDistance = commuteDistance + holidayDistance;

  const suitableCars = cars.filter(
    (car) => car.seats >= input.minSeats && car.range >= totalDistance
  );

  if (suitableCars.length === 0) {
    throw new Error(
      "Not enough data to provide a reliable suggestion based on your region or requirements."
    );
  }

  suitableCars.sort((a, b) => b.range - a.range);

  const primary = suitableCars[0];
  const runnerUp = suitableCars[1] || suitableCars[0];

  const costFactor = 0.2;
  const primaryCost = totalDistance * costFactor;
  const runnerUpCost = totalDistance * costFactor * 1.1;

  let carbonRating = 1;
  if (primary.type === "electric") {
    carbonRating = 5;
  } else if (primary.type === "hybrid") {
    carbonRating = 3;
  } else if (primary.type === "suv") {
    carbonRating = 1;
  }

  const summary = `Based on your input, your daily commute is approximately ${commuteDistance.toFixed(
    2
  )} km, and your holiday trip is around ${holidayDistance.toFixed(
    2
  )} km—totaling ${totalDistance.toFixed(2)} km. We recommend the ${
    primary.name
  } as your primary option because it offers a range of ${
    primary.range
  } km and meets your seating requirement of ${
    input.minSeats
  } seats. Its design is well-suited for both daily commutes and longer trips. As a runner-up, we suggest the ${
    runnerUp.name
  }. Considering your preferences for ${
    input.habits.hasKids ? "family-friendly features" : "a compact design"
  } and ${
    input.habits.trunkPreference ? "ample trunk space" : "a sportier look"
  }, this recommendation is tailored to your needs.`;

  return {
    primary,
    runnerUp,
    summary,
    priceBreakdown: {
      primary: primaryCost,
      runnerUp: runnerUpCost,
    },
    carbonRating,
  };
};
