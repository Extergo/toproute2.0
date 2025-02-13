// src/app/layout.tsx
import "../../styles/globals.css";
import { Inter } from "next/font/google";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Advanced Vehicle Recommender",
  description:
    "A Next.js app that recommends vehicles based on user preferences.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body
        className={`
          ${inter.className}
          bg-gradient-to-r from-blue-200 to-green-200
          min-h-screen
          flex flex-col
        `}
      >
        {children}
      </body>
    </html>
  );
}
