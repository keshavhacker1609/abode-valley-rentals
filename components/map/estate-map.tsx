"use client";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import { MapContainer, Marker, Popup, TileLayer, Tooltip, useMap } from "react-leaflet";
import { useEffect } from "react";

export interface MapPin {
  id: string;
  lat: number;
  lng: number;
  label: string;
  /** Rich popup content */
  popup?: React.ReactNode;
  tone?: "estate" | "place" | "block";
}

const pinIcon = (label: string, tone: MapPin["tone"]) =>
  L.divIcon({
    className: "map-pin",
    iconSize: undefined,
    html:
      tone === "estate"
        ? `<span style="display:grid;place-items:center;width:46px;height:46px;border-radius:999px;background:rgb(var(--forest));color:rgb(var(--on-forest));box-shadow:0 0 0 8px rgb(31 58 46 / .18);font:600 11px/1 var(--font-body);transform:translate(-50%,-50%)">${label}</span>`
        : tone === "block"
          ? `<span style="display:inline-flex;align-items:center;gap:4px;white-space:nowrap;padding:6px 10px;border-radius:999px;background:rgb(var(--card));color:rgb(var(--ink));border:1px solid rgb(var(--line));box-shadow:0 6px 16px -8px rgb(0 0 0/.4);font:600 12px/1 var(--font-body);transform:translate(-50%,-50%)">${label}</span>`
          : `<span style="display:block;width:14px;height:14px;border-radius:999px;background:rgb(var(--terracotta));border:3px solid rgb(var(--paper));box-shadow:0 2px 8px rgb(0 0 0/.35);transform:translate(-50%,-50%)"></span>`,
  });

function FitBounds({ pins }: { pins: MapPin[] }) {
  const map = useMap();
  useEffect(() => {
    if (pins.length > 1) map.fitBounds(L.latLngBounds(pins.map((p) => [p.lat, p.lng])), { padding: [40, 40], maxZoom: 17 });
  }, [map, pins]);
  return null;
}

export default function EstateMap({
  center, pins, fitPins, zoom = 14, fit = true, className,
}: { center: [number, number]; pins: MapPin[]; fitPins?: MapPin[]; zoom?: number; fit?: boolean; className?: string }) {
  return (
    <MapContainer center={center} zoom={zoom} scrollWheelZoom={false} className={className} style={{ height: "100%", width: "100%" }} attributionControl>
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> &copy; <a href="https://carto.com/">CARTO</a>'
        url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
      />
      {fit && <FitBounds pins={fitPins ?? pins} />}
      {pins.map((p) => (
        <Marker key={p.id} position={[p.lat, p.lng]} icon={pinIcon(p.label, p.tone)} title={p.label} alt={p.label}>
          {p.tone === "place" && <Tooltip direction="top" offset={[0, -10]}>{p.label}</Tooltip>}
          {p.popup && <Popup>{p.popup}</Popup>}
        </Marker>
      ))}
    </MapContainer>
  );
}

