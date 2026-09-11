import React from 'react';
import { useScrollProgress, ScrollProgressOptions } from '../hooks/useScrollProgress';

export { useScrollProgress };
export type { ScrollProgressOptions };

export interface ScrollProgressBarProps {
  containerId?: string;
  className?: string;
  height?: string; // default: h-1.5 (6px) or h-[5px]
}

export default function ScrollProgressBar({
  containerId = 'phone-main-scrollable-content',
  className = '',
  height = 'h-1.5',
}: ScrollProgressBarProps) {
  const { progress, scale, isScrollable, fillRef } = useScrollProgress({ containerId });

  return (
    <div
      id="scroll-progress-bar"
      role="progressbar"
      aria-label="Progreso de lectura"
      aria-valuenow={Math.round(progress)}
      aria-valuemin={0}
      aria-valuemax={100}
      className={`fixed bottom-0 left-0 right-0 z-50 pointer-events-none transition-opacity duration-200 ${
        isScrollable ? 'opacity-100' : 'opacity-0'
      } ${className}`}
    >
      {/* Carril de fondo tenue */}
      <div className={`w-full ${height} bg-slate-900/15 backdrop-blur-xs overflow-hidden`}>
        {/* Barra de relleno a 100% de ancho, escalada con scaleX en GPU sin transiciones lentas */}
        <div
          ref={fillRef}
          className="w-full h-full bg-gradient-to-r from-[#1e3c72] via-blue-600 to-[#00d2ff] origin-left will-change-transform shadow-[0_0_12px_rgba(0,210,255,0.85),0_0_4px_rgba(30,60,114,0.6)]"
          style={{
            transform: `scaleX(${scale})`,
            transformOrigin: '0% 50%',
          }}
        />
      </div>
    </div>
  );
}

