'use client';

import React from 'react';
import { MapContainer, TileLayer, Marker, Popup, Circle } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { Destination } from '@/components/data/mock-data';
import Link from 'next/link';

interface MapInnerProps {
  destinations: Destination[];
  zoom: number;
  center: [number, number];
}

// Custom Leaflet DivIcon with terracotta/forest indicators
const createCustomIcon = (isResting: boolean) => {
  return L.divIcon({
    className: 'custom-map-pin',
    html: `
      <div style="
        background-color: ${isResting ? '#A65A3A' : '#5F6B4F'};
        width: 24px;
        height: 24px;
        border-radius: 50%;
        border: 2px solid #FAF6EE;
        box-shadow: 0 2px 6px rgba(0,0,0,0.3);
        display: flex;
        align-items: center;
        justify-content: center;
      ">
        <div style="width: 8px; height: 8px; background: #FAF6EE; border-radius: 50%;"></div>
      </div>
    `,
    iconSize: [24, 24],
    iconAnchor: [12, 12],
  });
};

export function MapInner({ destinations, zoom, center }: MapInnerProps) {
  return (
    <MapContainer
      center={center}
      zoom={zoom}
      scrollWheelZoom={false}
      className="w-full h-full"
      style={{ background: '#F5F1EB' }}
    >
      {/* Warm Sepia Toned CartoDB Tiles */}
      <TileLayer
        attribution='&copy; <a href="https://carto.com/">CARTO</a> & OpenStreetMap'
        url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
      />

      {destinations.map((dest) => {
        const isResting = dest.isAtCapacity || dest.currentCapacity >= dest.maxCapacity;

        return (
          <React.Fragment key={dest.id}>
            {/* 15 km Carrying Capacity Radius Circle */}
            <Circle
              center={[dest.coordinates.lat, dest.coordinates.lng]}
              radius={15000} // 15 km in meters
              pathOptions={{
                color: isResting ? '#A65A3A' : '#5F6B4F',
                fillColor: isResting ? '#A65A3A' : '#5F6B4F',
                fillOpacity: 0.08,
                weight: 1.5,
                dashArray: '4, 4',
              }}
            />

            {/* Custom Marker */}
            <Marker
              position={[dest.coordinates.lat, dest.coordinates.lng]}
              icon={createCustomIcon(isResting)}
            >
              <Popup className="custom-leaflet-popup">
                <div className="w-56 space-y-2 p-1 text-[#2E2A25]">
                  <div className="h-28 w-full overflow-hidden rounded-lg bg-[#EBE5DC]">
                    <img
                      src={dest.coverImage}
                      alt={dest.title}
                      className="w-full h-full object-cover"
                    />
                  </div>

                  <div className="space-y-1">
                    <span className="text-[9px] uppercase font-mono text-[#A65A3A] font-bold">
                      {dest.location}
                    </span>
                    <h4 className="text-sm font-bold font-serif-heading text-[#2E2A25] leading-tight">
                      {dest.title}
                    </h4>
                    <p className="text-[10px] text-[#6B635B]">
                      {isResting ? 'Resting Today (15km Alternatives)' : `Capacity: ${dest.currentCapacity}/${dest.maxCapacity} Guests`}
                    </p>
                  </div>

                  <div className="pt-2 border-t border-[#DDD4C8] flex justify-between items-center text-[11px]">
                    <span className="font-bold text-[#2E2A25]">₹{dest.price.toLocaleString('en-IN')}/night</span>
                    <Link
                      href={`/destinations/${dest.id}`}
                      className="text-[#A65A3A] font-bold underline"
                    >
                      Read Story →
                    </Link>
                  </div>
                </div>
              </Popup>
            </Marker>
          </React.Fragment>
        );
      })}
    </MapContainer>
  );
}
