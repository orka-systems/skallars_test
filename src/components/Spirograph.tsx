"use client";

import { useEffect, useRef } from 'react';
import dynamic from 'next/dynamic';

// Dynamically import the spirograph class with no SSR
const J = dynamic(() => import('../../script.js').then(mod => mod.J), {
  ssr: false
});

export default function Spirograph() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (containerRef.current && typeof window !== 'undefined') {
      J.initAll();
    }
  }, []);

  return (
    <div 
      ref={containerRef} 
      className="spirograph"
      data-spirograph="tetra"
      data-spirograph-options='{
        "autoRotateNonAxis": true,
        "objectsCount": 12,
        "objectsCountMobile": 11,
        "duplicateFactor": 0.58,
        "initRotate": { "x": 0.1, "y": 0.1, "z": 0.8 }
      }'
    >
      <canvas
        className="spirograph__canvas"
        data-spirograph-canvas
        data-parallax
        data-parallax-speed="30"
      ></canvas>
    </div>
  );
}
