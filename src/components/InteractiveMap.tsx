"use client";

import React, { useState } from "react";
import {
  ComposableMap,
  Geographies,
  Geography,
  Marker,
  Annotation,
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

const majorCities = [
  { name: "Praha", coordinates: [14.4378, 50.0755] },
  { name: "Bratislava", coordinates: [17.1077, 48.1486] },
  { name: "Wien", coordinates: [16.3738, 48.2082] }
];

export default function InteractiveMap() {
  const [hoveredOffice, setHoveredOffice] = useState<Office | null>(null);
  const [hoveredCountry, setHoveredCountry] = useState<string | null>(null);

  return (
    <div className="relative w-full h-[500px] bg-gray-50 rounded-lg overflow-hidden" onWheel={(e) => e.stopPropagation()}>
      <ComposableMap
        projection="geoMercator"
        projectionConfig={{
          center: [16, 49],
          scale: 2500
        }}
      >
        <ZoomableGroup
          zoom={1}
          maxZoom={1}
          minZoom={1}
          center={[16, 49]}
        >
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
                          ? "#210059"
                          : "#f1f5f9",
                        stroke: "#94a3b8",
                        strokeWidth: 0.5,
                        outline: "none",
                        opacity: isHighlighted ? 0.8 : 1
                      },
                      hover: {
                        fill: isHighlighted ? "#210059" : "#f1f5f9",
                        stroke: "#94a3b8",
                        strokeWidth: 0.5,
                        outline: "none",
                        opacity: isHighlighted ? 1 : 1
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

          {/* Major city labels */}
          {majorCities.map(({ name, coordinates }) => (
            <Annotation
              key={name}
              subject={coordinates}
              dx={0}
              dy={-10}
              connectorProps={{
                stroke: "#210059",
                strokeWidth: 1,
                strokeLinecap: "round"
              }}
            >
              <text
                x={4}
                textAnchor="middle"
                alignmentBaseline="middle"
                fill="#210059"
                className="text-[10px] font-semibold"
              >
                {name}
              </text>
            </Annotation>
          ))}

          {/* Office markers */}
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
