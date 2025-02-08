// src/data/cars.ts
export type CarType = "electric" | "hybrid" | "suv";

export interface Car {
  name: string;
  type: CarType;
  range: number; // in km
  seats: number;
}

export const cars: Car[] = [
  { name: "Tesla Model 3", type: "electric", range: 350, seats: 5 },
  { name: "Tesla Model S", type: "electric", range: 600, seats: 5 },
  { name: "Nissan Leaf", type: "electric", range: 240, seats: 5 },
  { name: "Chevy Bolt", type: "electric", range: 416, seats: 5 },
  { name: "Toyota Prius", type: "hybrid", range: 900, seats: 5 },
  { name: "Honda Insight", type: "hybrid", range: 800, seats: 5 },
  { name: "Ford Fusion Hybrid", type: "hybrid", range: 800, seats: 5 },
  { name: "Hyundai Ioniq", type: "hybrid", range: 700, seats: 5 },
  { name: "Ford Explorer", type: "suv", range: 700, seats: 7 },
  { name: "Toyota Highlander", type: "suv", range: 600, seats: 7 },
  { name: "Honda Pilot", type: "suv", range: 650, seats: 8 },
  { name: "Chevrolet Traverse", type: "suv", range: 650, seats: 8 },
  { name: "Kia Sorento", type: "suv", range: 600, seats: 7 },
  { name: "Mazda CX-9", type: "suv", range: 600, seats: 7 },
  { name: "Subaru Outback", type: "suv", range: 550, seats: 5 },
  { name: "Volkswagen Tiguan", type: "suv", range: 600, seats: 7 },
];
