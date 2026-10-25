import { ImageResponse } from "next/og";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
export const alt = "Flats for rent at Abode Valley, Kattankulathur";

export default function OG() {
  const name = process.env.NEXT_PUBLIC_BROKERAGE_NAME || "Abode Valley Rentals";
  return new ImageResponse(
    (
      <div style={{ width: "100%", height: "100%", display: "flex", flexDirection: "column", justifyContent: "space-between", padding: 72, background: "#F7F4EE", color: "#1C1C1C", fontFamily: "serif" }}>
        <div style={{ fontSize: 26, letterSpacing: 4, textTransform: "uppercase", color: "#1F3A2E" }}>{name}</div>
        <div style={{ display: "flex", flexDirection: "column" }}>
          <div style={{ fontSize: 100, lineHeight: 1.02, color: "#1F3A2E" }}>Homes beside SRM,</div>
          <div style={{ fontSize: 100, lineHeight: 1.02, color: "#A3492A" }}>let the honest way.</div>
        </div>
        <div style={{ fontSize: 32, opacity: 0.75 }}>2.75 & 3 BHK flats for rent · Abode Valley, Kattankulathur, Chennai</div>
      </div>
    ),
    size
  );
}
