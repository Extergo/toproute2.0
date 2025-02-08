// src/app/layout.tsx
import "../../styles/globals.css";

export const metadata = {
  title: "Advanced Vehicle Recommender",
  description:
    "Select your locations and preferences to get advanced vehicle recommendations with price breakdowns and environmental ratings.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
