// src/app/page.tsx
"use client";
import { useState } from "react";
import dynamic from "next/dynamic";
import {
  recommendVehicles,
  RecommendationResult,
} from "../utils/recommendVehicles";

const Map = dynamic(() => import("../components/Map"), { ssr: false });

export default function HomePage() {
  // User Preferences
  const [minSeats, setMinSeats] = useState<number>(5);
  const [hasKids, setHasKids] = useState<boolean>(false);
  const [trunkPreference, setTrunkPreference] = useState<boolean>(false);

  // Recommendation result and error state
  const [result, setResult] = useState<RecommendationResult | null>(null);
  const [error, setError] = useState<string>("");

  // Use the full locations object to avoid unused variable warnings.
  const handleLocationsSelect = (locations: {
    house: { lat: number; lng: number };
    workplace: { lat: number; lng: number };
    holiday: { lat: number; lng: number };
  }): void => {
    try {
      const recommendation = recommendVehicles({
        ...locations,
        minSeats,
        habits: { hasKids, trunkPreference },
      });
      setResult(recommendation);
      setError("");
    } catch (e: unknown) {
      if (e instanceof Error) {
        setResult(null);
        setError(e.message);
      } else {
        setError("An unknown error occurred.");
      }
    }
  };

  return (
    <main className="min-h-screen bg-gradient-to-r from-blue-100 to-green-100 flex flex-col items-center p-6">
      <div className="max-w-3xl w-full bg-white shadow-lg rounded-lg p-8">
        <h1 className="text-4xl font-bold text-center mb-8">
          Advanced Vehicle Recommender
        </h1>
        {/* User Preferences */}
        <div className="mb-6 grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-gray-700 font-medium mb-2">
              Minimum Seats Needed
            </label>
            <input
              type="number"
              min="1"
              value={minSeats}
              onChange={(e) => setMinSeats(parseInt(e.target.value, 10))}
              className="w-full border border-gray-300 p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div className="flex items-center">
            <label className="inline-flex items-center">
              <input
                type="checkbox"
                checked={hasKids}
                onChange={(e) => setHasKids(e.target.checked)}
                className="form-checkbox"
              />
              <span className="ml-2">I have kids</span>
            </label>
          </div>
          <div className="flex items-center">
            <label className="inline-flex items-center">
              <input
                type="checkbox"
                checked={trunkPreference}
                onChange={(e) => setTrunkPreference(e.target.checked)}
                className="form-checkbox"
              />
              <span className="ml-2">Need ample trunk space</span>
            </label>
          </div>
        </div>
        {/* Map & Instructions */}
        <div className="mb-6">
          <p className="text-center text-gray-600 mb-4">
            Tap or click on the map to set your locations in the following
            order:
          </p>
          <ol className="list-decimal list-inside text-gray-700 mb-4">
            <li>House</li>
            <li>Workplace / Daily Commute</li>
            <li>Holidays / Distant Places</li>
          </ol>
          <Map onLocationsSelect={handleLocationsSelect} />
        </div>
        {error && (
          <p className="text-center text-red-600 font-semibold mb-4">{error}</p>
        )}
        {result && (
          <div className="mt-8 p-6 border-t">
            <h2 className="text-2xl font-bold text-center mb-4">
              Recommendation Summary
            </h2>
            <p className="mb-4 text-gray-800">{result.summary}</p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 border rounded-lg bg-gray-50">
                <h3 className="font-semibold text-xl mb-2 text-center">
                  Primary Option
                </h3>
                <p>
                  Name:{" "}
                  <span className="font-medium">{result.primary.name}</span>
                </p>
                <p>
                  Type:{" "}
                  <span className="font-medium capitalize">
                    {result.primary.type}
                  </span>
                </p>
                <p>
                  Range:{" "}
                  <span className="font-medium">{result.primary.range} km</span>
                </p>
                <p>
                  Seating Capacity:{" "}
                  <span className="font-medium">{result.primary.seats}</span>
                </p>
                <p>
                  Price Estimate:{" "}
                  <span className="font-medium">
                    ${result.priceBreakdown.primary.toFixed(2)}
                  </span>
                </p>
              </div>
              <div className="p-4 border rounded-lg bg-gray-50">
                <h3 className="font-semibold text-xl mb-2 text-center">
                  Runner-Up Option
                </h3>
                <p>
                  Name:{" "}
                  <span className="font-medium">{result.runnerUp.name}</span>
                </p>
                <p>
                  Type:{" "}
                  <span className="font-medium capitalize">
                    {result.runnerUp.type}
                  </span>
                </p>
                <p>
                  Range:{" "}
                  <span className="font-medium">
                    {result.runnerUp.range} km
                  </span>
                </p>
                <p>
                  Seating Capacity:{" "}
                  <span className="font-medium">{result.runnerUp.seats}</span>
                </p>
                <p>
                  Price Estimate:{" "}
                  <span className="font-medium">
                    ${result.priceBreakdown.runnerUp.toFixed(2)}
                  </span>
                </p>
              </div>
            </div>
            <div className="mt-6 text-center">
              <p className="text-lg font-medium">Environmental Rating:</p>
              <p className="text-2xl">
                {"★".repeat(result.carbonRating)}
                {"☆".repeat(5 - result.carbonRating)}
              </p>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
