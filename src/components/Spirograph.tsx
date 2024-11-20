"use client";

import { useEffect, useRef } from 'react';

export default function Spirograph() {
  const containerRef = useRef<HTMLDivElement>(null);
  const scriptRef = useRef<HTMLScriptElement | null>(null);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    // Create script element if it doesn't exist
    if (!scriptRef.current) {
      scriptRef.current = document.createElement('script');
      scriptRef.current.src = '/script.js';
      scriptRef.current.async = true;
      
      // Initialize spirograph when script loads
      scriptRef.current.onload = () => {
        if (window.J && typeof window.J.initAll === 'function') {
          try {
            window.J.initAll();
          } catch (error) {
            console.error('Error initializing spirograph:', error);
          }
        }
      };

      // Handle script load errors
      scriptRef.current.onerror = (error) => {
        console.error('Error loading spirograph script:', error);
      };

      document.body.appendChild(scriptRef.current);
    }

    // Cleanup function
    return () => {
      if (scriptRef.current && document.body.contains(scriptRef.current)) {
        document.body.removeChild(scriptRef.current);
        scriptRef.current = null;
      }
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
