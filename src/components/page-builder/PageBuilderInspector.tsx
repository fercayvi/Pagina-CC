import React from 'react';
import { 
  X, 
  Trash2, 
  Copy, 
  ArrowUp, 
  ArrowDown, 
  Image as ImageIcon, 
  Video, 
  FileDown, 
  Type, 
  Columns, 
  AlertTriangle, 
  HelpCircle, 
  AlignLeft, 
  AlignCenter, 
  AlignRight, 
  Maximize2, 
  Sliders, 
  Check, 
  Plus,
  Info,
  Layers,
  Sparkles
} from 'lucide-react';
import { 
  LayoutBlock, 
  TextLayoutBlock, 
  MediaLayoutBlock, 
  AlertLayoutBlock, 
  FAQLayoutBlock, 
  ColumnsLayoutBlock 
} from '../../types';
import { MediaUploadField } from '../MediaUploadField';

interface PageBuilderInspectorProps {
  selectedBlock: LayoutBlock | null;
  onUpdateBlock: (updated: LayoutBlock) => void;
  onDeleteBlock: (blockId: string) => void;
  onDuplicateBlock: (blockId: string) => void;
  onMoveBlock: (blockId: string, direction: 'up' | 'down') => void;
  onDeselect: () => void;
  totalBlocks: number;
  serviceTitle?: string;
  onAddBlock: (type: any) => void;
  onClearCanvas: () => void;
}

