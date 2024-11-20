"use client";

import { useEffect, useRef } from 'react';

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

    // Load script if not already loaded
    const script = document.createElement('script');
    script.src = '/spirograph.js';
    script.async = true;
    script.onload = initSpirograph;
    script.onerror = (error) => {
      console.error('Error loading spirograph script:', error);
    };
    document.body.appendChild(script);

    // Cleanup function
    return () => {
      if (script.parentNode) {
        script.parentNode.removeChild(script);
      }
    };
  }, []);

  return (
    <div 
      ref={containerRef}
      data-spirograph="tetra"
      style={{ 
        width: '100%',
        height: '100%',
        minHeight: '400px',
        background: '#ffffff'
      }}
    />
  );
}
