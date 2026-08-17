import React, { useState, useEffect, useCallback } from 'react';
import { X, ZoomIn, ZoomOut, RotateCcw, Download, ExternalLink, Maximize2 } from 'lucide-react';

interface ImageLightboxModalProps {
  isOpen: boolean;
  imageUrl: string | null;
  title?: string;
  onClose: () => void;
}

export const ImageLightboxModal: React.FC<ImageLightboxModalProps> = ({
  isOpen,
  imageUrl,
  title,
  onClose
}) => {
  const [zoom, setZoom] = useState<number>(1);

  // Reset zoom whenever a new image is opened
  useEffect(() => {
    if (isOpen) {
      setZoom(1);
    }
  }, [isOpen, imageUrl]);

  // Keyboard navigation (ESC to close, +/- for zoom)
  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    if (e.key === 'Escape') {
      onClose();
    } else if (e.key === '+' || e.key === '=') {
      setZoom((prev) => Math.min(prev + 0.25, 3));
    } else if (e.key === '-' || e.key === '_') {
      setZoom((prev) => Math.max(prev - 0.25, 0.5));
    } else if (e.key === '0') {
      setZoom(1);
    }
  }, [onClose]);

  useEffect(() => {
    if (!isOpen) return;
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, handleKeyDown]);

  if (!isOpen || !imageUrl) return null;

  const handleZoomIn = () => setZoom((prev) => Math.min(prev + 0.25, 3));
  const handleZoomOut = () => setZoom((prev) => Math.max(prev - 0.25, 0.5));
  const handleResetZoom = () => setZoom(1);

  const isDataUrl = imageUrl.startsWith('data:');
  const downloadFileName = isDataUrl 
    ? `${(title || 'infografia').toLowerCase().replace(/[^a-z0-9]/gi, '_')}.png` 
    : undefined;

  return (
    <div 
      className="fixed inset-0 z-[9999] bg-slate-950/95 backdrop-blur-md flex flex-col h-screen w-screen top-0 left-0 position-fixed animate-fadeIn select-none overflow-hidden"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      {/* Top Header Bar */}
      <div className="bg-slate-900/95 border-b border-slate-800 px-4 py-3 flex items-center justify-between text-white shrink-0 gap-3 z-10 shadow-md">
        <div className="flex items-center gap-2.5 min-w-0">
          <div className="w-8 h-8 rounded-lg bg-blue-600/30 border border-blue-400/30 flex items-center justify-center text-blue-400 shrink-0">
            <Maximize2 className="w-4 h-4" />
          </div>
          <div className="min-w-0">
            <h3 className="text-xs sm:text-sm font-bold text-white truncate">
              {title || 'Infografía Oficial en Alta Resolución'}
            </h3>
            <p className="text-[11px] text-slate-400 truncate">
              Vista ampliada detallada • Clic en controles o usa las teclas +/- para zoom
            </p>
          </div>
        </div>

        {/* Toolbar controls */}
        <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
          {/* Zoom controls */}
          <div className="flex items-center bg-slate-800 rounded-xl p-1 border border-slate-700">
            <button
              type="button"
              onClick={handleZoomOut}
              disabled={zoom <= 0.5}
              className="p-1.5 rounded-lg text-slate-300 hover:text-white hover:bg-slate-700 disabled:opacity-40 disabled:hover:bg-transparent transition-colors cursor-pointer"
              title="Reducir zoom (-)"
            >
              <ZoomOut className="w-4 h-4" />
            </button>
            <span className="text-xs font-bold text-slate-200 px-2 min-w-[52px] text-center">
              {Math.round(zoom * 100)}%
            </span>
            <button
              type="button"
              onClick={handleZoomIn}
              disabled={zoom >= 3}
              className="p-1.5 rounded-lg text-slate-300 hover:text-white hover:bg-slate-700 disabled:opacity-40 disabled:hover:bg-transparent transition-colors cursor-pointer"
              title="Aumentar zoom (+)"
            >
              <ZoomIn className="w-4 h-4" />
            </button>
            {zoom !== 1 && (
              <button
                type="button"
                onClick={handleResetZoom}
                className="p-1.5 ml-1 rounded-lg text-blue-400 hover:text-blue-300 hover:bg-slate-700 transition-colors cursor-pointer"
                title="Restablecer a 100% (0)"
              >
                <RotateCcw className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Download button */}
          <a
            href={imageUrl}
            download={downloadFileName}
            target="_blank"
            rel="noopener noreferrer"
            className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700 transition-colors flex items-center gap-1.5 text-xs font-bold cursor-pointer"
            title="Descargar imagen / infografía"
          >
            <Download className="w-4 h-4" />
            <span className="hidden md:inline">Descargar</span>
          </a>

          {/* Close button */}
          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-xl bg-rose-600/80 hover:bg-rose-600 text-white transition-colors cursor-pointer ml-1 shadow-xs"
            title="Cerrar vista ampliada (Esc)"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Main Image Stage (Smart Fitted & Centered with Zoom Support) */}
      <div 
        className={`flex-1 flex items-center justify-center p-4 ${zoom > 1 ? 'overflow-auto' : 'overflow-hidden'} custom-scrollbar`}
        onClick={(e) => {
          if (e.target === e.currentTarget) onClose();
        }}
      >
        <div 
          className="transition-transform duration-150 ease-out origin-center flex items-center justify-center m-auto"
          style={{ transform: `scale(${zoom})` }}
          onClick={(e) => e.stopPropagation()}
        >
          <img
            src={imageUrl}
            alt={title || 'Infografía'}
            className="max-h-[calc(100vh-120px)] w-auto max-w-full object-contain mx-auto rounded-lg shadow-2xl border border-slate-700/60 cursor-default bg-slate-900/40"
          />
        </div>
      </div>

      {/* Bottom status bar */}
      <div className="bg-slate-900/95 border-t border-slate-800 px-4 py-2 text-center text-[11px] text-slate-400 shrink-0">
        💡 <strong>Tip:</strong> Puedes usar las teclas <kbd className="px-1.5 py-0.5 bg-slate-800 rounded border border-slate-700 text-slate-300">+</kbd> y <kbd className="px-1.5 py-0.5 bg-slate-800 rounded border border-slate-700 text-slate-300">-</kbd> para hacer zoom, o presionar <kbd className="px-1.5 py-0.5 bg-slate-800 rounded border border-slate-700 text-slate-300">Esc</kbd> para cerrar.
      </div>
    </div>
  );
};