export const PageBuilderInspector: React.FC<PageBuilderInspectorProps> = ({
  selectedBlock,
  onUpdateBlock,
  onDeleteBlock,
  onDuplicateBlock,
  onMoveBlock,
  onDeselect,
  totalBlocks,
  serviceTitle,
  onAddBlock,
  onClearCanvas
}) => {
  // If NO block is selected: show Page-level settings and quick guides
  if (!selectedBlock) {
    return (
      <aside className="w-full h-full bg-gray-50 border-l border-slate-200 flex flex-col overflow-hidden select-none">
        <div className="p-4 border-b border-slate-200/80 bg-gray-50/50">
          <div className="flex items-center gap-1.5 text-slate-700">
            <Sliders className="w-4 h-4 text-blue-600" />
            <span className="text-[11px] font-bold uppercase tracking-wider">Inspector de Página</span>
          </div>
          <h3 className="text-xs font-bold text-slate-900 mt-1 truncate">
            {serviceTitle || 'Página de Trámite'}
          </h3>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-5 custom-scrollbar">
          {/* Quick instructions */}
          <div className="bg-white border border-slate-200 rounded-xl p-3.5 space-y-2 shadow-2xs">
            <div className="flex items-center gap-1.5 text-blue-700 font-bold text-xs">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Lienzo WYSIWYG Activo</span>
            </div>
            <p className="text-xs text-slate-600 leading-relaxed">
              Haz clic en cualquier bloque o imagen en el lienzo central para abrir aquí sus ajustes contextuales (alineación, tamaños, enlaces o estilos).
            </p>
          </div>

          {/* Page Stats */}
          <div className="space-y-2">
            <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400">
              Estado de la Página
            </span>
            <div className="bg-white border border-slate-200 rounded-xl p-3 space-y-2 text-xs">
              <div className="flex items-center justify-between text-slate-600">
                <span>Total de bloques:</span>
                <span className="font-bold text-slate-900 bg-slate-100 px-2 py-0.5 rounded-md">
                  {totalBlocks}
                </span>
              </div>
              <div className="flex items-center justify-between text-slate-600">
                <span>Modo de edición:</span>
                <span className="font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md">
                  Directo / Live
                </span>
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="space-y-2">
            <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400">
              Acciones Rápidas
            </span>
            <div className="space-y-1.5">
              <button
                type="button"
                onClick={() => onAddBlock('text')}
                className="w-full text-left px-3 py-2 bg-white hover:bg-blue-50/50 hover:text-blue-700 border border-slate-200 rounded-xl text-xs font-semibold transition-all flex items-center justify-between cursor-pointer"
              >
                <span>+ Añadir Bloque de Texto</span>
                <Type className="w-3.5 h-3.5 text-blue-600" />
              </button>
              <button
                type="button"
                onClick={() => onAddBlock('columns-2')}
                className="w-full text-left px-3 py-2 bg-white hover:bg-blue-50/50 hover:text-blue-700 border border-slate-200 rounded-xl text-xs font-semibold transition-all flex items-center justify-between cursor-pointer"
              >
                <span>+ Añadir 2 Columnas</span>
                <Columns className="w-3.5 h-3.5 text-indigo-600" />
              </button>
              <button
                type="button"
                onClick={() => onAddBlock('image')}
                className="w-full text-left px-3 py-2 bg-white hover:bg-blue-50/50 hover:text-blue-700 border border-slate-200 rounded-xl text-xs font-semibold transition-all flex items-center justify-between cursor-pointer"
              >
                <span>+ Añadir Imagen</span>
                <ImageIcon className="w-3.5 h-3.5 text-emerald-600" />
              </button>
            </div>
          </div>

          {totalBlocks > 0 && (
            <div className="pt-2">
              <button
                type="button"
                onClick={onClearCanvas}
                className="w-full px-3 py-2 bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Vaciar Todo el Lienzo</span>
              </button>
            </div>
          )}
        </div>
      </aside>
    );
  }

  // A block IS selected: show contextual inspector
  const blockType = selectedBlock.type;

  return (
    <aside className="w-full h-full bg-gray-50 border-l border-slate-200 flex flex-col overflow-hidden">
      {/* Inspector Header */}
      <div className="p-3.5 border-b border-slate-200/80 bg-white flex items-center justify-between gap-2 shrink-0">
        <div className="flex items-center gap-2 min-w-0">
          <div className="w-7 h-7 rounded-lg bg-blue-50 text-blue-600 border border-blue-100 flex items-center justify-center shrink-0">
            {blockType === 'text' && <Type className="w-4 h-4" />}
            {blockType === 'media' && <ImageIcon className="w-4 h-4" />}
            {blockType === 'columns' && <Columns className="w-4 h-4" />}
            {blockType === 'alert' && <AlertTriangle className="w-4 h-4" />}
            {blockType === 'faq' && <HelpCircle className="w-4 h-4" />}
          </div>
          <div className="min-w-0">
            <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400 block leading-none">
              Propiedades
            </span>
            <h3 className="text-xs font-bold text-slate-800 truncate capitalize mt-0.5">
              {blockType === 'text' && 'Bloque de Texto'}
              {blockType === 'media' && ((selectedBlock as MediaLayoutBlock).mediaType === 'video' ? 'Video Tutorial' : (selectedBlock as MediaLayoutBlock).mediaType === 'pdf' ? 'Documento PDF' : 'Imagen / Infografía')}
              {blockType === 'columns' && 'Contenedor Multicolumna'}
              {blockType === 'alert' && 'Aviso Destacado'}
              {blockType === 'faq' && 'Preguntas Frecuentes'}
            </h3>
          </div>
        </div>

        <button
          type="button"
          onClick={onDeselect}
          className="p-1 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
          title="Cerrar inspector"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Scrollable Inspector Body */}
      <div className="flex-1 overflow-y-auto p-4 space-y-5 custom-scrollbar">

        {/* ==================== 1. TEXT PROPERTIES ==================== */}
        {blockType === 'text' && (() => {
          const textBlock = selectedBlock as TextLayoutBlock;
          return (
            <div className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700">Alineación del Texto</label>
                <div className="grid grid-cols-3 gap-1 bg-white p-1 rounded-xl border border-slate-200">
                  <button
                    type="button"
                    onClick={() => onUpdateBlock({ ...textBlock, align: 'left' })}
                    className={`py-1.5 rounded-lg text-xs font-semibold flex items-center justify-center gap-1 transition-all cursor-pointer ${
                      textBlock.align === 'left' || !textBlock.align ? 'bg-blue-600 text-white shadow-2xs' : 'text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    <AlignLeft className="w-3.5 h-3.5" />
                    <span>Izq</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => onUpdateBlock({ ...textBlock, align: 'center' })}
                    className={`py-1.5 rounded-lg text-xs font-semibold flex items-center justify-center gap-1 transition-all cursor-pointer ${
                      textBlock.align === 'center' ? 'bg-blue-600 text-white shadow-2xs' : 'text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    <AlignCenter className="w-3.5 h-3.5" />
                    <span>Centro</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => onUpdateBlock({ ...textBlock, align: 'right' })}
                    className={`py-1.5 rounded-lg text-xs font-semibold flex items-center justify-center gap-1 transition-all cursor-pointer ${
                      textBlock.align === 'right' ? 'bg-blue-600 text-white shadow-2xs' : 'text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    <AlignRight className="w-3.5 h-3.5" />
                    <span>Der</span>
                  </button>
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700">Estilo Tipográfico</label>
                <select
                  value={textBlock.style || 'normal'}
                  onChange={(e) => onUpdateBlock({ ...textBlock, style: e.target.value as any })}
                  className="w-full px-3 py-2 text-xs font-medium border border-slate-300 rounded-xl bg-white text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                >
                  <option value="normal">Párrafo Estándar (14-16px)</option>
                  <option value="lead">Texto Destacado / Subtítulo (18px)</option>
                  <option value="heading">Encabezado de Sección (20px)</option>
                </select>
              </div>

              <div className="p-3 bg-blue-50/60 border border-blue-100 rounded-xl space-y-1">
                <p className="text-[11px] font-bold text-blue-900">✍️ Edición directa en el lienzo:</p>
                <p className="text-[11px] text-blue-700/80 leading-relaxed">
                  Haz clic sobre el texto dentro del lienzo central para escribir libremente o seleccionar palabras y aplicar negrita o viñetas.
                </p>
              </div>
            </div>
          );
        })()}

        {/* ==================== 2. MEDIA PROPERTIES (IMAGE / VIDEO / PDF) ==================== */}
        {blockType === 'media' && (() => {
          const mediaBlock = selectedBlock as MediaLayoutBlock;
          const mediaType = mediaBlock.mediaType || 'image';

          return (
            <div className="space-y-4">
              {/* Media Type Switcher */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700">Tipo de Medio</label>
                <div className="grid grid-cols-3 gap-1 bg-white p-1 rounded-xl border border-slate-200">
                  <button
                    type="button"
                    onClick={() => onUpdateBlock({ ...mediaBlock, mediaType: 'image' })}
                    className={`py-1.5 rounded-lg text-xs font-semibold flex items-center justify-center gap-1 transition-all cursor-pointer ${
                      mediaType === 'image' ? 'bg-blue-600 text-white shadow-2xs' : 'text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    <ImageIcon className="w-3.5 h-3.5" />
                    <span>Imagen</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => onUpdateBlock({ ...mediaBlock, mediaType: 'video' })}
                    className={`py-1.5 rounded-lg text-xs font-semibold flex items-center justify-center gap-1 transition-all cursor-pointer ${
                      mediaType === 'video' ? 'bg-blue-600 text-white shadow-2xs' : 'text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    <Video className="w-3.5 h-3.5" />
                    <span>Video</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => onUpdateBlock({ ...mediaBlock, mediaType: 'pdf' })}
                    className={`py-1.5 rounded-lg text-xs font-semibold flex items-center justify-center gap-1 transition-all cursor-pointer ${
                      mediaType === 'pdf' ? 'bg-blue-600 text-white shadow-2xs' : 'text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    <FileDown className="w-3.5 h-3.5" />
                    <span>PDF</span>
                  </button>
                </div>
              </div>

              {/* Upload Field */}
              <div className="space-y-2">
                <MediaUploadField
                  type={mediaType}
                  label={mediaType === 'image' ? 'Subir o Enlazar Imagen' : mediaType === 'video' ? 'Video Tutorial' : 'Documento Descargable (PDF)'}
                  value={mediaBlock.url || ''}
                  onChange={(val) => onUpdateBlock({ ...mediaBlock, url: val })}
                  titleValue={mediaBlock.title || ''}
                  onTitleChange={(title) => onUpdateBlock({ ...mediaBlock, title })}
                  placeholderUrl={mediaType === 'image' ? 'https://ejemplo.com/infografia.png' : mediaType === 'video' ? 'https://www.youtube.com/watch?v=...' : 'https://ejemplo.com/formato.pdf'}
                  helperText={mediaType === 'image' ? 'Carga una imagen local de tu equipo o pega un enlace web directo.' : mediaType === 'video' ? 'Soporta YouTube, Vimeo o MP4 local.' : 'Documento descargable para el colaborador.'}
                  idPrefix={`inspector-${mediaBlock.id}`}
                />
              </div>

              {/* Image specific layout controls: Alignment & Size */}
              {mediaType === 'image' && (
                <>
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-700">Alineación de la Imagen</label>
                    <div className="grid grid-cols-3 gap-1 bg-white p-1 rounded-xl border border-slate-200">
                      <button
                        type="button"
                        onClick={() => onUpdateBlock({ ...mediaBlock, alignment: 'left' })}
                        className={`py-1.5 rounded-lg text-xs font-semibold flex items-center justify-center gap-1 transition-all cursor-pointer ${
                          mediaBlock.alignment === 'left' ? 'bg-blue-600 text-white shadow-2xs' : 'text-slate-600 hover:bg-slate-50'
                        }`}
                      >
                        <AlignLeft className="w-3.5 h-3.5" />
                        <span>Izq</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => onUpdateBlock({ ...mediaBlock, alignment: 'center' })}
                        className={`py-1.5 rounded-lg text-xs font-semibold flex items-center justify-center gap-1 transition-all cursor-pointer ${
                          mediaBlock.alignment === 'center' || !mediaBlock.alignment ? 'bg-blue-600 text-white shadow-2xs' : 'text-slate-600 hover:bg-slate-50'
                        }`}
                      >
                        <AlignCenter className="w-3.5 h-3.5" />
                        <span>Centro</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => onUpdateBlock({ ...mediaBlock, alignment: 'right' })}
                        className={`py-1.5 rounded-lg text-xs font-semibold flex items-center justify-center gap-1 transition-all cursor-pointer ${
                          mediaBlock.alignment === 'right' ? 'bg-blue-600 text-white shadow-2xs' : 'text-slate-600 hover:bg-slate-50'
                        }`}
                      >
                        <AlignRight className="w-3.5 h-3.5" />
                        <span>Der</span>
                      </button>
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-700">Tamaño en Pantalla</label>
                    <div className="grid grid-cols-3 gap-1 bg-white p-1 rounded-xl border border-slate-200">
                      <button
                        type="button"
                        onClick={() => onUpdateBlock({ ...mediaBlock, size: 'small' })}
                        className={`py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                          mediaBlock.size === 'small' ? 'bg-blue-600 text-white shadow-2xs' : 'text-slate-600 hover:bg-slate-50'
                        }`}
                      >
                        Chico
                      </button>
                      <button
                        type="button"
                        onClick={() => onUpdateBlock({ ...mediaBlock, size: 'medium' })}
                        className={`py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                          mediaBlock.size === 'medium' ? 'bg-blue-600 text-white shadow-2xs' : 'text-slate-600 hover:bg-slate-50'
                        }`}
                      >
                        Mediano
                      </button>
                      <button
                        type="button"
                        onClick={() => onUpdateBlock({ ...mediaBlock, size: 'full' })}
                        className={`py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                          mediaBlock.size === 'full' || !mediaBlock.size ? 'bg-blue-600 text-white shadow-2xs' : 'text-slate-600 hover:bg-slate-50'
                        }`}
                      >
                        Completo
                      </button>
                    </div>
                  </div>
                </>
              )}

              {/* Caption */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700">Pie de Foto o Descripción</label>
                <input
                  type="text"
                  value={mediaBlock.caption || ''}
                  onChange={(e) => onUpdateBlock({ ...mediaBlock, caption: e.target.value })}
                  placeholder="Ej. Diagrama del flujo de entrega de documentos"
                  className="w-full px-3 py-2 text-xs font-medium border border-slate-300 rounded-xl bg-white text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                />
              </div>
            </div>
          );
        })()}

        {/* ==================== 3. COLUMNS / CONTAINER PROPERTIES ==================== */}
        {blockType === 'columns' && (() => {
          const colsBlock = selectedBlock as ColumnsLayoutBlock;
          return (
            <div className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700">Distribución de Columnas</label>
                <div className="space-y-1.5">
                  <button
                    type="button"
                    onClick={() => {
                      // Adjust to 2 equal columns
                      let cols = colsBlock.columns || [];
                      if (cols.length < 2) {
                        cols = [
                          cols[0] || { id: `col_1_${Date.now()}`, blocks: [] },
                          { id: `col_2_${Date.now()}`, blocks: [] }
                        ];
                      }
                      onUpdateBlock({ ...colsBlock, columnsCount: 2, layout: 'equal', columns: cols.slice(0, 2) });
                    }}
                    className={`w-full p-2.5 rounded-xl border text-xs font-semibold flex items-center justify-between transition-all cursor-pointer ${
                      colsBlock.columnsCount === 2 && colsBlock.layout === 'equal'
                        ? 'bg-blue-50 border-blue-400 text-blue-800'
                        : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
                    }`}
                  >
                    <span>2 Columnas Iguales (50% / 50%)</span>
                    <div className="flex gap-1">
                      <span className="w-4 h-3 bg-blue-300 rounded-xs" />
                      <span className="w-4 h-3 bg-blue-300 rounded-xs" />
                    </div>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      // Adjust to 3 equal columns
                      let cols = colsBlock.columns || [];
                      while (cols.length < 3) {
                        cols.push({ id: `col_${cols.length + 1}_${Date.now()}`, blocks: [] });
                      }
                      onUpdateBlock({ ...colsBlock, columnsCount: 3, layout: 'equal', columns: cols.slice(0, 3) });
                    }}
                    className={`w-full p-2.5 rounded-xl border text-xs font-semibold flex items-center justify-between transition-all cursor-pointer ${
                      colsBlock.columnsCount === 3
                        ? 'bg-blue-50 border-blue-400 text-blue-800'
                        : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
                    }`}
                  >
                    <span>3 Columnas Iguales (33% / 33% / 33%)</span>
                    <div className="flex gap-1">
                      <span className="w-3 h-3 bg-blue-300 rounded-xs" />
                      <span className="w-3 h-3 bg-blue-300 rounded-xs" />
                      <span className="w-3 h-3 bg-blue-300 rounded-xs" />
                    </div>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      let cols = colsBlock.columns || [];
                      if (cols.length < 2) {
                        cols = [
                          cols[0] || { id: `col_1_${Date.now()}`, blocks: [] },
                          { id: `col_2_${Date.now()}`, blocks: [] }
                        ];
                      }
                      onUpdateBlock({ ...colsBlock, columnsCount: 2, layout: '1-2', columns: cols.slice(0, 2) });
                    }}
                    className={`w-full p-2.5 rounded-xl border text-xs font-semibold flex items-center justify-between transition-all cursor-pointer ${
                      colsBlock.columnsCount === 2 && colsBlock.layout === '1-2'
                        ? 'bg-blue-50 border-blue-400 text-blue-800'
                        : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
                    }`}
                  >
                    <span>Asimétrica (33% / 67%)</span>
                    <div className="flex gap-1">
                      <span className="w-2.5 h-3 bg-blue-300 rounded-xs" />
                      <span className="w-5 h-3 bg-blue-300 rounded-xs" />
                    </div>
                  </button>
                </div>
              </div>

              <div className="p-3 bg-slate-100 rounded-xl space-y-1">
                <p className="text-[11px] font-bold text-slate-700">Organización de Bloques:</p>
                <p className="text-[11px] text-slate-500 leading-snug">
                  Arrastra cualquier bloque desde la librería o desde el lienzo directamente hacia una de las columnas.
                </p>
              </div>
            </div>
          );
        })()}

        {/* ==================== 4. ALERT PROPERTIES ==================== */}
        {blockType === 'alert' && (() => {
          const alertBlock = selectedBlock as AlertLayoutBlock;
          return (
            <div className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700">Nivel de Aviso</label>
                <div className="grid grid-cols-2 gap-1.5">
                  <button
                    type="button"
                    onClick={() => onUpdateBlock({ ...alertBlock, level: 'info' })}
                    className={`p-2 rounded-xl border text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                      alertBlock.level === 'info' ? 'bg-blue-600 text-white border-blue-700 shadow-2xs' : 'bg-white border-slate-200 text-blue-700 hover:bg-blue-50'
                    }`}
                  >
                    <Info className="w-3.5 h-3.5" />
                    <span>Informativo</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => onUpdateBlock({ ...alertBlock, level: 'warning' })}
                    className={`p-2 rounded-xl border text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                      alertBlock.level === 'warning' ? 'bg-amber-500 text-white border-amber-600 shadow-2xs' : 'bg-white border-slate-200 text-amber-700 hover:bg-amber-50'
                    }`}
                  >
                    <AlertTriangle className="w-3.5 h-3.5" />
                    <span>Advertencia</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => onUpdateBlock({ ...alertBlock, level: 'danger' })}
                    className={`p-2 rounded-xl border text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                      alertBlock.level === 'danger' ? 'bg-rose-600 text-white border-rose-700 shadow-2xs' : 'bg-white border-slate-200 text-rose-700 hover:bg-rose-50'
                    }`}
                  >
                    <AlertTriangle className="w-3.5 h-3.5" />
                    <span>Importante</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => onUpdateBlock({ ...alertBlock, level: 'success' })}
                    className={`p-2 rounded-xl border text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                      alertBlock.level === 'success' ? 'bg-emerald-600 text-white border-emerald-700 shadow-2xs' : 'bg-white border-slate-200 text-emerald-700 hover:bg-emerald-50'
                    }`}
                  >
                    <Check className="w-3.5 h-3.5" />
                    <span>Éxito</span>
                  </button>
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700">Título de la Alerta</label>
                <input
                  type="text"
                  value={alertBlock.title || ''}
                  onChange={(e) => onUpdateBlock({ ...alertBlock, title: e.target.value })}
                  placeholder="Ej. Aviso Importante"
                  className="w-full px-3 py-2 text-xs font-medium border border-slate-300 rounded-xl bg-white text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700">Mensaje de la Alerta</label>
                <textarea
                  rows={3}
                  value={alertBlock.message}
                  onChange={(e) => onUpdateBlock({ ...alertBlock, message: e.target.value })}
                  placeholder="Escribe el mensaje..."
                  className="w-full px-3 py-2 text-xs font-medium border border-slate-300 rounded-xl bg-white text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500/20 leading-relaxed"
                />
              </div>
            </div>
          );
        })()}

        {/* ==================== 5. FAQ PROPERTIES ==================== */}
        {blockType === 'faq' && (() => {
          const faqBlock = selectedBlock as FAQLayoutBlock;
          return (
            <div className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700">Título del Módulo de FAQs</label>
                <input
                  type="text"
                  value={faqBlock.title || ''}
                  onChange={(e) => onUpdateBlock({ ...faqBlock, title: e.target.value })}
                  placeholder="Preguntas Frecuentes"
                  className="w-full px-3 py-2 text-xs font-medium border border-slate-300 rounded-xl bg-white text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                />
              </div>

              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-700">Preguntas ({faqBlock.items?.length || 0})</span>
                  <button
                    type="button"
                    onClick={() => {
                      const newItems = [...(faqBlock.items || []), { q: 'Nueva pregunta frecuente', a: 'Respuesta explicativa...' }];
                      onUpdateBlock({ ...faqBlock, items: newItems });
                    }}
                    className="px-2 py-1 bg-blue-50 hover:bg-blue-100 text-blue-700 rounded-lg text-xs font-bold flex items-center gap-1 cursor-pointer"
                  >
                    <Plus className="w-3 h-3" />
                    <span>Agregar</span>
                  </button>
                </div>

                <div className="space-y-2">
                  {faqBlock.items?.map((item, idx) => (
                    <div key={idx} className="bg-white border border-slate-200 rounded-xl p-2.5 space-y-1.5">
                      <div className="flex items-center justify-between gap-1">
                        <span className="text-[10px] font-bold text-slate-400">Pregunta #{idx + 1}</span>
                        <button
                          type="button"
                          onClick={() => {
                            const newItems = faqBlock.items.filter((_, i) => i !== idx);
                            onUpdateBlock({ ...faqBlock, items: newItems });
                          }}
                          className="text-slate-400 hover:text-rose-600 p-0.5 cursor-pointer"
                        >
                          <Trash2 className="w-3 h-3" />
                        </button>
                      </div>
                      <input
                        type="text"
                        value={item.q}
                        onChange={(e) => {
                          const newItems = [...faqBlock.items];
                          newItems[idx] = { ...newItems[idx], q: e.target.value };
                          onUpdateBlock({ ...faqBlock, items: newItems });
                        }}
                        placeholder="Pregunta..."
                        className="w-full px-2 py-1 text-xs font-medium border border-slate-200 rounded-lg bg-slate-50"
                      />
                      <textarea
                        rows={2}
                        value={item.a}
                        onChange={(e) => {
                          const newItems = [...faqBlock.items];
                          newItems[idx] = { ...newItems[idx], a: e.target.value };
                          onUpdateBlock({ ...faqBlock, items: newItems });
                        }}
                        placeholder="Respuesta..."
                        className="w-full px-2 py-1 text-xs font-medium border border-slate-200 rounded-lg bg-slate-50"
                      />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          );
        })()}

      </div>

      {/* Inspector Actions Footer */}
      <div className="p-3 border-t border-slate-200 bg-white space-y-2 shrink-0">
        <div className="grid grid-cols-3 gap-1.5">
          <button
            type="button"
            onClick={() => onMoveBlock(selectedBlock.id, 'up')}
            className="px-2 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1 cursor-pointer"
            title="Mover arriba"
          >
            <ArrowUp className="w-3.5 h-3.5" />
            <span>Subir</span>
          </button>
          <button
            type="button"
            onClick={() => onMoveBlock(selectedBlock.id, 'down')}
            className="px-2 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1 cursor-pointer"
            title="Mover abajo"
          >
            <ArrowDown className="w-3.5 h-3.5" />
            <span>Bajar</span>
          </button>
          <button
            type="button"
            onClick={() => onDuplicateBlock(selectedBlock.id)}
            className="px-2 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1 cursor-pointer"
            title="Duplicar bloque"
          >
            <Copy className="w-3.5 h-3.5" />
            <span>Clonar</span>
          </button>
        </div>

        <button
          type="button"
          onClick={() => onDeleteBlock(selectedBlock.id)}
          className="w-full px-3 py-2 bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer"
        >
          <Trash2 className="w-3.5 h-3.5" />
          <span>Eliminar Bloque</span>
        </button>
      </div>
    </aside>
  );
};
