'use client';

import { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Polyline, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { TrailSection, Village } from '@/types';

// Fix default marker icons in Next.js
const defaultIcon = L.icon({
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
});

interface TrailMapProps {
  sections: TrailSection[];
  villages: Village[];
  selectedSection?: number;
}

const SECTION_COLORS = [
  '#DC2626', '#EA580C', '#D97706', '#CA8A04',
  '#65A30D', '#16A34A', '#0D9488', '#2563EB',
];

export default function TrailMap({ sections, villages, selectedSection }: TrailMapProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className="w-full h-[400px] bg-gray-200 rounded-xl animate-pulse flex items-center justify-center">
        <span className="text-gray-500">Loading map...</span>
      </div>
    );
  }

  // Center on the trail (roughly middle of Arcadia)
  const center: [number, number] = [37.63, 22.16];

  return (
    <div className="w-full h-[400px] rounded-xl overflow-hidden shadow-md">
      <MapContainer
        center={center}
        zoom={11}
        className="w-full h-full"
        scrollWheelZoom={true}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {/* Render section lines as straight connections between villages */}
        {sections.map((section, idx) => (
          <Polyline
            key={section.id}
            positions={[section.fromCoords, section.toCoords]}
            pathOptions={{
              color: SECTION_COLORS[idx % SECTION_COLORS.length],
              weight: selectedSection === section.id ? 5 : 3,
              opacity: selectedSection && selectedSection !== section.id ? 0.4 : 0.9,
            }}
          />
        ))}

        {/* Village markers */}
        {villages.map((village) => (
          <Marker key={village.name} position={village.coords} icon={defaultIcon}>
            <Popup>
              <strong>{village.name}</strong>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
}
