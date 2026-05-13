'use client';

import { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Polyline, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { TrailSection, Accommodation } from '@/types';

const defaultIcon = L.icon({
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
});

const accommodationIcon = L.icon({
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
  iconSize: [20, 33],
  iconAnchor: [10, 33],
  popupAnchor: [1, -28],
  className: 'hue-rotate-180',
});

interface SectionMapProps {
  section: TrailSection;
  accommodations?: Accommodation[];
}

export default function SectionMap({ section, accommodations = [] }: SectionMapProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className="w-full h-[350px] bg-gray-200 rounded-xl animate-pulse flex items-center justify-center">
        <span className="text-gray-500">Loading map...</span>
      </div>
    );
  }

  const center: [number, number] = [
    (section.fromCoords[0] + section.toCoords[0]) / 2,
    (section.fromCoords[1] + section.toCoords[1]) / 2,
  ];

  return (
    <div className="w-full h-[350px] rounded-xl overflow-hidden shadow-md">
      <MapContainer
        center={center}
        zoom={13}
        className="w-full h-full"
        scrollWheelZoom={true}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        <Polyline
          positions={[section.fromCoords, section.toCoords]}
          pathOptions={{ color: '#2D5016', weight: 4, opacity: 0.9 }}
        />

        <Marker position={section.fromCoords} icon={defaultIcon}>
          <Popup><strong>{section.from}</strong> (Start)</Popup>
        </Marker>
        <Marker position={section.toCoords} icon={defaultIcon}>
          <Popup><strong>{section.to}</strong> (End)</Popup>
        </Marker>

        {accommodations.map((acc) => (
          <Marker key={acc.id} position={acc.coords} icon={accommodationIcon}>
            <Popup>
              <div>
                <strong>{acc.name}</strong>
                <br />
                <span className="text-xs text-gray-500">{acc.type}</span>
                {acc.bookingUrl && (
                  <div className="mt-1">
                    <a
                      href={acc.bookingUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 text-xs underline"
                    >
                      Book →
                    </a>
                  </div>
                )}
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
}
