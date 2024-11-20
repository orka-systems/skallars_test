"use client";

import { useEffect, useRef } from 'react';

declare global {
  interface Window {
    J: {
      initAll: () => void;
    }
  }
}

export default function Spirograph() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    // Initialize spirograph when component mounts
    const initSpirograph = () => {
      if (window.J && typeof window.J.initAll === 'function') {
        try {
          window.J.initAll();
        } catch (error) {
          console.error('Error initializing spirograph:', error);
        }
      }
    };

    // Check if script is already loaded
    if (window.J) {
      initSpirograph();
    } else {
      // Load script if not already loaded
      const script = document.createElement('script');
      script.src = '/script.js';
      script.async = true;
      script.onload = initSpirograph;
      script.onerror = (error) => {
        console.error('Error loading spirograph script:', error);
      };
      document.body.appendChild(script);
    }

    // Cleanup function
    return () => {
      const scripts = document.querySelectorAll('script[src="/script.js"]');
      scripts.forEach(script => {
        if (script.parentNode) {
          script.parentNode.removeChild(script);
        }
      });
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
