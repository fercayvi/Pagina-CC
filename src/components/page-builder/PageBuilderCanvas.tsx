import React from 'react';
import { useDroppable } from '@dnd-kit/core';
import { 
  Plus, 
  Trash2, 
  Copy, 
  ArrowUp, 
  ArrowDown, 
  GripVertical, 
  Image as ImageIcon, 
  Video, 
  FileDown, 
  Type, 
  Columns, 
  LayoutGrid,
  AlertTriangle, 
  HelpCircle, 
  ExternalLink, 
  Download, 
  Check, 
  Info,
  ChevronDown,
  Layers,
  Sparkles
} from 'lucide-react';
import { 
  LayoutBlock, 
  TextLayoutBlock, 
  MediaLayoutBlock, 
  AlertLayoutBlock, 
  FAQLayoutBlock, 
  ColumnsLayoutBlock,
  ColumnSlot
} from '../../types';
import { InlineTextBlock } from './InlineTextBlock';

interface PageBuilderCanvasProps {
  blocks: LayoutBlock[];
  selectedBlockId: string | null;
  onSelectBlock: (blockId: string | null) => void;
  onUpdateBlock: (updated: LayoutBlock) => void;
  onDeleteBlock: (blockId: string) => void;
  onDuplicateBlock: (blockId: string) => void;
  onMoveBlock: (blockId: string, direction: 'up' | 'down') => void;
  onAddBlockAt: (type: any, index: number) => void;
  serviceTitle?: string;
  deviceView?: 'desktop' | 'tablet' | 'mobile';
  previewMode?: boolean;
}

// Drop slot line indicator between blocks
const DropZoneIndicator: React.FC<{ id: string; index: number; onAddBlockAt: (type: any, index: number) => void }> = ({
  id,
  index,
  onAddBlockAt
}) => {
  const { setNodeRef, isOver } = useDroppable({
    id,
    data: { dropIndex: index }
  });

  return (
    <div
      ref={setNodeRef}
      className={`transition-all duration-150 relative py-1 ${
        isOver ? 'py-3' : 'hover:py-2'
      }`}
    >
      <div
        className={`w-full transition-all flex items-center justify-center rounded-full ${
          isOver 
            ? 'h-2 bg-blue-500 ring-4 ring-blue-400/30 animate-pulse shadow-sm' 
            : 'h-0.5 bg-transparent hover:bg-blue-300'
        }`}
      >
        {isOver && (
          <span className="bg-blue-600 text-white text-[10px] font-bold px-2 py-0.5 rounded-full shadow-xs">
            Soltar aquí
          </span>
        )}
      </div>
    </div>
  );
};

