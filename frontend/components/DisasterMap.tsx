"use client";

import { useEffect, useState } from "react";
import { MapContainer, TileLayer, Circle, Marker, Popup, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";

// Default Searched Pin Icon
const customIcon = L.icon({
  iconUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png",
  iconRetinaUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png",
  shadowUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});

// Custom Emojis/SVG Badges for Resources
const createCustomIcon = (emoji: string, bgColor: string) => {
  return L.divIcon({
    className: "custom-leaflet-marker",
    html: `<div style="
      background-color: ${bgColor};
      width: 32px;
      height: 32px;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 16px;
      border: 2px solid white;
      box-shadow: 0 2px 6px rgba(0,0,0,0.3);
    ">${emoji}</div>`,
    iconSize: [32, 32],
    iconAnchor: [16, 16],
  });
};

const resourceIcons = {
  RELIEF_CENTER: createCustomIcon("🏠", "#2563eb"),  // Blue
  FOOD_CENTER: createCustomIcon("🍲", "#d97706"),    // Amber
  HELP_CENTER: createCustomIcon("🏥", "#16a34a"),    // Green
};

interface Zone {
  id: string;
  title: string;
  type: "DANGER" | "SAFE";
  severity?: "CRITICAL" | "MODERATE" | "LOW";
  coordinates: { lat: number; lng: number };
  radius_meters: number;
}

interface ResourceCenter {
  id: string;
  name: string;
  category: "RELIEF_CENTER" | "FOOD_CENTER" | "HELP_CENTER";
  contact: string;
  coordinates: { lat: number; lng: number };
  details?: string;
}

// Sub-component to animate map centering on search updates
function MapRecenter({ targetLocation }: { targetLocation: { lat: number; lng: number } }) {
  const map = useMap();
  useEffect(() => {
    map.flyTo([targetLocation.lat, targetLocation.lng], 12, { duration: 1.5 });
  }, [targetLocation, map]);
  return null;
}

export default function DisasterMap({
  selectedLocation,
  locationName,
}: {
  selectedLocation: { lat: number; lng: number };
  locationName: string;
}) {
  const [zones, setZones] = useState<Zone[]>([]);
  const [resources, setResources] = useState<ResourceCenter[]>([]);

  useEffect(() => {
    // Fetch Danger & Safe Zones
    fetch("http://localhost:8000/api/map-zones")
      .then((res) => res.json())
      .then((res) => setZones(res.data))
      .catch((err) => console.error("Error fetching map zones:", err));

    // Fetch Relief, Food, and Helping Centers
    fetch("http://localhost:8000/api/resource-centers")
      .then((res) => res.json())
      .then((res) => setResources(res.data))
      .catch((err) => console.error("Error fetching resource centers:", err));
  }, []);

  return (
    <MapContainer
      {...({
        center: [selectedLocation.lat, selectedLocation.lng],
        zoom: 12,
        className: "h-full w-full z-0 rounded-lg",
      } as any)}
    >
      <TileLayer
        {...({
          attribution:
            '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
          url: "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
        } as any)}
      />

      {/* Recenter Map on New Search Location */}
      <MapRecenter targetLocation={selectedLocation} />

      {/* Searched Location Marker */}
      <Marker position={[selectedLocation.lat, selectedLocation.lng]} {...({ icon: customIcon } as any)}>
        <Popup>📍 Searched Area: {locationName}</Popup>
      </Marker>

      {/* 1. DANGER & SAFE ZONES */}
      {zones.map((zone) => {
        const isDanger = zone.type === "DANGER";
        const color = isDanger
          ? zone.severity === "CRITICAL"
            ? "#ef4444" // Red
            : "#f97316" // Orange
          : "#22c55e";   // Green for Safe Zone

        return (
          <Circle
            key={zone.id}
            center={[zone.coordinates.lat, zone.coordinates.lng] as [number, number]}
            radius={zone.radius_meters}
            pathOptions={{
              color: color,
              fillColor: color,
              fillOpacity: isDanger ? 0.35 : 0.25,
            }}
          >
            <Popup>
              <div className="font-bold text-sm" style={{ color }}>
                {isDanger ? "⚠️ DANGER ZONE" : "🛡️ SAFE ZONE"}
              </div>
              <div className="font-semibold">{zone.title}</div>
              {zone.severity && <div>Severity: {zone.severity}</div>}
              <div>Coverage Radius: {zone.radius_meters}m</div>
            </Popup>
          </Circle>
        );
      })}

      {/* 2. RELIEF, FOOD & HELPING CENTERS */}
      {resources.map((center) => (
        <Marker
          key={center.id}
          position={[center.coordinates.lat, center.coordinates.lng]}
          {...({ icon: resourceIcons[center.category] } as any)}
        >
          <Popup>
            <div className="font-bold text-slate-900 text-sm">{center.name}</div>
            <div className="text-xs font-semibold uppercase text-blue-600 mb-1">
              {center.category.replace("_", " ")}
            </div>
            {center.details && <div className="text-xs text-slate-600 mb-1">{center.details}</div>}
            <div className="text-xs font-medium text-emerald-700">📞 {center.contact}</div>
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  );
}