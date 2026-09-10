import React, { useState, useEffect } from 'react';
import {
  DndContext,
  DragEndEvent,
  DragOverlay,
  DragStartEvent,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import { 
  ArrowLeft, 
  Save, 
  Check, 
  Eye, 
  Edit3, 
  Monitor, 
  Tablet, 
  Smartphone, 
  Layers, 
  Sparkles,
  LayoutGrid,
  Undo2
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
  createNewVideoBlock,
  createNewPdfBlock,
  createNewColumnsBlock 
} from '../utils/layoutBlocks';
import { PageBuilderToolbar, BlockTemplateItem, AVAILABLE_BLOCKS } from './page-builder/PageBuilderToolbar';
import { PageBuilderInspector } from './page-builder/PageBuilderInspector';
import { PageBuilderCanvas } from './page-builder/PageBuilderCanvas';

interface PageBuilderFullScreenEditorProps {
  blocks: LayoutBlock[];
  onChange: (blocks: LayoutBlock[]) => void;
  onClose: () => void;
  serviceTitle?: string;
}

export const PageBuilderFullScreenEditor: React.FC<PageBuilderFullScreenEditorProps> = ({
  blocks,
  onChange,
  onClose,
  serviceTitle
}) => {
  const [selectedBlockId, setSelectedBlockId] = useState<string | null>(null);
  const [deviceView, setDeviceView] = useState<'desktop' | 'tablet' | 'mobile'>('desktop');
  const [previewMode, setPreviewMode] = useState<boolean>(false);
  const [saveStatus, setSaveStatus] = useState<'saved' | 'saving'>('saved');
  const [activeDragItem, setActiveDragItem] = useState<any>(null);
  const [mobileTab, setMobileTab] = useState<'tools' | 'canvas' | 'inspector'>('canvas');

  // Sensors for DND: Require 8px movement before dragging starts to allow normal text click & cursor placement in contentEditable
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    })
  );

  // Autosave indicator timer
  useEffect(() => {
    setSaveStatus('saving');
    const timer = setTimeout(() => {
      setSaveStatus('saved');
    }, 500);
    return () => clearTimeout(timer);
  }, [blocks]);

  // Helper to create a new block given a template type
  const instantiateBlock = (type: string): LayoutBlock => {
    switch (type) {
      case 'text':
        return createNewTextBlock();
      case 'columns-2':
        return createNewColumnsBlock(2, 'equal');
      case 'columns-3':
        return createNewColumnsBlock(3, 'equal');
      case 'image':
        return createNewImageBlock();
      case 'video':
        return createNewVideoBlock();
      case 'pdf':
        return createNewPdfBlock();
      case 'alert':
        return createNewAlertBlock();
      case 'faq':
        return createNewFAQBlock();
      default:
        return createNewTextBlock();
    }
  };

  // Add block at specific index (or append to end)
  const handleAddBlockAt = (type: any, index: number = blocks.length) => {
    const newBlock = instantiateBlock(type);
    const updated = [...blocks];
    updated.splice(index, 0, newBlock);
    onChange(updated);
    setSelectedBlockId(newBlock.id);
    if (window.innerWidth < 1024) setMobileTab('canvas');
  };

  // Add block from toolbar
  const handleAddBlockFromToolbar = (type: any) => {
    handleAddBlockAt(type, blocks.length);
  };

  // Update block content (handles both root blocks and nested column blocks)
  const handleUpdateBlock = (updated: LayoutBlock) => {
    // Check if it's a top-level block
    const topIndex = blocks.findIndex(b => b.id === updated.id);
    if (topIndex !== -1) {
      const newBlocks = [...blocks];
      newBlocks[topIndex] = updated;
      onChange(newBlocks);
      return;
    }

    // Otherwise check if it's inside a column container
    const newBlocks = blocks.map(b => {
      if (b.type === 'columns') {
        const colBlock = b as ColumnsLayoutBlock;
        const updatedCols = colBlock.columns.map(col => {
          const childIndex = col.blocks.findIndex(cb => cb.id === updated.id);
          if (childIndex !== -1) {
            const newColBlocks = [...col.blocks];
            newColBlocks[childIndex] = updated;
            return { ...col, blocks: newColBlocks };
          }
          return col;
        });
        return { ...colBlock, columns: updatedCols };
      }
      return b;
    });

    onChange(newBlocks);
  };

  // Delete block (handles top-level and nested)
  const handleDeleteBlock = (blockId: string) => {
    if (selectedBlockId === blockId) setSelectedBlockId(null);

    // Top-level delete
    if (blocks.some(b => b.id === blockId)) {
      onChange(blocks.filter(b => b.id !== blockId));
      return;
    }

    // Nested delete
    const newBlocks = blocks.map(b => {
      if (b.type === 'columns') {
        const colBlock = b as ColumnsLayoutBlock;
        const updatedCols = colBlock.columns.map(col => ({
          ...col,
          blocks: col.blocks.filter(cb => cb.id !== blockId)
        }));
        return { ...colBlock, columns: updatedCols };
      }
      return b;
    });
    onChange(newBlocks);
  };

  // Duplicate block
  const handleDuplicateBlock = (blockId: string) => {
    const target = blocks.find(b => b.id === blockId);
    if (!target) return;

    const cloned: LayoutBlock = JSON.parse(JSON.stringify(target));
    cloned.id = `block_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`;
    if (cloned.type === 'columns') {
      cloned.columns = cloned.columns.map((c, i) => ({
        id: `col_${i + 1}_${Date.now()}`,
        blocks: c.blocks.map(cb => ({
          ...cb,
          id: `block_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`
        }))
      }));
    }

    const index = blocks.findIndex(b => b.id === blockId);
    const newBlocks = [...blocks];
    newBlocks.splice(index + 1, 0, cloned);
    onChange(newBlocks);
    setSelectedBlockId(cloned.id);
  };

  // Move block up or down
  const handleMoveBlock = (blockId: string, direction: 'up' | 'down') => {
    const index = blocks.findIndex(b => b.id === blockId);
    if (index === -1) return;

    const newIndex = direction === 'up' ? index - 1 : index + 1;
    if (newIndex < 0 || newIndex >= blocks.length) return;

    const newBlocks = [...blocks];
    const [moved] = newBlocks.splice(index, 1);
    newBlocks.splice(newIndex, 0, moved);
    onChange(newBlocks);
  };

  // Clear all blocks
  const handleClearCanvas = () => {
    if (window.confirm('¿Deseas vaciar todos los bloques del lienzo? Esta acción no se puede deshacer.')) {
      onChange([]);
      setSelectedBlockId(null);
    }
  };

  // Find currently selected block (either root or nested)
  const getSelectedBlock = (): LayoutBlock | null => {
    if (!selectedBlockId) return null;
    const top = blocks.find(b => b.id === selectedBlockId);
    if (top) return top;

    for (const b of blocks) {
      if (b.type === 'columns') {
        const colBlock = b as ColumnsLayoutBlock;
        for (const col of colBlock.columns) {
          const child = col.blocks.find(cb => cb.id === selectedBlockId);
          if (child) return child;
        }
      }
    }
    return null;
  };

  // Drag and Drop handlers
  const handleDragStart = (event: DragStartEvent) => {
    setActiveDragItem(event.active.data.current);
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    setActiveDragItem(null);

    if (!over) return;

    // Check if dragging from toolbar library
    if (active.data.current?.isTemplate) {
      const templateType = active.data.current.templateType;

      // 1. Dropped into a specific column inside a container
      if (over.data.current?.isColumnDrop) {
        const { parentBlockId, columnId } = over.data.current;
        const newBlock = instantiateBlock(templateType);

        const updated = blocks.map(b => {
          if (b.id === parentBlockId && b.type === 'columns') {
            const colBlock = b as ColumnsLayoutBlock;
            const updatedCols = colBlock.columns.map(col => {
              if (col.id === columnId) {
                return { ...col, blocks: [...col.blocks, newBlock] };
              }
              return col;
            });
            return { ...colBlock, columns: updatedCols };
          }
          return b;
        });

        onChange(updated);
        setSelectedBlockId(newBlock.id);
        return;
      }

      // 2. Dropped on a drop zone between blocks
      if (typeof over.data.current?.dropIndex === 'number') {
        handleAddBlockAt(templateType, over.data.current.dropIndex);
        return;
      }

      // 3. Dropped anywhere else on the canvas
      handleAddBlockAt(templateType, blocks.length);
    }
  };

  const selectedBlock = getSelectedBlock();

  return (
    <DndContext sensors={sensors} onDragStart={handleDragStart} onDragEnd={handleDragEnd}>
      <div className="fixed inset-0 z-50 bg-slate-100 flex flex-col overflow-hidden animate-fadeIn select-none font-sans text-slate-800">
        
        {/* ==================== TOP NAVIGATION & CONTROL BAR ==================== */}
        <header className="h-14 bg-white border-b border-slate-200 px-3 sm:px-5 flex items-center justify-between gap-3 shrink-0 shadow-2xs z-20">
          {/* Left: Back / Save & Close + Title */}
          <div className="flex items-center gap-3 min-w-0">
            <button
              type="button"
              onClick={onClose}
              className="flex items-center gap-2 px-3 py-1.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold transition-all cursor-pointer active:scale-95 shrink-0 shadow-xs"
              title="Guardar cambios y volver"
            >
              <ArrowLeft className="w-4 h-4" />
              <span className="hidden sm:inline">Guardar y Volver</span>
              <span className="sm:hidden">Volver</span>
            </button>

            <div className="h-5 w-px bg-slate-200 hidden sm:block shrink-0" />

            <div className="flex flex-col min-w-0">
              <div className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-blue-600" />
                <span className="text-[10px] font-extrabold text-blue-700 uppercase tracking-wider truncate">
                  Lienzo Libre WYSIWYG
                </span>
              </div>
              <h2 className="text-xs font-bold text-slate-800 truncate max-w-xs sm:max-w-md">
                {serviceTitle || 'Página de Trámite'}
              </h2>
            </div>
          </div>

          {/* Center: Device Viewport Switcher & Preview Mode Toggle */}
          <div className="hidden md:flex items-center gap-2">
            {/* Viewport switcher */}
            <div className="flex items-center bg-slate-100 p-0.5 rounded-xl border border-slate-200">
              <button
                type="button"
                onClick={() => setDeviceView('desktop')}
                className={`p-1.5 rounded-lg text-xs font-semibold flex items-center gap-1 transition-all cursor-pointer ${
                  deviceView === 'desktop' ? 'bg-white text-blue-700 shadow-2xs font-bold' : 'text-slate-500 hover:text-slate-800'
                }`}
                title="Vista de Computadora (100%)"
              >
                <Monitor className="w-3.5 h-3.5" />
                <span className="text-[11px]">PC</span>
              </button>
              <button
                type="button"
                onClick={() => setDeviceView('tablet')}
                className={`p-1.5 rounded-lg text-xs font-semibold flex items-center gap-1 transition-all cursor-pointer ${
                  deviceView === 'tablet' ? 'bg-white text-blue-700 shadow-2xs font-bold' : 'text-slate-500 hover:text-slate-800'
                }`}
                title="Vista de Tableta (768px)"
              >
                <Tablet className="w-3.5 h-3.5" />
                <span className="text-[11px]">Tablet</span>
              </button>
              <button
                type="button"
                onClick={() => setDeviceView('mobile')}
                className={`p-1.5 rounded-lg text-xs font-semibold flex items-center gap-1 transition-all cursor-pointer ${
                  deviceView === 'mobile' ? 'bg-white text-blue-700 shadow-2xs font-bold' : 'text-slate-500 hover:text-slate-800'
                }`}
                title="Vista de Teléfono Móvil (375px)"
              >
                <Smartphone className="w-3.5 h-3.5" />
                <span className="text-[11px]">Móvil</span>
              </button>
            </div>

            {/* Preview Toggle */}
            <button
              type="button"
              onClick={() => setPreviewMode(!previewMode)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all border cursor-pointer ${
                previewMode 
                  ? 'bg-blue-600 text-white border-blue-700 shadow-xs' 
                  : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
              }`}
            >
              {previewMode ? <Edit3 className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5 text-blue-600" />}
              <span>{previewMode ? 'Modo Editor' : 'Vista Previa'}</span>
            </button>
          </div>

          {/* Right: Autosave status & Finish button */}
          <div className="flex items-center gap-2.5 shrink-0">
            {/* Mobile Tab Switchers (small screens only) */}
            <div className="flex lg:hidden bg-slate-100 p-0.5 rounded-xl border border-slate-200">
              <button
                type="button"
                onClick={() => setMobileTab('tools')}
                className={`px-2 py-1 text-[11px] font-bold rounded-lg ${mobileTab === 'tools' ? 'bg-white text-blue-700 shadow-2xs' : 'text-slate-600'}`}
              >
                Librería
              </button>
              <button
                type="button"
                onClick={() => setMobileTab('canvas')}
                className={`px-2 py-1 text-[11px] font-bold rounded-lg ${mobileTab === 'canvas' ? 'bg-white text-blue-700 shadow-2xs' : 'text-slate-600'}`}
              >
                Lienzo
              </button>
              <button
                type="button"
                onClick={() => setMobileTab('inspector')}
                className={`px-2 py-1 text-[11px] font-bold rounded-lg ${mobileTab === 'inspector' ? 'bg-white text-blue-700 shadow-2xs' : 'text-slate-600'}`}
              >
                Propiedades
              </button>
            </div>

            {/* Autosave badge */}
            <div className="hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200/80 shadow-2xs">
              <span className={`w-1.5 h-1.5 rounded-full ${saveStatus === 'saving' ? 'bg-amber-500 animate-ping' : 'bg-emerald-500'}`} />
              <span>{saveStatus === 'saving' ? 'Autoguardando...' : 'Guardado'}</span>
            </div>

            <button
              type="button"
              onClick={onClose}
              className="flex items-center gap-1.5 px-3.5 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold shadow-xs transition-all cursor-pointer active:scale-95"
              title="Guardar y finalizar edición visual"
            >
              <Check className="w-3.5 h-3.5" />
              <span>Listo</span>
            </button>
          </div>
        </header>

        {/* ==================== 3-COLUMN WYSIWYG WORKSPACE ==================== */}
        <div className="flex-1 flex overflow-hidden min-h-0">
          
          {/* 1. LEFT COLUMN: Toolbar / Library (20%) */}
          <div className={`w-full lg:w-[20%] lg:min-w-[240px] lg:max-w-[280px] shrink-0 h-full ${
            mobileTab === 'tools' ? 'block' : 'hidden lg:block'
          }`}>
            <PageBuilderToolbar onAddBlock={handleAddBlockFromToolbar} />
          </div>

          {/* 2. CENTER COLUMN: Live Canvas (60%) */}
          <div className={`flex-1 min-w-0 h-full flex flex-col ${
            mobileTab === 'canvas' ? 'flex' : 'hidden lg:flex'
          }`}>
            <PageBuilderCanvas
              blocks={blocks}
              selectedBlockId={selectedBlockId}
              onSelectBlock={(id) => {
                setSelectedBlockId(id);
                if (id && window.innerWidth < 1024) setMobileTab('inspector');
              }}
              onUpdateBlock={handleUpdateBlock}
              onDeleteBlock={handleDeleteBlock}
              onDuplicateBlock={handleDuplicateBlock}
              onMoveBlock={handleMoveBlock}
              onAddBlockAt={handleAddBlockAt}
              serviceTitle={serviceTitle}
              deviceView={deviceView}
              previewMode={previewMode}
            />
          </div>

          {/* 3. RIGHT COLUMN: Contextual Inspector (20%) */}
          <div className={`w-full lg:w-[20%] lg:min-w-[260px] lg:max-w-[320px] shrink-0 h-full ${
            mobileTab === 'inspector' ? 'block' : 'hidden lg:block'
          }`}>
            <PageBuilderInspector
              selectedBlock={selectedBlock}
              onUpdateBlock={handleUpdateBlock}
              onDeleteBlock={handleDeleteBlock}
              onDuplicateBlock={handleDuplicateBlock}
              onMoveBlock={handleMoveBlock}
              onDeselect={() => setSelectedBlockId(null)}
              totalBlocks={blocks.length}
              serviceTitle={serviceTitle}
              onAddBlock={handleAddBlockFromToolbar}
              onClearCanvas={handleClearCanvas}
            />
          </div>

        </div>

        {/* Drag Overlay for smooth ghost preview */}
        <DragOverlay>
          {activeDragItem ? (
            <div className="bg-white border-2 border-blue-500 rounded-xl p-3 shadow-xl flex items-center gap-2 text-xs font-bold text-blue-700 opacity-95 scale-105 pointer-events-none">
              <Sparkles className="w-4 h-4 text-blue-600" />
              <span>Soltando elemento...</span>
            </div>
          ) : null}
        </DragOverlay>

      </div>
    </DndContext>
  );
};