// Nested Column Droppable Zone
const NestedColumnDroppable: React.FC<{
  column: ColumnSlot;
  columnIndex: number;
  parentBlockId: string;
  selectedBlockId: string | null;
  onSelectBlock: (id: string | null) => void;
  onUpdateBlock: (updated: LayoutBlock) => void;
  onDeleteNestedBlock: (parentBlockId: string, colId: string, blockId: string) => void;
  previewMode?: boolean;
}> = ({
  column,
  columnIndex,
  parentBlockId,
  selectedBlockId,
  onSelectBlock,
  onUpdateBlock,
  onDeleteNestedBlock,
  previewMode
}) => {
  const droppableId = `col-drop-${parentBlockId}-${column.id}`;
  const { setNodeRef, isOver } = useDroppable({
    id: droppableId,
    data: {
      isColumnDrop: true,
      parentBlockId,
      columnId: column.id
    }
  });

  return (
    <div
      ref={setNodeRef}
      className={`min-h-[140px] rounded-xl transition-all p-3 space-y-3 ${
        isOver
          ? 'bg-blue-50/70 border-2 border-dashed border-blue-500 ring-2 ring-blue-400/30'
          : previewMode 
            ? 'border-0' 
            : 'border border-dashed border-slate-200 bg-slate-50/50 hover:border-slate-300'
      }`}
    >
      {!previewMode && (
        <div className="flex items-center justify-between text-[10px] font-bold text-slate-400 uppercase tracking-wider px-1">
          <span>Columna #{columnIndex + 1}</span>
          <span className="text-slate-300">{column.blocks?.length || 0} elementos</span>
        </div>
      )}

      {/* Render blocks inside this column */}
      {column.blocks && column.blocks.length > 0 ? (
        <div className="space-y-3">
          {column.blocks.map((childBlock) => {
            const isChildSelected = selectedBlockId === childBlock.id;

            return (
              <div
                key={childBlock.id}
                onClick={(e) => {
                  e.stopPropagation();
                  onSelectBlock(childBlock.id);
                }}
                className={`relative bg-white rounded-xl p-3.5 transition-all shadow-2xs border ${
                  isChildSelected
                    ? 'border-blue-500 ring-2 ring-blue-500/30 shadow-sm'
                    : 'border-slate-200 hover:border-slate-300'
                }`}
              >
                {/* Action button inside column */}
                {!previewMode && isChildSelected && (
                  <div className="absolute -top-3 right-2 flex items-center gap-1 bg-slate-900 text-white rounded-lg px-2 py-0.5 shadow-md text-[10px] font-bold z-10">
                    <span className="uppercase text-slate-300">{childBlock.type}</span>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        onDeleteNestedBlock(parentBlockId, column.id, childBlock.id);
                      }}
                      className="ml-1 text-slate-400 hover:text-rose-400"
                      title="Eliminar de la columna"
                    >
                      <Trash2 className="w-3 h-3" />
                    </button>
                  </div>
                )}

                {/* Inline text inside column */}
                {childBlock.type === 'text' && (
                  <InlineTextBlock
                    block={childBlock as TextLayoutBlock}
                    onChange={(updated) => onUpdateBlock(updated)}
                    isSelected={isChildSelected && !previewMode}
                    readOnly={previewMode}
                  />
                )}

                {/* Image inside column */}
                {childBlock.type === 'media' && (() => {
                  const m = childBlock as MediaLayoutBlock;
                  return m.url ? (
                    <img 
                      src={m.url} 
                      alt={m.title || 'Foto'} 
                      className="w-full rounded-lg object-contain max-h-48 mx-auto" 
                    />
                  ) : (
                    <div className="p-4 bg-slate-50 border border-dashed border-slate-200 rounded-lg text-center text-xs text-slate-400">
                      Sin imagen (haz clic para configurar)
                    </div>
                  );
                })()}

                {/* Alert inside column */}
                {childBlock.type === 'alert' && (() => {
                  const alt = childBlock as AlertLayoutBlock;
                  return (
                    <div className="p-3 bg-amber-50 border border-amber-200 rounded-lg text-xs text-amber-900">
                      <p className="font-bold">{alt.title || 'Aviso'}</p>
                      <p className="mt-0.5">{alt.message || 'Sin mensaje'}</p>
                    </div>
                  );
                })()}
              </div>
            );
          })}
        </div>
      ) : (
        !previewMode && (
          <div className="h-24 flex flex-col items-center justify-center text-center p-2 rounded-lg border border-dashed border-slate-200 text-slate-400 hover:text-blue-600 transition-colors">
            <Plus className="w-4 h-4 mb-1 text-slate-300" />
            <p className="text-[11px] font-medium">Soltar bloque aquí</p>
          </div>
        )
      )}
    </div>
  );
};

