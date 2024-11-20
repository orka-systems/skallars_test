"use client";

import { useEffect, useRef, useState } from 'react';

declare global {
  interface Window {
    J: {
      initAll: () => void;
      [key: string]: any;
    }
  }
}

export default function Spirograph() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [error, setError] = useState<string | null>(null);
  const scriptRef = useRef<HTMLScriptElement | null>(null);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const loadScript = async () => {
      try {
        // If script is already loaded and initialized
        if (window.J && typeof window.J.initAll === 'function') {
          window.J.initAll();
          return;
        }

        // If script element already exists but not loaded
        if (scriptRef.current) {
          document.body.removeChild(scriptRef.current);
        }

        // Create and load script
        const script = document.createElement('script');
        script.src = '/script.js';
        script.async = true;
        
        const loadPromise = new Promise((resolve, reject) => {
          script.onload = resolve;
          script.onerror = reject;
        });

        scriptRef.current = script;
        document.body.appendChild(script);

        await loadPromise;

        // Wait a small delay to ensure script is fully initialized
        await new Promise(resolve => setTimeout(resolve, 100));

        if (!window.J || typeof window.J.initAll !== 'function') {
          throw new Error('Spirograph script failed to initialize properly');
        }

        window.J.initAll();
        setError(null);
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Failed to load spirograph';
        console.error('Spirograph initialization error:', err);
        setError(errorMessage);
      }
    };

    loadScript();

    // Cleanup function
    return () => {
      if (scriptRef.current && scriptRef.current.parentNode) {
        scriptRef.current.parentNode.removeChild(scriptRef.current);
      }
    };
  }, []);

  if (error) {
    return (
      <div className="p-4 text-red-500 bg-red-100 rounded">
        Error loading spirograph: {error}
      </div>
    );
  }

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
