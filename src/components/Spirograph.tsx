"use client";

import { useEffect, useRef } from 'react';

export default function Spirograph() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const initSpirograph = async () => {
      try {
        // Dynamic import using native JavaScript
        const module = await import('../../script.js');
        if (module.J && typeof module.J.initAll === 'function') {
          module.J.initAll();
        }
      } catch (error) {
        console.error('Error initializing spirograph:', error);
      }
    };

    initSpirograph();
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
