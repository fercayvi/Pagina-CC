import React from 'react';
import { 
  ArrowLeft, 
  Save, 
  LayoutGrid, 
  Type, 
  AlertTriangle, 
  HelpCircle, 
  Image as ImageIcon,
  Check,
  Layers,
  Sparkles
} from 'lucide-react';
import { LayoutBlock } from '../types';
import { BlockBuilder } from './BlockBuilder';
import { 
  createNewTextBlock, 
  createNewAlertBlock, 
  createNewFAQBlock, 
  createNewMediaBlock 
} from '../utils/layoutBlocks';

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
  const handleAddText = () => {
    onChange([...blocks, createNewTextBlock()]);
  };

  const handleAddAlert = () => {
    onChange([...blocks, createNewAlertBlock()]);
  };

  const handleAddFAQ = () => {
    onChange([...blocks, createNewFAQBlock()]);
  };

  const handleAddMedia = () => {
    onChange([...blocks, createNewMediaBlock()]);
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-100 flex flex-col overflow-hidden animate-fadeIn">
      {/* TopBar (Barra Superior) */}
      <header className="h-16 bg-white border-b border-slate-200 px-4 sm:px-6 flex items-center justify-between gap-3 shrink-0 shadow-xs z-10">
        {/* Left: Back / Save & Close + Title Info */}
        <div className="flex items-center gap-3 min-w-0">
          <button
            type="button"
            onClick={onClose}
            className="flex items-center gap-2 px-3.5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs sm:text-sm font-bold shadow-xs transition-all cursor-pointer active:scale-95 shrink-0"
            title="Volver y guardar cambios en el trámite"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Volver / Cerrar y Guardar</span>
          </button>

          <div className="h-6 w-px bg-slate-200 hidden sm:block shrink-0" />

          <div className="flex flex-col min-w-0">
            <div className="flex items-center gap-1.5">
              <LayoutGrid className="w-3.5 h-3.5 text-blue-600 shrink-0" />
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider truncate">
                Constructor de Página • Pantalla Completa
              </span>
            </div>
            <h2 className="text-xs sm:text-sm font-bold text-slate-800 truncate max-w-xs sm:max-w-md">
              {serviceTitle || 'Trámite'}
            </h2>
          </div>
        </div>

        {/* Right: Quick Block Add Tools + Status Badge */}
        <div className="flex items-center gap-2 shrink-0">
          <div className="hidden md:flex items-center gap-1.5 bg-slate-50 p-1 rounded-xl border border-slate-200">
            <button
              type="button"
              onClick={handleAddText}
              className="px-2.5 py-1.5 hover:bg-white text-slate-700 hover:text-blue-700 rounded-lg text-xs font-semibold transition-all flex items-center gap-1 cursor-pointer"
              title="Añadir bloque de texto explicativo"
            >
              <Type className="w-3.5 h-3.5 text-blue-600" />
              <span className="hidden lg:inline">+ Texto</span>
            </button>
            <button
              type="button"
              onClick={handleAddAlert}
              className="px-2.5 py-1.5 hover:bg-white text-slate-700 hover:text-amber-700 rounded-lg text-xs font-semibold transition-all flex items-center gap-1 cursor-pointer"
              title="Añadir bloque de aviso / alerta"
            >
              <AlertTriangle className="w-3.5 h-3.5 text-amber-500" />
              <span className="hidden lg:inline">+ Aviso</span>
            </button>
            <button
              type="button"
              onClick={handleAddFAQ}
              className="px-2.5 py-1.5 hover:bg-white text-slate-700 hover:text-purple-700 rounded-lg text-xs font-semibold transition-all flex items-center gap-1 cursor-pointer"
              title="Añadir bloque de preguntas frecuentes"
            >
              <HelpCircle className="w-3.5 h-3.5 text-purple-600" />
              <span className="hidden lg:inline">+ FAQs</span>
            </button>
            <button
              type="button"
              onClick={handleAddMedia}
              className="px-2.5 py-1.5 hover:bg-white text-slate-700 hover:text-emerald-700 rounded-lg text-xs font-semibold transition-all flex items-center gap-1 cursor-pointer"
              title="Añadir bloque multimedia (imagen, video o PDF)"
            >
              <ImageIcon className="w-3.5 h-3.5 text-emerald-600" />
              <span className="hidden lg:inline">+ Media</span>
            </button>
          </div>

          <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold bg-blue-50 text-blue-700 border border-blue-200/80 shadow-2xs">
            {blocks.length} {blocks.length === 1 ? 'bloque' : 'bloques'}
          </span>

          <button
            type="button"
            onClick={onClose}
            className="flex items-center gap-1.5 px-3.5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs sm:text-sm font-bold shadow-xs transition-all cursor-pointer active:scale-95"
            title="Guardar y volver al modal principal"
          >
            <Check className="w-4 h-4" />
            <span className="hidden sm:inline">Listo</span>
          </button>
        </div>
      </header>

      {/* Main Workspace (Área de trabajo ancha y espaciosa) */}
      <main className="flex-1 overflow-y-auto custom-scrollbar p-4 sm:p-8 bg-slate-100/70">
        <div className="max-w-4xl mx-auto space-y-6 pb-20">
          <BlockBuilder
            blocks={blocks}
            onChange={onChange}
            serviceTitle={serviceTitle}
          />
        </div>
      </main>
    </div>
  );
};
