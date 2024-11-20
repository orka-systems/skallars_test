"use client";

import { useEffect, useRef } from 'react';

export default function Spirograph() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    // Load script directly
    const script = document.createElement('script');
    script.src = '/script.js';
    script.onload = () => {
      if (window.J && typeof window.J.initAll === 'function') {
        window.J.initAll();
      }
    };
    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
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
