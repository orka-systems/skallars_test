"use client";

import React, { useState } from "react";
import {
  ComposableMap,
  Geographies,
  Geography,
  Marker,
  ZoomableGroup
} from "react-simple-maps";

interface Office {
  city: string;
  address: string;
  phone: string;
  coordinates: [number, number];
}

interface CountryOffices {
  [key: string]: Office[];
}

const offices: CountryOffices = {
  SVK: [
    {
      city: "Bratislava",
      address: "Staré Grunty 18, 841 04 Bratislava",
      phone: "+421 2 5443 5941",
      coordinates: [17.0688, 48.1690]
    },
    {
      city: "Košice",
      address: "Hlavná 87, 040 01 Košice",
      phone: "+421 55 729 0711",
      coordinates: [21.2611, 48.7164]
    }
  ],
  CZE: [
    {
      city: "Praha",
      address: "Bozděchova 7, 150 00 Praha 5",
      phone: "+420 224 103 316",
      coordinates: [14.3989, 50.0713]
    }
  ],
  AUT: [
    {
      city: "Wien",
      address: "Schottenring 12, 1010 Wien",
      phone: "+43 1 513 8120",
      coordinates: [16.3738, 48.2082]
    }
  ]
};

const highlightedCountries = ["SVK", "CZE", "AUT"];

export default function InteractiveMap() {
  const [hoveredOffice, setHoveredOffice] = useState<Office | null>(null);
  const [hoveredCountry, setHoveredCountry] = useState<string | null>(null);

  return (
    <div className="relative w-full h-[500px] bg-gray-50 rounded-lg overflow-hidden">
      <ComposableMap
        projection="geoMercator"
        projectionConfig={{
          center: [16.5, 48.7],
          scale: 4000
        }}
      >
        <ZoomableGroup>
          <Geographies geography="/europe.json">
            {({ geographies }) =>
              geographies.map((geo) => {
                const isHighlighted = highlightedCountries.includes(geo.properties.ISO_A3);
                const isHovered = hoveredCountry === geo.properties.ISO_A3;
                
                return (
                  <Geography
                    key={geo.rsmKey}
                    geography={geo}
                    onMouseEnter={() => {
                      if (isHighlighted) {
                        setHoveredCountry(geo.properties.ISO_A3);
                      }
                    }}
                    onMouseLeave={() => {
                      setHoveredCountry(null);
                    }}
                    style={{
                      default: {
                        fill: isHighlighted
                          ? "#e2e8f0"
                          : "#f1f5f9",
                        stroke: "#94a3b8",
                        strokeWidth: 0.5,
                        outline: "none",
                      },
                      hover: {
                        fill: isHighlighted ? "#210059" : "#f1f5f9",
                        stroke: "#94a3b8",
                        strokeWidth: 0.5,
                        outline: "none",
                      },
                      pressed: {
                        fill: "#210059",
                        stroke: "#94a3b8",
                        strokeWidth: 0.5,
                        outline: "none",
                      },
                    }}
                  />
                );
              })
            }
          </Geographies>

          {Object.entries(offices).map(([countryCode, countryOffices]) =>
            countryOffices.map((office, index) => (
              <Marker
                key={`${countryCode}-${index}`}
                coordinates={office.coordinates}
                onMouseEnter={() => setHoveredOffice(office)}
                onMouseLeave={() => setHoveredOffice(null)}
              >
                <circle
                  r={4}
                  fill={hoveredOffice === office ? "#210059" : "#475569"}
                  stroke="#fff"
                  strokeWidth={2}
                  className="cursor-pointer transition-colors duration-300"
                />
              </Marker>
            ))
          )}
        </ZoomableGroup>
      </ComposableMap>

      {hoveredOffice && (
        <div
          className="absolute z-10 bg-white text-[#210059] p-4 rounded-lg shadow-lg"
          style={{
            left: "50%",
            top: "50%",
            transform: "translate(-50%, -50%)"
          }}
        >
          <h4 className="font-bold text-lg">{hoveredOffice.city}</h4>
          <p className="text-gray-600">{hoveredOffice.address}</p>
          <p className="text-gray-600">{hoveredOffice.phone}</p>
        </div>
      )}
    </div>
  );
}
