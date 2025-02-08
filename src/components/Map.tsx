// src/components/Map.tsx
"use client";
import React, { useState, useEffect, useRef } from "react";
import {
  GoogleMap,
  LoadScript,
  Marker,
  DirectionsRenderer,
} from "@react-google-maps/api";

interface Point {
  lat: number;
  lng: number;
}

interface MapProps {
  onLocationsSelect: (locations: {
    house: Point;
    workplace: Point;
    holiday: Point;
  }) => void;
}

const containerStyle = {
  width: "100%",
  height: "500px",
};

const center = {
  lat: 37.7749, // Default center (San Francisco)
  lng: -122.4194,
};

const Map: React.FC<MapProps> = ({ onLocationsSelect }) => {
  const [points, setPoints] = useState<Point[]>([]);
  const [directions, setDirections] =
    useState<google.maps.DirectionsResult | null>(null);
  const [evStations, setEvStations] = useState<
    google.maps.places.PlaceResult[]
  >([]);
  const mapRef = useRef<google.maps.Map | null>(null);

  const onMapLoad = (map: google.maps.Map): void => {
    mapRef.current = map;
  };

  const handleMapClick = (event: google.maps.MapMouseEvent): void => {
    if (!event.latLng) return;
    const newPoint: Point = {
      lat: event.latLng.lat(),
      lng: event.latLng.lng(),
    };
    if (points.length < 3) {
      const newPoints = [...points, newPoint];
      setPoints(newPoints);
      if (newPoints.length === 3) {
        onLocationsSelect({
          house: newPoints[0],
          workplace: newPoints[1],
          holiday: newPoints[2],
        });
      }
    }
  };

  const handleDirectionsResult = (
    result: google.maps.DirectionsResult | null,
    status: google.maps.DirectionsStatus
  ): void => {
    if (status === "OK" && result) {
      setDirections(result);
      if (result.routes[0] && result.routes[0].legs.length > 0) {
        const leg = result.routes[0].legs[0];
        const midLat = (leg.start_location.lat() + leg.end_location.lat()) / 2;
        const midLng = (leg.start_location.lng() + leg.end_location.lng()) / 2;
        const midpoint = new google.maps.LatLng(midLat, midLng);
        if (mapRef.current) {
          const service = new google.maps.places.PlacesService(mapRef.current);
          const request: google.maps.places.PlaceSearchRequest = {
            location: midpoint,
            radius: 5000, // 5 km radius
            type: "electric_vehicle_charging_station",
          };
          service.nearbySearch(request, handleNearbySearchResult);
        }
      }
    } else {
      console.error("Directions request failed due to: " + status);
    }
  };

  const handleNearbySearchResult = (
    results: google.maps.places.PlaceResult[] | null,
    status: google.maps.places.PlacesServiceStatus
  ): void => {
    if (status === google.maps.places.PlacesServiceStatus.OK && results) {
      setEvStations(results);
    }
  };

  useEffect(() => {
    if (points.length >= 2 && mapRef.current) {
      const directionsService = new google.maps.DirectionsService();
      directionsService.route(
        {
          origin: points[0],
          destination: points[1],
          travelMode: google.maps.TravelMode.DRIVING,
        },
        handleDirectionsResult
      );
    }
  }, [points]);

  const resetPoints = (): void => {
    setPoints([]);
    setDirections(null);
    setEvStations([]);
  };

  return (
    <div className="relative">
      <LoadScript
        googleMapsApiKey={process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY!}
        libraries={["places"]}
      >
        <GoogleMap
          mapContainerStyle={containerStyle}
          center={center}
          zoom={10}
          onLoad={onMapLoad}
          onClick={handleMapClick}
        >
          {points.map((point, index) => (
            <Marker
              key={index}
              position={point}
              label={index === 0 ? "House" : index === 1 ? "Work" : "Holiday"}
            />
          ))}
          {directions && <DirectionsRenderer directions={directions} />}
          {evStations.map((station, index) => (
            <Marker
              key={`ev-${index}`}
              position={station.geometry?.location as google.maps.LatLng}
              icon={{
                url: "https://maps.google.com/mapfiles/kml/paddle/ltblu-circle.png",
              }}
            />
          ))}
        </GoogleMap>
      </LoadScript>
      {points.length > 0 && (
        <button
          onClick={resetPoints}
          className="absolute top-2 right-2 bg-red-500 text-white px-4 py-2 rounded-md shadow"
        >
          Reset Points
        </button>
      )}
    </div>
  );
};

export default Map;
