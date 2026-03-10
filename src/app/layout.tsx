import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { AuthProvider } from "@/lib/auth/AuthContext";

const inter = Inter({ subsets: ["latin"] });

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#030712",
};

export const metadata: Metadata = {
  title: {
    default: "PredictionEdge — Prediction Market Arbitrage Scanner",
    template: "%s | PredictionEdge",
  },
  description:
    "Find real-time arbitrage opportunities across Polymarket and Kalshi. 200+ daily opportunities. Built-in calculator. Backed by math, not luck.",
  keywords: [
    "prediction market arbitrage",
    "polymarket arbitrage",
    "kalshi arbitrage",
    "arbitrage scanner",
    "prediction markets",
    "arbitrage calculator",
    "polymarket vs kalshi",
  ],
  authors: [{ name: "PredictionEdge" }],
  creator: "PredictionEdge",
  openGraph: {
    type: "website",
    locale: "en_US",
    siteName: "PredictionEdge",
    title: "PredictionEdge — Prediction Market Arbitrage Scanner",
    description:
      "Real-time arbitrage opportunities across Polymarket & Kalshi. 200+ daily opportunities backed by math.",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "PredictionEdge — Prediction Market Arbitrage",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "PredictionEdge — Prediction Market Arbitrage Scanner",
    description:
      "Real-time arbitrage across Polymarket & Kalshi. 200+ daily opportunities.",
    images: ["/og-image.png"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
    },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className={`${inter.className} bg-gray-950 text-white antialiased min-h-screen flex flex-col`}>
        <AuthProvider>
          <Navbar />
          <main className="mx-auto max-w-7xl w-full px-4 sm:px-6 lg:px-8 py-8 flex-1">
            {children}
          </main>
          <Footer />
        </AuthProvider>
      </body>
    </html>
  );
}
