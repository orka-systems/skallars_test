"use client";

import React, { useState } from 'react';
import { MapPin } from 'lucide-react';

interface Office {
  city: string;
  address: string;
  phone: string;
  coordinates: {
    x: number;
    y: number;
  };
}

interface CountryInfo {
  name: string;
  path: string;
  offices: Office[];
}

const countries: CountryInfo[] = [
  {
    name: "Slovakia",
    path: "M 320 200 L 340 190 L 360 195 L 365 210 L 355 220 L 340 225 L 320 220 L 315 210 Z",
    offices: [
      {
        city: "Bratislava",
        address: "Mostová 2, 811 02 Bratislava",
        phone: "+421 2 5443 5941",
        coordinates: { x: 325, y: 215 }
      },
      {
        city: "Košice",
        address: "Hlavná 87, 040 01 Košice",
        phone: "+421 55 729 0711",
        coordinates: { x: 355, y: 205 }
      }
    ]
  },
  {
    name: "Czech Republic",
    path: "M 280 180 L 310 175 L 330 185 L 320 200 L 315 210 L 300 205 L 285 195 Z",
    offices: [
      {
        city: "Praha",
        address: "Vodičkova 710/31, 110 00 Praha",
        phone: "+420 224 103 316",
        coordinates: { x: 295, y: 190 }
      }
    ]
  },
  {
    name: "Austria",
    path: "M 290 220 L 315 210 L 320 220 L 315 235 L 295 240 L 280 235 L 275 225 Z",
    offices: [
      {
        city: "Wien",
        address: "Schottenring 12, 1010 Wien",
        phone: "+43 1 513 8120",
        coordinates: { x: 300, y: 225 }
      }
    ]
  }
];

export default function InteractiveMap() {
  const [hoveredCountry, setHoveredCountry] = useState<string | null>(null);
  const [hoveredOffice, setHoveredOffice] = useState<Office | null>(null);

  return (
    <div className="relative w-full h-96 bg-gray-100 rounded-lg overflow-hidden">
      <svg
        viewBox="250 150 150 120"
        className="w-full h-full"
        style={{ background: '#f8fafc' }}
      >
        {countries.map((country) => (
          <path
            key={country.name}
            d={country.path}
            fill={hoveredCountry === country.name ? '#210059' : '#e2e8f0'}
            stroke="#334155"
            strokeWidth="1"
            onMouseEnter={() => setHoveredCountry(country.name)}
            onMouseLeave={() => setHoveredCountry(null)}
            className="transition-colors duration-300 cursor-pointer"
          />
        ))}
        
        {countries.map((country) => 
          country.offices.map((office, index) => (
            <g
              key={`${country.name}-${office.city}`}
              transform={`translate(${office.coordinates.x}, ${office.coordinates.y})`}
              className="cursor-pointer"
              onMouseEnter={() => setHoveredOffice(office)}
              onMouseLeave={() => setHoveredOffice(null)}
            >
              <circle
                r="3"
                fill={hoveredOffice === office ? '#210059' : '#4a5568'}
                className="transition-colors duration-300"
              />
              <text
                x="5"
                y="2"
                fontSize="8"
                fill="#1a202c"
                className="font-medium"
              >
                {office.city}
              </text>
            </g>
          ))
        )}
      </svg>

      {hoveredOffice && (
        <div
          className="absolute z-10 bg-white text-[#210059] p-4 rounded-lg shadow-lg"
          style={{
            top: `${(hoveredOffice.coordinates.y - 150) * 100 / 120}%`,
            left: `${(hoveredOffice.coordinates.x - 250) * 100 / 150}%`,
            transform: 'translate(-50%, -120%)'
          }}
        >
          <h4 className="font-bold">{hoveredOffice.city}</h4>
          <p>{hoveredOffice.address}</p>
          <p>{hoveredOffice.phone}</p>
        </div>
      )}
    </div>
  );
}
