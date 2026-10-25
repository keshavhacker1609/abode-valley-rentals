import { ImageResponse } from "next/og";
import { getFlat } from "@/lib/inventory";
import { formatINR, ordinal, typeLabel } from "@/lib/utils";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
export const alt = "Flat for rent at Abode Valley";

export default async function OG({ params }: { params: { id: string } }) {
  const flat = await getFlat(params.id);
  const name = process.env.NEXT_PUBLIC_BROKERAGE_NAME || "Abode Valley Rentals";
  return new ImageResponse(
    (
      <div style={{ width: "100%", height: "100%", display: "flex", flexDirection: "column", justifyContent: "space-between", padding: 72, background: "#1F3A2E", color: "#F7F4EE", fontFamily: "serif" }}>
        <div style={{ display: "flex", justifyContent: "space-between", fontSize: 26, letterSpacing: 4, textTransform: "uppercase", opacity: 0.75 }}>
          <span>{name}</span><span>Abode Valley · Kattankulathur</span>
        </div>
        {flat ? (
          <div style={{ display: "flex", flexDirection: "column" }}>
            <div style={{ fontSize: 92, lineHeight: 1 }}>{`${typeLabel(flat.type)} · ${flat.id}`}</div>
            <div style={{ fontSize: 40, marginTop: 24, opacity: 0.85 }}>{`${flat.sqft} sq ft · ${ordinal(flat.floor)} floor · ${flat.facing}-facing · ${flat.furnishing}`}</div>
          </div>
        ) : <div style={{ fontSize: 92 }}>Flats for rent near SRM</div>}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div style={{ fontSize: 64, color: "#E6DCCB" }}>{flat ? `${formatINR(flat.rent)} / month` : ""}</div>
          <div style={{ width: 120, height: 12, background: "#C2643B", borderRadius: 6 }} />
        </div>
      </div>
    ),
    size
  );
}
