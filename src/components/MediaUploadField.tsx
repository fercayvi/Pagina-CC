import React from 'react';
import { 
  Link2, Trash2, Image as ImageIcon, 
  Video, FileDown, FileCheck, Check 
} from 'lucide-react';

export interface MediaUploadFieldProps {
  type: 'image' | 'video' | 'pdf';
  label: string;
  value: string;
  onChange: (value: string, fileName?: string) => void;
  placeholderUrl?: string;
  helperText?: string;
  titleValue?: string;
  onTitleChange?: (title: string) => void;
  idPrefix?: string;
}

export const MediaUploadField: React.FC<MediaUploadFieldProps> = ({
  type,
  label,
  value,
  onChange,
  placeholderUrl,
  helperText,
  titleValue,
  onTitleChange,
  idPrefix = 'media'
}) => {
  const getIcon = () => {
    switch (type) {
      case 'image':
        return ImageIcon;
      case 'video':
        return Video;
      case 'pdf':
        return FileDown;
    }
  };

  const handleClear = () => {
    onChange('');
  };

  const IconComponent = getIcon();
  const hasValue = Boolean(value && typeof value === 'string' && value.trim().length > 0);
  const defaultPlaceholder = 'URL de la imagen, video o PDF (ej. https://servidor.ayvi.com/archivo.jpg)';

  return (
    <div className="space-y-2.5 bg-slate-50/80 p-3.5 rounded-2xl border border-slate-200/90 shadow-2xs">
      {/* Header con Etiqueta */}
      <div className="flex items-center justify-between border-b border-slate-200/70 pb-2">
        <label className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
          <IconComponent className="w-4 h-4 text-blue-600 shrink-0" />
          <span>{label}</span>
        </label>
      </div>

      {/* Campo de Entrada de URL Directa */}
      <div className="space-y-1.5">
        <div className="relative flex items-center">
          <Link2 className="w-4 h-4 text-slate-400 absolute left-3.5 pointer-events-none" />
          <input
            id={`${idPrefix}-${type}-url-input`}
            type="url"
            value={value || ''}
            onChange={(e) => onChange(e.target.value)}
            placeholder={placeholderUrl || defaultPlaceholder}
            className="w-full pl-9 pr-3.5 py-2.5 text-xs sm:text-sm font-medium border border-slate-300 rounded-xl bg-white text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 min-h-[42px] transition-all"
          />
        </div>
      </div>

      {/* Vista previa en tiempo real cuando contiene una URL */}
      {hasValue && (
        <div className="p-3 bg-white border border-emerald-200/90 rounded-xl shadow-2xs flex items-center justify-between gap-3 animate-fadeIn">
          <div className="flex items-center gap-3 min-w-0 flex-1">
            {type === 'image' && (
              <img 
                src={value} 
                alt="Vista previa" 
                className="w-11 h-11 rounded-lg object-cover border border-slate-200 shrink-0 shadow-2xs bg-slate-100" 
                onError={(e) => {
                  e.currentTarget.style.display = 'none';
                }}
              />
            )}
            {type === 'video' && (
              <div className="w-11 h-11 rounded-lg bg-blue-900 text-blue-200 flex items-center justify-center shrink-0 shadow-2xs">
                <Video className="w-5 h-5" />
              </div>
            )}
            {type === 'pdf' && (
              <div className="w-11 h-11 rounded-lg bg-emerald-50 text-emerald-700 border border-emerald-200 flex items-center justify-center shrink-0 shadow-2xs">
                <FileCheck className="w-5 h-5" />
              </div>
            )}

            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-1.5">
                <span className="inline-flex items-center gap-0.5 px-2 py-0.5 rounded-md bg-emerald-100 text-emerald-800 text-[10px] font-extrabold uppercase tracking-wider">
                  <Check className="w-3 h-3" />
                  Enlace Web
                </span>
                <span className="text-xs text-emerald-700 font-bold">Vista Previa</span>
              </div>
              <p className="text-xs sm:text-sm font-semibold text-slate-800 truncate mt-0.5">
                {value}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1.5 shrink-0">
            <button
              type="button"
              id={`${idPrefix}-${type}-clear-btn`}
              onClick={handleClear}
              className="p-2 text-rose-500 hover:text-rose-700 hover:bg-rose-50 rounded-xl transition-colors cursor-pointer min-w-[34px] min-h-[34px] flex items-center justify-center focus:outline-none focus:ring-2 focus:ring-rose-500/20 active:scale-95"
              title="Quitar URL"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* Título opcional de botón para PDF */}
      {type === 'pdf' && onTitleChange && (
        <div className="pt-1">
          <label className="block text-xs font-bold text-slate-700 mb-1">
            Texto o Título del Botón de Descarga
          </label>
          <input
            id={`${idPrefix}-pdf-title-input`}
            type="text"
            value={titleValue || ''}
            onChange={(e) => onTitleChange(e.target.value)}
            placeholder="Ej. Descargar Solicitud de Vacaciones (PDF)"
            className="w-full px-4 py-2 text-xs sm:text-sm font-medium border border-slate-300 rounded-xl bg-white text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 min-h-[42px]"
          />
        </div>
      )}

      {/* Texto de ayuda */}
      {helperText && (
        <p className="text-[10px] text-slate-400 font-medium">
          {helperText}
        </p>
      )}
    </div>
  );
};

export default MediaUploadField;
