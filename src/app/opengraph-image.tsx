import { ImageResponse } from "next/og";

export const runtime = "edge";
export const alt = "PredictionEdge — Prediction Market Arbitrage";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          height: "100%",
          width: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: "#030712",
          backgroundImage:
            "radial-gradient(circle at 25% 25%, #1e1b4b 0%, transparent 50%), radial-gradient(circle at 75% 75%, #312e81 0%, transparent 50%)",
        }}
      >
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <h1
            style={{
              fontSize: 64,
              fontWeight: 800,
              color: "white",
              marginBottom: 0,
              letterSpacing: "-0.02em",
            }}
          >
            PredictionEdge
          </h1>
          <p
            style={{
              fontSize: 28,
              color: "#a5b4fc",
              marginTop: 16,
            }}
          >
            Prediction Market Arbitrage Scanner
          </p>
          <div
            style={{
              display: "flex",
              gap: 32,
              marginTop: 48,
              color: "#9ca3af",
              fontSize: 20,
            }}
          >
            <span>⚡ Real-Time</span>
            <span>📊 200+ Daily Opps</span>
            <span>🔒 Math-Backed</span>
          </div>
        </div>
      </div>
    ),
    { ...size }
  );
}
