import React, { useState } from 'react';
import { 
  Type, 
  AlertTriangle, 
  HelpCircle, 
  Image as ImageIcon, 
  Video, 
  FileDown, 
  Columns,
  Plus, 
  Trash2, 
  ArrowUp, 
  ArrowDown, 
  Layers, 
  Maximize2,
  Sparkles,
  Sliders
} from 'lucide-react';
import { 
  LayoutBlock, 
  TextLayoutBlock, 
  AlertLayoutBlock, 
  FAQLayoutBlock, 
  MediaLayoutBlock, 
  ColumnsLayoutBlock 
} from '../types';
import { 
  createNewTextBlock, 
  createNewAlertBlock, 
  createNewFAQBlock, 
  createNewImageBlock,
  createNewColumnsBlock 
} from '../utils/layoutBlocks';
import { InlineTextBlock } from './page-builder/InlineTextBlock';

interface BlockBuilderProps {
  blocks: LayoutBlock[];
  onChange: (blocks: LayoutBlock[]) => void;
  serviceTitle?: string;
  onOpenFullScreen?: () => void;
}

export const BlockBuilder: React.FC<BlockBuilderProps> = ({
  blocks,
  onChange,
  serviceTitle,
  onOpenFullScreen
}) => {
  const [selectedBlockId, setSelectedBlockId] = useState<string | null>(null);

  // Add block
  const handleAddBlock = (type: 'text' | 'columns' | 'image' | 'alert' | 'faq') => {
    let newBlock: LayoutBlock;
    if (type === 'columns') newBlock = createNewColumnsBlock(2, 'equal');
    else if (type === 'image') newBlock = createNewImageBlock();
    else if (type === 'alert') newBlock = createNewAlertBlock();
    else if (type === 'faq') newBlock = createNewFAQBlock();
    else newBlock = createNewTextBlock();

    onChange([...blocks, newBlock]);
    setSelectedBlockId(newBlock.id);
  };

  // Update block
  const handleUpdateBlock = (updated: LayoutBlock) => {
    const newBlocks = blocks.map(b => b.id === updated.id ? updated : b);
    onChange(newBlocks);
  };

  // Move block
  const handleMoveBlock = (index: number, direction: 'up' | 'down') => {
    const newIndex = direction === 'up' ? index - 1 : index + 1;
    if (newIndex < 0 || newIndex >= blocks.length) return;
    const newBlocks = [...blocks];
    const [moved] = newBlocks.splice(index, 1);
    newBlocks.splice(newIndex, 0, moved);
    onChange(newBlocks);
  };

  // Delete block
  const handleDeleteBlock = (blockId: string) => {
    if (selectedBlockId === blockId) setSelectedBlockId(null);
    onChange(blocks.filter(b => b.id !== blockId));
  };

  return (
    <div className="space-y-4 animate-fadeIn">
      {/* Header Info & Fullscreen Button */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-200">
        <div>
          <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
            <Layers className="w-4 h-4 text-blue-600" />
            Lienzo de Contenido Modular (WYSIWYG)
          </h3>
          <p className="text-xs text-slate-500 mt-0.5">
            Edita visualmente los bloques en vivo o utiliza el editor de 3 zonas a pantalla completa.
          </p>
        </div>

        {onOpenFullScreen && (
          <button
            type="button"
            onClick={onOpenFullScreen}
            className="px-3.5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold transition-all shadow-xs flex items-center gap-1.5 cursor-pointer shrink-0 self-start sm:self-auto active:scale-95"
          >
            <Maximize2 className="w-3.5 h-3.5" />
            <span>Abrir Lienzo en Pantalla Completa</span>
          </button>
        )}
      </div>

      {/* Quick Add Bar */}
      <div className="flex flex-wrap items-center gap-1.5 bg-slate-50 p-2 rounded-xl border border-slate-200">
        <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider px-2">
          Agregar:
        </span>
        <button
          type="button"
          onClick={() => handleAddBlock('text')}
          className="px-2.5 py-1.5 bg-white hover:bg-blue-50 text-slate-700 hover:text-blue-700 border border-slate-200 rounded-lg text-xs font-bold flex items-center gap-1.5 cursor-pointer shadow-2xs transition-all"
        >
          <Type className="w-3.5 h-3.5 text-blue-600" />
          <span>+ Texto</span>
        </button>
        <button
          type="button"
          onClick={() => handleAddBlock('columns')}
          className="px-2.5 py-1.5 bg-white hover:bg-indigo-50 text-slate-700 hover:text-indigo-700 border border-slate-200 rounded-lg text-xs font-bold flex items-center gap-1.5 cursor-pointer shadow-2xs transition-all"
        >
          <Columns className="w-3.5 h-3.5 text-indigo-600" />
          <span>+ 2 Columnas</span>
        </button>
        <button
          type="button"
          onClick={() => handleAddBlock('image')}
          className="px-2.5 py-1.5 bg-white hover:bg-emerald-50 text-slate-700 hover:text-emerald-700 border border-slate-200 rounded-lg text-xs font-bold flex items-center gap-1.5 cursor-pointer shadow-2xs transition-all"
        >
          <ImageIcon className="w-3.5 h-3.5 text-emerald-600" />
          <span>+ Imagen</span>
        </button>
        <button
          type="button"
          onClick={() => handleAddBlock('alert')}
          className="px-2.5 py-1.5 bg-white hover:bg-amber-50 text-slate-700 hover:text-amber-700 border border-slate-200 rounded-lg text-xs font-bold flex items-center gap-1.5 cursor-pointer shadow-2xs transition-all"
        >
          <AlertTriangle className="w-3.5 h-3.5 text-amber-500" />
          <span>+ Aviso</span>
        </button>
        <button
          type="button"
          onClick={() => handleAddBlock('faq')}
          className="px-2.5 py-1.5 bg-white hover:bg-purple-50 text-slate-700 hover:text-purple-700 border border-slate-200 rounded-lg text-xs font-bold flex items-center gap-1.5 cursor-pointer shadow-2xs transition-all"
        >
          <HelpCircle className="w-3.5 h-3.5 text-purple-600" />
          <span>+ FAQs</span>
        </button>
      </div>

      {/* Visual Canvas Elements */}
      {blocks.length === 0 ? (
        <div className="bg-slate-50 border-2 border-dashed border-slate-200 rounded-2xl p-8 text-center space-y-3">
          <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center mx-auto">
            <Layers className="w-6 h-6" />
          </div>
          <h4 className="text-xs font-bold text-slate-800">No hay bloques de contenido aún</h4>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            Haz clic en los botones superiores para agregar bloques de texto con edición directa, columnas o imágenes.
          </p>
        </div>
      ) : (
        <div className="space-y-4 bg-white border border-slate-200 rounded-2xl p-5 shadow-xs">
          {blocks.map((block, index) => {
            const isSelected = selectedBlockId === block.id;

            return (
              <div
                key={block.id || `b-${index}`}
                onClick={() => setSelectedBlockId(block.id)}
                className={`relative rounded-xl p-4 transition-all border ${
                  isSelected 
                    ? 'border-blue-500 ring-2 ring-blue-500/20 bg-blue-50/5' 
                    : 'border-slate-200 hover:border-slate-300'
                }`}
              >
                {/* Block Actions Bar */}
                <div className="flex items-center justify-between pb-2 mb-2 border-b border-slate-100">
                  <div className="flex items-center gap-1.5">
                    <span className="text-[10px] font-extrabold uppercase tracking-wider text-blue-700 bg-blue-50 px-2 py-0.5 rounded-md">
                      {block.type}
                    </span>
                    <span className="text-xs font-bold text-slate-700">Bloque #{index + 1}</span>
                  </div>

                  <div className="flex items-center gap-1">
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleMoveBlock(index, 'up');
                      }}
                      disabled={index === 0}
                      className="p-1 text-slate-400 hover:text-slate-700 disabled:opacity-30 rounded-md cursor-pointer"
                      title="Mover arriba"
                    >
                      <ArrowUp className="w-3.5 h-3.5" />
                    </button>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleMoveBlock(index, 'down');
                      }}
                      disabled={index === blocks.length - 1}
                      className="p-1 text-slate-400 hover:text-slate-700 disabled:opacity-30 rounded-md cursor-pointer"
                      title="Mover abajo"
                    >
                      <ArrowDown className="w-3.5 h-3.5" />
                    </button>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDeleteBlock(block.id);
                      }}
                      className="p-1 text-slate-400 hover:text-rose-600 rounded-md cursor-pointer"
                      title="Eliminar bloque"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                {/* Inline Block Renderers */}
                {block.type === 'text' && (
                  <InlineTextBlock
                    block={block as TextLayoutBlock}
                    onChange={(updated) => handleUpdateBlock(updated)}
                    isSelected={isSelected}
                  />
                )}

                {block.type === 'columns' && (() => {
                  const cols = block as ColumnsLayoutBlock;
                  return (
                    <div className="grid grid-cols-2 gap-3 p-3 bg-slate-50 rounded-xl border border-dashed border-slate-200">
                      {cols.columns?.map((c, cIdx) => (
                        <div key={c.id || cIdx} className="p-2.5 bg-white rounded-lg border border-slate-200 text-xs text-slate-500">
                          <span className="font-bold text-slate-700 block mb-1">Columna #{cIdx + 1}</span>
                          <span>{c.blocks?.length || 0} elementos dentro</span>
                        </div>
                      ))}
                    </div>
                  );
                })()}

                {block.type === 'media' && (() => {
                  const m = block as MediaLayoutBlock;
                  return m.url ? (
                    <img src={m.url} alt={m.title || 'Foto'} className="w-full max-h-48 object-contain rounded-lg" />
                  ) : (
                    <div className="p-4 text-center text-xs text-slate-400 bg-slate-50 rounded-lg">
                      Sin imagen cargada. Abre el editor en pantalla completa para gestionarla.
                    </div>
                  );
                })()}

                {block.type === 'alert' && (() => {
                  const alt = block as AlertLayoutBlock;
                  return (
                    <div className="p-3 bg-amber-50 border border-amber-200 rounded-lg text-xs text-amber-900">
                      <p className="font-bold">{alt.title || 'Aviso'}</p>
                      <p className="mt-0.5">{alt.message || 'Sin mensaje'}</p>
                    </div>
                  );
                })()}

                {block.type === 'faq' && (() => {
                  const f = block as FAQLayoutBlock;
                  return (
                    <div className="p-3 bg-slate-50 rounded-lg text-xs space-y-1">
                      <p className="font-bold text-slate-800">{f.title || 'Preguntas Frecuentes'}</p>
                      <p className="text-slate-500">{f.items?.length || 0} preguntas registradas</p>
                    </div>
                  );
                })()}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
