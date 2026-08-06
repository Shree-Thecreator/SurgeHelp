"use client";

import { useEffect, useState } from "react";
import { MapContainer, TileLayer, Circle, Marker, Popup, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";

const customIcon = L.icon({
  iconUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png",
  iconRetinaUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png",
  shadowUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});

interface DangerZone {
  id: string;
  title: string;
  severity: string;
  coordinates: { lat: number; lng: number };
  radius_meters: number;
}

// Sub-component to animate the map to the searched location
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
  const [zones, setZones] = useState<DangerZone[]>([]);

  useEffect(() => {
    fetch("http://localhost:8000/api/danger-zones")
      .then((res) => res.json())
      .then((res) => setZones(res.data))
      .catch((err) => console.error("Error fetching danger zones:", err));
  }, []);

  return (
    <MapContainer
      center={[selectedLocation.lat, selectedLocation.lng]}
      zoom={12}
      className="h-full w-full z-0 rounded-lg"
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />

      {/* Recenter Map on New Search Location */}
      <MapRecenter targetLocation={selectedLocation} />

      {/* Searched Location Marker */}
      <Marker position={[selectedLocation.lat, selectedLocation.lng]} icon={customIcon}>
        <Popup>📍 Searched Area: {locationName}</Popup>
      </Marker>

      {/* Danger Zone Circles */}
      {zones.map((zone) => (
        <Circle
          key={zone.id}
          center={[zone.coordinates.lat, zone.coordinates.lng]}
          radius={zone.radius_meters}
          pathOptions={{
            color: zone.severity === "CRITICAL" ? "red" : "orange",
            fillColor: zone.severity === "CRITICAL" ? "red" : "orange",
            fillOpacity: 0.35,
          }}
        >
          <Popup>
            <div className="font-semibold text-red-600">{zone.title}</div>
            <div>Severity: {zone.severity}</div>
          </Popup>
        </Circle>
      ))}
    </MapContainer>
  );
}