export const PageBuilderCanvas: React.FC<PageBuilderCanvasProps> = ({
  blocks,
  selectedBlockId,
  onSelectBlock,
  onUpdateBlock,
  onDeleteBlock,
  onDuplicateBlock,
  onMoveBlock,
  onAddBlockAt,
  serviceTitle,
  deviceView = 'desktop',
  previewMode = false
}) => {
  // Canvas width based on simulated viewport
  const containerWidthClass = 
    deviceView === 'mobile' ? 'max-w-sm' :
    deviceView === 'tablet' ? 'max-w-xl' :
    'max-w-3xl';

  return (
    <div 
      className="flex-1 bg-slate-100 flex justify-center p-4 sm:p-6 lg:p-8 overflow-y-auto custom-scrollbar select-text"
      onClick={() => onSelectBlock(null)} // Deselect when clicking blank canvas background
    >
      <div 
        className={`${containerWidthClass} w-full bg-white shadow-md border border-slate-200/90 rounded-2xl p-6 sm:p-8 transition-all min-h-[650px] relative h-fit space-y-4`}
        onClick={(e) => e.stopPropagation()} // Keep click within canvas
      >
        {/* Canvas Header / Service Mock Header */}
        <div className="border-b border-slate-100 pb-4 mb-2">
          <div className="flex items-center justify-between gap-2">
            <span className="text-[10px] font-extrabold uppercase tracking-wider text-blue-700 bg-blue-50 px-2.5 py-1 rounded-md border border-blue-100">
              Trámite Institucional
            </span>
            {!previewMode && (
              <span className="text-[10px] text-slate-400 font-medium">
                Modo Lienzo Libre • Haz clic en los bloques para editarlos
              </span>
            )}
          </div>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-900 mt-2 font-display">
            {serviceTitle || 'Nombre del Trámite'}
          </h1>
        </div>

        {/* Empty Canvas Call to Action */}
        {blocks.length === 0 && (
          <div className="border-2 border-dashed border-slate-200 rounded-2xl p-10 text-center space-y-4 my-6 bg-slate-50/50">
            <div className="w-14 h-14 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center mx-auto border border-blue-100 shadow-2xs">
              <Layers className="w-7 h-7" />
            </div>
            <div className="max-w-md mx-auto space-y-1">
              <h3 className="text-sm font-bold text-slate-800">El lienzo está vacío</h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                Arrastra cualquier bloque desde la barra izquierda (Texto, Imagen, 2 Columnas o Video) o haz clic en los accesos rápidos a continuación:
              </p>
            </div>
            <div className="flex flex-wrap items-center justify-center gap-2 pt-2">
              <button
                type="button"
                onClick={() => onAddBlockAt('text', 0)}
                className="px-3.5 py-2 bg-white hover:bg-blue-50 text-slate-700 hover:text-blue-700 border border-slate-200 rounded-xl text-xs font-bold transition-all shadow-2xs flex items-center gap-1.5 cursor-pointer"
              >
                <Type className="w-3.5 h-3.5 text-blue-600" />
                <span>+ Añadir Texto</span>
              </button>
              <button
                type="button"
                onClick={() => onAddBlockAt('columns-2', 0)}
                className="px-3.5 py-2 bg-white hover:bg-indigo-50 text-slate-700 hover:text-indigo-700 border border-slate-200 rounded-xl text-xs font-bold transition-all shadow-2xs flex items-center gap-1.5 cursor-pointer"
              >
                <Columns className="w-3.5 h-3.5 text-indigo-600" />
                <span>+ Añadir 2 Columnas</span>
              </button>
              <button
                type="button"
                onClick={() => onAddBlockAt('image', 0)}
                className="px-3.5 py-2 bg-white hover:bg-emerald-50 text-slate-700 hover:text-emerald-700 border border-slate-200 rounded-xl text-xs font-bold transition-all shadow-2xs flex items-center gap-1.5 cursor-pointer"
              >
                <ImageIcon className="w-3.5 h-3.5 text-emerald-600" />
                <span>+ Añadir Imagen</span>
              </button>
            </div>
          </div>
        )}

        {/* Drop zone indicator before first block */}
        {!previewMode && blocks.length > 0 && (
          <DropZoneIndicator id="drop-zone-0" index={0} onAddBlockAt={onAddBlockAt} />
        )}

        {/* Render Blocks */}
        {blocks.map((block, index) => {
          const isSelected = selectedBlockId === block.id;

          return (
            <React.Fragment key={block.id || `block-${index}`}>
              <div
                onClick={(e) => {
                  e.stopPropagation();
                  onSelectBlock(block.id);
                }}
                className={`relative group/block rounded-2xl transition-all ${
                  previewMode ? '' : 'hover:ring-1 hover:ring-slate-300 p-3 sm:p-4'
                } ${
                  isSelected && !previewMode 
                    ? 'ring-2 ring-blue-500 bg-blue-50/10 shadow-sm' 
                    : ''
                }`}
              >
                {/* Floating Block Controls on Selection */}
                {!previewMode && isSelected && (
                  <div className="absolute -top-4 right-4 z-20 flex items-center gap-1 bg-slate-900 text-white px-2.5 py-1 rounded-xl shadow-lg border border-slate-800 text-xs animate-fadeIn">
                    <span className="text-[10px] font-extrabold uppercase tracking-wider text-blue-400 mr-1 flex items-center gap-1">
                      {block.type}
                    </span>
                    <button
                      type="button"
                      onClick={() => onMoveBlock(block.id, 'up')}
                      disabled={index === 0}
                      className="p-1 hover:bg-slate-800 disabled:opacity-30 rounded-md transition-colors cursor-pointer"
                      title="Mover arriba"
                    >
                      <ArrowUp className="w-3.5 h-3.5" />
                    </button>
                    <button
                      type="button"
                      onClick={() => onMoveBlock(block.id, 'down')}
                      disabled={index === blocks.length - 1}
                      className="p-1 hover:bg-slate-800 disabled:opacity-30 rounded-md transition-colors cursor-pointer"
                      title="Mover abajo"
                    >
                      <ArrowDown className="w-3.5 h-3.5" />
                    </button>
                    <button
                      type="button"
                      onClick={() => onDuplicateBlock(block.id)}
                      className="p-1 hover:bg-slate-800 rounded-md transition-colors cursor-pointer"
                      title="Duplicar bloque"
                    >
                      <Copy className="w-3.5 h-3.5" />
                    </button>
                    <button
                      type="button"
                      onClick={() => onDeleteBlock(block.id)}
                      className="p-1 hover:bg-rose-900/60 text-rose-300 rounded-md transition-colors cursor-pointer"
                      title="Eliminar bloque"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                )}

                {/* ==================== 1. TEXT BLOCK ==================== */}
                {block.type === 'text' && (
                  <InlineTextBlock
                    block={block as TextLayoutBlock}
                    onChange={(updated) => onUpdateBlock(updated)}
                    isSelected={isSelected && !previewMode}
                    readOnly={previewMode}
                  />
                )}

                {/* ==================== 2. COLUMNS BLOCK ==================== */}
                {block.type === 'columns' && (() => {
                  const colBlock = block as ColumnsLayoutBlock;
                  const colsCount = colBlock.columnsCount || colBlock.columns?.length || 2;
                  let gridClass = 'grid-cols-1 md:grid-cols-2';
                  if (colsCount === 3) {
                    gridClass = 'grid-cols-1 md:grid-cols-3';
                  } else if (colBlock.layout === '1-2') {
                    gridClass = 'grid-cols-1 md:grid-cols-3';
                  } else if (colBlock.layout === '2-1') {
                    gridClass = 'grid-cols-1 md:grid-cols-3';
                  }

                  return (
                    <div className="space-y-3">
                      {!previewMode && (
                        <div className="flex items-center justify-between text-xs text-slate-500 font-bold border-b border-slate-100 pb-1.5">
                          <span className="flex items-center gap-1 text-indigo-700">
                            <Columns className="w-3.5 h-3.5" />
                            Contenedor Multicolumna ({colsCount} columnas)
                          </span>
                          <span className="text-[10px] text-slate-400 font-normal">
                            Arrastra elementos dentro de cada columna
                          </span>
                        </div>
                      )}

                      <div className={`grid ${gridClass} gap-4 items-start`}>
                        {colBlock.columns?.map((col, cIdx) => {
                          let colSpan = '';
                          if (colBlock.layout === '1-2' && cIdx === 1) colSpan = 'md:col-span-2';
                          if (colBlock.layout === '2-1' && cIdx === 0) colSpan = 'md:col-span-2';

                          return (
                            <div key={col.id || `col-${cIdx}`} className={colSpan}>
                              <NestedColumnDroppable
                                column={col}
                                columnIndex={cIdx}
                                parentBlockId={colBlock.id}
                                selectedBlockId={selectedBlockId}
                                onSelectBlock={onSelectBlock}
                                onUpdateBlock={onUpdateBlock}
                                onDeleteNestedBlock={(pId, cId, bId) => {
                                  const updatedCols = colBlock.columns.map(c => {
                                    if (c.id === cId) {
                                      return { ...c, blocks: c.blocks.filter(b => b.id !== bId) };
                                    }
                                    return c;
                                  });
                                  onUpdateBlock({ ...colBlock, columns: updatedCols });
                                }}
                                previewMode={previewMode}
                              />
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  );
                })()}

                {/* ==================== 3. MEDIA (IMAGE / VIDEO / PDF) ==================== */}
                {block.type === 'media' && (() => {
                  const media = block as MediaLayoutBlock;
                  const mediaType = media.mediaType || 'image';

                  if (mediaType === 'image') {
                    const alignClass = media.alignment === 'left' ? 'mr-auto' : media.alignment === 'right' ? 'ml-auto' : 'mx-auto';
                    const sizeClass = media.size === 'small' ? 'max-w-xs' : media.size === 'medium' ? 'max-w-md' : 'w-full';

                    return (
                      <div className={`space-y-2 ${sizeClass} ${alignClass}`}>
                        {media.title && (
                          <h4 className="text-sm font-bold text-slate-800">{media.title}</h4>
                        )}
                        {media.url ? (
                          <div className="relative overflow-hidden rounded-xl border border-slate-200/80 bg-slate-50">
                            <img
                              src={media.url}
                              alt={media.title || 'Imagen'}
                              className="w-full h-auto max-h-[420px] object-contain mx-auto rounded-xl"
                            />
                          </div>
                        ) : (
                          <div className="p-8 bg-slate-50 border-2 border-dashed border-slate-200 rounded-xl text-center space-y-2 cursor-pointer hover:bg-blue-50/50 hover:border-blue-300 transition-colors">
                            <ImageIcon className="w-8 h-8 mx-auto text-slate-400" />
                            <p className="text-xs font-bold text-slate-700">Sin imagen seleccionada</p>
                            <p className="text-[11px] text-slate-500">Haz clic para abrir el inspector de la derecha y subir o enlazar tu imagen.</p>
                          </div>
                        )}
                        {media.caption && (
                          <p className="text-xs text-slate-500 italic text-center">{media.caption}</p>
                        )}
                      </div>
                    );
                  }

                  if (mediaType === 'video') {
                    return (
                      <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-2">
                        <div className="flex items-center gap-2 text-rose-700 font-bold text-xs">
                          <Video className="w-4 h-4" />
                          <span>{media.title || 'Video Tutorial Explicativo'}</span>
                        </div>
                        {media.url ? (
                          <p className="text-xs text-slate-600 truncate">URL: {media.url}</p>
                        ) : (
                          <p className="text-xs text-slate-400 italic">Configura la URL de YouTube/Vimeo en el inspector derecho.</p>
                        )}
                      </div>
                    );
                  }

                  if (mediaType === 'pdf') {
                    return (
                      <div className="p-4 bg-blue-50/60 border border-blue-200 rounded-xl flex items-center justify-between gap-3">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-xl bg-blue-600 text-white flex items-center justify-center shrink-0">
                            <FileDown className="w-5 h-5" />
                          </div>
                          <div>
                            <p className="text-xs font-bold text-slate-900">{media.title || 'Descargar Formato Oficial (PDF)'}</p>
                            <p className="text-[11px] text-slate-500">{media.caption || 'Haz clic para abrir o descargar'}</p>
                          </div>
                        </div>
                        <span className="px-3 py-1.5 rounded-lg bg-blue-600 text-white text-xs font-bold shrink-0">
                          Descargar
                        </span>
                      </div>
                    );
                  }

                  return null;
                })()}

                {/* ==================== 4. ALERT BLOCK ==================== */}
                {block.type === 'alert' && (() => {
                  const alt = block as AlertLayoutBlock;
                  const isWarning = alt.level === 'warning';
                  const isDanger = alt.level === 'danger';
                  const isSuccess = alt.level === 'success';

                  const badgeClass = isDanger ? 'bg-rose-50 border-rose-200 text-rose-900' :
                                     isWarning ? 'bg-amber-50 border-amber-200 text-amber-900' :
                                     isSuccess ? 'bg-emerald-50 border-emerald-200 text-emerald-900' :
                                     'bg-blue-50 border-blue-200 text-blue-900';

                  return (
                    <div className={`p-4 rounded-xl border flex items-start gap-3 ${badgeClass}`}>
                      <AlertTriangle className="w-5 h-5 shrink-0 mt-0.5" />
                      <div className="space-y-1 flex-1 min-w-0">
                        <h4 className="text-xs sm:text-sm font-bold">{alt.title || 'Aviso'}</h4>
                        <p className="text-xs leading-relaxed">{alt.message || 'Sin mensaje de aviso configurado.'}</p>
                      </div>
                    </div>
                  );
                })()}

                {/* ==================== 5. FAQ BLOCK ==================== */}
                {block.type === 'faq' && (() => {
                  const faq = block as FAQLayoutBlock;
                  return (
                    <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 sm:p-5 space-y-3">
                      <div className="flex items-center gap-2 border-b border-slate-200/80 pb-2">
                        <HelpCircle className="w-4 h-4 text-purple-600" />
                        <h4 className="text-xs sm:text-sm font-bold text-slate-800">{faq.title || 'Preguntas Frecuentes'}</h4>
                      </div>
                      <div className="space-y-2">
                        {faq.items?.map((item, iIdx) => (
                          <div key={iIdx} className="bg-white border border-slate-200 rounded-xl p-3 space-y-1 shadow-2xs">
                            <p className="text-xs font-bold text-slate-800 flex items-center justify-between">
                              <span>¿ {item.q}</span>
                              <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
                            </p>
                            <p className="text-xs text-slate-600 leading-relaxed pt-1 border-t border-slate-100">
                              {item.a}
                            </p>
                          </div>
                        ))}
                      </div>
                    </div>
                  );
                })()}
              </div>

              {/* Drop slot indicator between blocks */}
              {!previewMode && (
                <DropZoneIndicator 
                  id={`drop-zone-${index + 1}`} 
                  index={index + 1} 
                  onAddBlockAt={onAddBlockAt} 
                />
              )}
            </React.Fragment>
          );
        })}
      </div>
    </div>
  );
};
