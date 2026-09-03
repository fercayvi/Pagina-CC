import React, { useState, useRef } from 'react';
import { 
  Upload, Link2, Trash2, Image as ImageIcon, 
  Video, FileDown, AlertCircle, FileCheck, Check, Loader2
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
  const isBase64 = value ? value.startsWith('data:') : false;
  const [mode, setMode] = useState<'upload' | 'url'>(isBase64 || !value ? 'upload' : 'url');
  const [isDragging, setIsDragging] = useState(false);
  const [fileName, setFileName] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string>('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const getAcceptTypes = () => {
    switch (type) {
      case 'image':
        return 'image/*';
      case 'video':
        return 'video/mp4,video/webm,video/ogg,video/*';
      case 'pdf':
        return '.pdf,.doc,.docx,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document';
      default:
        return '*/*';
    }
  };

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

  const getTypeText = () => {
    switch (type) {
      case 'image':
        return 'Imagen / Croquis (Optimización automática en Canvas a 800px máx, JPG 0.6)';
      case 'video':
        return 'Video Tutorial (.MP4, .WebM)';
      case 'pdf':
        return 'Documento Oficial (.PDF, Word)';
    }
  };

  const processFile = (file: File) => {
    setErrorMsg('');
    setIsLoading(true);
    setFileName(file.name);

    if (type === 'image') {
      const reader = new FileReader();
      reader.onerror = () => {
        setIsLoading(false);
        setErrorMsg('Error al leer el archivo de imagen.');
        alert('Error al leer el archivo de imagen');
      };
      reader.onload = (e) => {
        try {
          const rawBase64 = e.target?.result as string;
          const img = new Image();
          img.onerror = () => {
            setIsLoading(false);
            setErrorMsg('Error al decodificar la imagen.');
            alert('Error al procesar la imagen');
          };
          img.onload = () => {
            try {
              const MAX_WIDTH = 800;
              let width = img.width;
              let height = img.height;

              // Calcular dimensiones manteniendo la relación de aspecto
              if (width > MAX_WIDTH) {
                const scale = MAX_WIDTH / width;
                width = MAX_WIDTH;
                height = Math.round(height * scale);
              }

              // Crear canvas offscreen para renderizar y comprimir
              const canvas = document.createElement('canvas');
              canvas.width = width;
              canvas.height = height;

              const ctx = canvas.getContext('2d');
              if (!ctx) {
                throw new Error('No se pudo inicializar el contexto del canvas');
              }

              // Dibujar la imagen redimensionada
              ctx.drawImage(img, 0, 0, width, height);

              // Comprimir en JPEG con calidad 0.6 para proteger el límite de 5MB en localStorage
              const compressedBase64 = canvas.toDataURL('image/jpeg', 0.6);

              setIsLoading(false);
              onChange(compressedBase64, file.name);
            } catch (canvasErr) {
              console.error('Error durante la compresión en canvas:', canvasErr);
              setIsLoading(false);
              setErrorMsg('Error al optimizar la imagen.');
              alert('Error al procesar la imagen');
            }
          };
          img.src = rawBase64;
        } catch (readErr) {
          console.error('Error al procesar la imagen:', readErr);
          setIsLoading(false);
          setErrorMsg('Error al procesar la imagen.');
          alert('Error al procesar la imagen');
        }
      };
      reader.readAsDataURL(file);
    } else {
      // Documentos u otros archivos
      const reader = new FileReader();
      reader.onerror = () => {
        setIsLoading(false);
        setErrorMsg('Error al leer el archivo.');
        alert('Error al leer el archivo');
      };
      reader.onload = (e) => {
        setIsLoading(false);
        const fileBase64 = e.target?.result as string;
        onChange(fileBase64, file.name);

        if (type === 'pdf' && onTitleChange && (!titleValue || titleValue.trim() === '')) {
          const cleanName = file.name.replace(/\.[^/.]+$/, '').replace(/[-_]/g, ' ');
          onTitleChange(`Descargar ${cleanName.charAt(0).toUpperCase() + cleanName.slice(1)}`);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      processFile(file);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) {
      processFile(file);
    }
  };

  const handleClear = () => {
    onChange('', '');
    setFileName('');
    setErrorMsg('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const IconComponent = getIcon();
  const hasValue = Boolean(value && value.trim().length > 0);

  return (
    <div className="space-y-2.5 bg-slate-50/80 p-3.5 rounded-2xl border border-slate-200/90 shadow-2xs">
      {/* Header con Título y Switcher de Modo */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-200/70 pb-2">
        <label className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
          <IconComponent className="w-4 h-4 text-blue-600 shrink-0" />
          <span>{label}</span>
        </label>

        {/* Pestañas de Modo: Subir / URL */}
        <div className="inline-flex p-0.5 bg-slate-200/80 rounded-xl self-start sm:self-auto border border-slate-300/60">
          <button
            type="button"
            id={`${idPrefix}-${type}-mode-upload`}
            onClick={() => setMode('upload')}
            className={`px-2.5 py-1 text-[11px] font-bold rounded-lg transition-all flex items-center gap-1 cursor-pointer ${
              mode === 'upload'
                ? 'bg-white text-blue-700 shadow-2xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Upload className="w-3 h-3" />
            <span>Subir Archivo (Local)</span>
          </button>
          <button
            type="button"
            id={`${idPrefix}-${type}-mode-url`}
            onClick={() => setMode('url')}
            className={`px-2.5 py-1 text-[11px] font-bold rounded-lg transition-all flex items-center gap-1 cursor-pointer ${
              mode === 'url'
                ? 'bg-white text-blue-700 shadow-2xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Link2 className="w-3 h-3" />
            <span>Enlace URL</span>
          </button>
        </div>
      </div>

      {/* Zona de Arrastrar o Input de Archivo */}
      {mode === 'upload' ? (
        <div className="space-y-2">
          <input
            ref={fileInputRef}
            id={`${idPrefix}-${type}-file-input`}
            type="file"
            accept={getAcceptTypes()}
            onChange={handleFileChange}
            className="hidden"
          />

          {!hasValue ? (
            <div
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              onClick={() => !isLoading && fileInputRef.current?.click()}
              className={`p-5 border-2 border-dashed rounded-xl flex flex-col items-center justify-center text-center cursor-pointer transition-all ${
                isLoading
                  ? 'border-blue-300 bg-blue-50/50 cursor-wait'
                  : isDragging 
                  ? 'border-blue-500 bg-blue-50/70 scale-[0.99]' 
                  : 'border-slate-300 hover:border-blue-400 bg-white hover:bg-blue-50/30'
              }`}
            >
              <div className="w-10 h-10 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center mb-2 shadow-2xs">
                {isLoading ? (
                  <Loader2 className="w-5 h-5 animate-spin text-blue-600" />
                ) : (
                  <Upload className="w-5 h-5" />
                )}
              </div>
              <p className="text-xs font-bold text-slate-800">
                {isLoading ? 'Comprimiendo imagen con Canvas...' : 'Haz clic para seleccionar o arrastra la imagen aquí'}
              </p>
              <p className="text-[10px] text-slate-500 mt-0.5 font-medium">
                {isLoading ? 'Optimizando a 800px máx (JPG 0.6)...' : getTypeText()}
              </p>
            </div>
          ) : null}
        </div>
      ) : (
        /* Modo URL Externa */
        <div className="space-y-1.5">
          <div className="relative flex items-center">
            <Link2 className="w-3.5 h-3.5 text-slate-400 absolute left-3 pointer-events-none" />
            <input
              id={`${idPrefix}-${type}-url-input`}
              type="url"
              value={isBase64 ? '' : value}
              onChange={(e) => {
                onChange(e.target.value);
                setFileName('');
              }}
              placeholder={placeholderUrl || (
                type === 'image' 
                  ? 'https://ejemplo.com/imagen.jpg o .png' 
                  : type === 'video'
                  ? 'https://www.youtube.com/watch?v=... o video directo .mp4'
                  : 'https://ejemplo.com/formato_oficial.pdf'
              )}
              className="w-full pl-8 pr-3 py-2 text-xs font-medium border border-slate-200 rounded-xl bg-white text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600"
            />
          </div>
        </div>
      )}

      {/* Vista previa y estado del elemento cargado */}
      {hasValue && (
        <div className="p-2.5 bg-white border border-emerald-200/90 rounded-xl shadow-2xs flex items-center justify-between gap-3 animate-fadeIn">
          <div className="flex items-center gap-2.5 min-w-0 flex-1">
            {type === 'image' && (
              <img 
                src={value} 
                alt="Vista previa" 
                className="w-10 h-10 rounded-lg object-cover border border-slate-200 shrink-0 shadow-2xs" 
              />
            )}
            {type === 'video' && (
              <div className="w-10 h-10 rounded-lg bg-blue-900 text-blue-200 flex items-center justify-center shrink-0 shadow-2xs">
                <Video className="w-5 h-5" />
              </div>
            )}
            {type === 'pdf' && (
              <div className="w-10 h-10 rounded-lg bg-emerald-50 text-emerald-700 border border-emerald-200 flex items-center justify-center shrink-0 shadow-2xs">
                <FileCheck className="w-5 h-5" />
              </div>
            )}

            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-1.5">
                <span className="inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded-md bg-emerald-100 text-emerald-800 text-[9px] font-extrabold uppercase tracking-wider">
                  <Check className="w-2.5 h-2.5" />
                  {isBase64 ? 'Local Optimizado' : 'Enlace Web'}
                </span>
                <span className="text-[10px] text-emerald-700 font-bold">Listo</span>
              </div>
              <p className="text-xs font-semibold text-slate-800 truncate mt-0.5">
                {fileName || (isBase64 ? 'Imagen comprimida para localStorage' : value)}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1 shrink-0">
            {mode === 'upload' && (
              <button
                type="button"
                id={`${idPrefix}-${type}-replace-btn`}
                disabled={isLoading}
                onClick={() => fileInputRef.current?.click()}
                className="px-2 py-1 text-[11px] font-bold text-blue-700 hover:bg-blue-50 rounded-lg transition-colors cursor-pointer border border-blue-200/80 disabled:opacity-50"
              >
                {isLoading ? 'Optimizando...' : 'Cambiar'}
              </button>
            )}
            <button
              type="button"
              id={`${idPrefix}-${type}-clear-btn`}
              onClick={handleClear}
              className="p-1.5 text-rose-500 hover:text-rose-700 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
              title="Quitar recurso y dejar limpio"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* Título opcional de botón para PDF */}
      {type === 'pdf' && onTitleChange && (
        <div className="pt-1">
          <label className="block text-[11px] font-bold text-slate-700 mb-1">
            Texto o Título del Botón de Descarga
          </label>
          <input
            id={`${idPrefix}-pdf-title-input`}
            type="text"
            value={titleValue || ''}
            onChange={(e) => onTitleChange(e.target.value)}
            placeholder="Ej. Descargar Solicitud de Vacaciones (PDF)"
            className="w-full px-3 py-1.5 text-xs font-medium border border-slate-200 rounded-xl bg-white text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600"
          />
        </div>
      )}

      {/* Mensaje de error */}
      {errorMsg && (
        <div className="p-2.5 bg-rose-50 border border-rose-200 rounded-xl text-[11px] text-rose-700 flex items-start gap-1.5 font-medium">
          <AlertCircle className="w-3.5 h-3.5 text-rose-600 shrink-0 mt-0.5" />
          <span>{errorMsg}</span>
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
