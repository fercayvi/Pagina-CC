import React from 'react';
import { 
  Type, 
  AlertTriangle, 
  HelpCircle, 
  Image as ImageIcon, 
  Video, 
  FileDown, 
  Plus, 
  Trash2, 
  ArrowUp, 
  ArrowDown, 
  Layers, 
  CheckCircle2, 
  AlertCircle,
  Info,
  GripVertical
} from 'lucide-react';
import { 
  LayoutBlock, 
  TextLayoutBlock, 
  AlertLayoutBlock, 
  FAQLayoutBlock, 
  MediaLayoutBlock 
} from '../types';
import { 
  createNewTextBlock, 
  createNewAlertBlock, 
  createNewFAQBlock, 
  createNewMediaBlock 
} from '../utils/layoutBlocks';
import { MediaUploadField } from './MediaUploadField';

interface BlockBuilderProps {
  blocks: LayoutBlock[];
  onChange: (blocks: LayoutBlock[]) => void;
  serviceTitle?: string;
}

export const BlockBuilder: React.FC<BlockBuilderProps> = ({
  blocks,
  onChange,
  serviceTitle
}) => {
  // Reorder Block Handlers
  const handleMoveBlock = (index: number, direction: 'up' | 'down') => {
    const newIndex = direction === 'up' ? index - 1 : index + 1;
    if (newIndex < 0 || newIndex >= blocks.length) return;
    const newBlocks = [...blocks];
    const [moved] = newBlocks.splice(index, 1);
    newBlocks.splice(newIndex, 0, moved);
    onChange(newBlocks);
  };

  // Delete Block Handler
  const handleDeleteBlock = (index: number) => {
    const target = blocks[index];
    const typeLabel = 
      target.type === 'text' ? 'Texto' :
      target.type === 'alert' ? 'Aviso' :
      target.type === 'faq' ? 'Preguntas Frecuentes' : 'Multimedia';
    
    if (window.confirm(`¿Estás seguro de eliminar este bloque de ${typeLabel}?`)) {
      onChange(blocks.filter((_, i) => i !== index));
    }
  };

  // Add Block Handlers
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

  // Update specific block
  const handleUpdateBlock = (index: number, updatedBlock: LayoutBlock) => {
    const newBlocks = [...blocks];
    newBlocks[index] = updatedBlock;
    onChange(newBlocks);
  };

  return (
    <div className="space-y-4 animate-fadeIn">
      {/* Header Info */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-100">
        <div>
          <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
            <Layers className="w-4 h-4 text-blue-600" />
            Constructor de Página (Bloques Modulares)
          </h3>
          <p className="text-xs text-slate-500 mt-0.5">
            Organiza, agrega o reordena los bloques de contenido visual para {serviceTitle || 'este trámite'}.
          </p>
        </div>
        <span className="inline-flex items-center px-2.5 py-1 rounded-full text-[11px] font-bold bg-blue-50 text-blue-700 border border-blue-200/80 self-start sm:self-auto shrink-0 shadow-2xs">
          {blocks.length} {blocks.length === 1 ? 'bloque configurado' : 'bloques configurados'}
        </span>
      </div>

      {/* Empty State */}
      {blocks.length === 0 && (
        <div className="bg-slate-50 border-2 border-dashed border-slate-200 rounded-2xl p-8 text-center space-y-4 my-2">
          <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center mx-auto border border-blue-100 shadow-2xs">
            <Layers className="w-6 h-6" />
          </div>
          <div className="max-w-md mx-auto space-y-1">
            <h4 className="text-sm font-bold text-slate-800">Aún no hay bloques de contenido</h4>
            <p className="text-xs text-slate-500 leading-relaxed">
              Comienza armando la página del trámite agregando bloques de texto explicativo, avisos destacados, preguntas frecuentes o material multimedia.
            </p>
          </div>
          
          <div className="flex flex-wrap items-center justify-center gap-2 pt-2">
            <button
              type="button"
              onClick={handleAddText}
              className="px-3.5 py-2 bg-white hover:bg-slate-100 text-slate-800 border border-slate-200 rounded-xl text-xs font-bold transition-all shadow-2xs flex items-center gap-1.5 cursor-pointer"
            >
              <Type className="w-3.5 h-3.5 text-blue-600" />
              <span>+ Añadir Texto</span>
            </button>
            <button
              type="button"
              onClick={handleAddAlert}
              className="px-3.5 py-2 bg-white hover:bg-slate-100 text-slate-800 border border-slate-200 rounded-xl text-xs font-bold transition-all shadow-2xs flex items-center gap-1.5 cursor-pointer"
            >
              <AlertTriangle className="w-3.5 h-3.5 text-amber-500" />
              <span>+ Añadir Aviso</span>
            </button>
            <button
              type="button"
              onClick={handleAddFAQ}
              className="px-3.5 py-2 bg-white hover:bg-slate-100 text-slate-800 border border-slate-200 rounded-xl text-xs font-bold transition-all shadow-2xs flex items-center gap-1.5 cursor-pointer"
            >
              <HelpCircle className="w-3.5 h-3.5 text-purple-600" />
              <span>+ Añadir FAQs</span>
            </button>
            <button
              type="button"
              onClick={handleAddMedia}
              className="px-3.5 py-2 bg-white hover:bg-slate-100 text-slate-800 border border-slate-200 rounded-xl text-xs font-bold transition-all shadow-2xs flex items-center gap-1.5 cursor-pointer"
            >
              <ImageIcon className="w-3.5 h-3.5 text-emerald-600" />
              <span>+ Añadir Multimedia</span>
            </button>
          </div>
        </div>
      )}

      {/* List of Blocks */}
      <div className="space-y-4">
        {blocks.map((block, index) => {
          return (
            <div 
              key={block.id || `block-${index}`}
              className="bg-white border border-slate-200 rounded-2xl shadow-2xs overflow-hidden transition-all hover:border-slate-300"
            >
              {/* Block Control Header */}
              <div className="bg-slate-50/90 px-3.5 py-2.5 border-b border-slate-200 flex items-center justify-between gap-2">
                <div className="flex items-center gap-2.5 min-w-0">
                  <div className="cursor-grab text-slate-400 hover:text-slate-600 p-0.5" title="Bloque de contenido">
                    <GripVertical className="w-4 h-4" />
                  </div>

                  <span className="w-6 h-6 rounded-lg bg-slate-200 text-slate-700 font-extrabold text-[11px] flex items-center justify-center shrink-0">
                    {index + 1}
                  </span>

                  {/* Block Type Badge */}
                  {block.type === 'text' && (
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md text-[11px] font-bold bg-blue-50 text-blue-700 border border-blue-200/80">
                      <Type className="w-3 h-3 text-blue-600" />
                      <span>Texto / Markdown</span>
                    </span>
                  )}
                  {block.type === 'alert' && (
                    <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md text-[11px] font-bold border ${
                      block.level === 'warning' ? 'bg-amber-50 text-amber-800 border-amber-200' :
                      block.level === 'danger' ? 'bg-rose-50 text-rose-800 border-rose-200' :
                      block.level === 'success' ? 'bg-emerald-50 text-emerald-800 border-emerald-200' :
                      'bg-blue-50 text-blue-800 border-blue-200'
                    }`}>
                      <AlertTriangle className="w-3 h-3" />
                      <span>Aviso ({block.level || 'warning'})</span>
                    </span>
                  )}
                  {block.type === 'faq' && (
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md text-[11px] font-bold bg-purple-50 text-purple-700 border border-purple-200/80">
                      <HelpCircle className="w-3 h-3 text-purple-600" />
                      <span>Preguntas Frecuentes ({block.items?.length || 0})</span>
                    </span>
                  )}
                  {block.type === 'media' && (
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md text-[11px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200/80">
                      {block.mediaType === 'video' ? <Video className="w-3 h-3 text-emerald-600" /> :
                       block.mediaType === 'pdf' ? <FileDown className="w-3 h-3 text-emerald-600" /> :
                       <ImageIcon className="w-3 h-3 text-emerald-600" />}
                      <span className="capitalize">{block.mediaType || 'Imagen'}</span>
                    </span>
                  )}

                  {block.title && (
                    <span className="text-xs font-semibold text-slate-600 truncate max-w-[180px] hidden sm:inline">
                      — {block.title}
                    </span>
                  )}
                </div>

                {/* Move & Delete Actions */}
                <div className="flex items-center gap-1 shrink-0">
                  <button
                    type="button"
                    onClick={() => handleMoveBlock(index, 'up')}
                    disabled={index === 0}
                    title="Subir bloque"
                    className="p-1.5 rounded-lg text-slate-500 hover:text-slate-800 hover:bg-slate-200/80 disabled:opacity-30 disabled:pointer-events-none transition-colors cursor-pointer"
                  >
                    <ArrowUp className="w-3.5 h-3.5" />
                  </button>
                  <button
                    type="button"
                    onClick={() => handleMoveBlock(index, 'down')}
                    disabled={index === blocks.length - 1}
                    title="Bajar bloque"
                    className="p-1.5 rounded-lg text-slate-500 hover:text-slate-800 hover:bg-slate-200/80 disabled:opacity-30 disabled:pointer-events-none transition-colors cursor-pointer"
                  >
                    <ArrowDown className="w-3.5 h-3.5" />
                  </button>
                  <div className="w-[1px] h-4 bg-slate-200 mx-0.5" />
                  <button
                    type="button"
                    onClick={() => handleDeleteBlock(index)}
                    title="Eliminar bloque"
                    className="p-1.5 rounded-lg text-rose-500 hover:text-rose-700 hover:bg-rose-50 transition-colors cursor-pointer"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              {/* Block Form Content */}
              <div className="p-4 space-y-3.5">
                {/* 1. TEXT / MARKDOWN FORM */}
                {block.type === 'text' && (
                  <div className="space-y-3">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                        Título del Bloque (Opcional)
                      </label>
                      <input
                        type="text"
                        value={block.title || ''}
                        onChange={(e) => handleUpdateBlock(index, { ...block, title: e.target.value })}
                        placeholder="ej. Paso a Paso, Requisitos Necesarios, Horarios..."
                        className="w-full text-xs font-medium border border-slate-200 rounded-xl px-3 py-2 bg-slate-50 text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600 focus:bg-white"
                      />
                    </div>

                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                          Contenido de Texto / Markdown *
                        </label>
                        <span className="text-[10px] text-slate-400">
                          Soporta párrafos, viñetas con • o - y negritas con **texto**
                        </span>
                      </div>
                      <textarea
                        rows={4}
                        value={block.content || ''}
                        onChange={(e) => handleUpdateBlock(index, { ...block, content: e.target.value })}
                        placeholder="Escribe el texto detallado o las instrucciones para el colaborador..."
                        className="w-full text-xs font-medium border border-slate-200 rounded-xl p-3 bg-slate-50 text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600 focus:bg-white font-mono leading-relaxed"
                      />
                    </div>
                  </div>
                )}

                {/* 2. ALERT / NOTICE FORM */}
                {block.type === 'alert' && (
                  <div className="space-y-3">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                          Nivel de Alerta / Color *
                        </label>
                        <div className="grid grid-cols-2 gap-1.5">
                          {[
                            { id: 'info', label: 'Informativo', color: 'border-blue-300 text-blue-700 bg-blue-50' },
                            { id: 'warning', label: 'Advertencia', color: 'border-amber-300 text-amber-800 bg-amber-50' },
                            { id: 'success', label: 'Aprobado', color: 'border-emerald-300 text-emerald-800 bg-emerald-50' },
                            { id: 'danger', label: 'Urgente', color: 'border-rose-300 text-rose-800 bg-rose-50' },
                          ].map(lvl => (
                            <button
                              key={lvl.id}
                              type="button"
                              onClick={() => handleUpdateBlock(index, { ...block, level: lvl.id as any })}
                              className={`px-2.5 py-1.5 rounded-lg text-xs font-bold border transition-all text-center cursor-pointer ${
                                block.level === lvl.id 
                                  ? `${lvl.color} ring-2 ring-blue-600/30 font-extrabold shadow-2xs` 
                                  : 'border-slate-200 bg-slate-50 text-slate-600 hover:bg-slate-100'
                              }`}
                            >
                              {lvl.label}
                            </button>
                          ))}
                        </div>
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                          Título de la Alerta (Opcional)
                        </label>
                        <input
                          type="text"
                          value={block.title || ''}
                          onChange={(e) => handleUpdateBlock(index, { ...block, title: e.target.value })}
                          placeholder="ej. Aviso Importante, Atención, Requisito Clave..."
                          className="w-full text-xs font-medium border border-slate-200 rounded-xl px-3 py-2 bg-slate-50 text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600 focus:bg-white"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                        Mensaje del Aviso *
                      </label>
                      <textarea
                        rows={2}
                        value={block.message || ''}
                        onChange={(e) => handleUpdateBlock(index, { ...block, message: e.target.value })}
                        placeholder="ej. Recuerda presentar tu gafete activo antes del día 15 de cada mes..."
                        className="w-full text-xs font-medium border border-slate-200 rounded-xl p-3 bg-slate-50 text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600 focus:bg-white"
                      />
                    </div>
                  </div>
                )}

                {/* 3. FAQ FORM */}
                {block.type === 'faq' && (
                  <div className="space-y-3">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                        Título de la Sección FAQ
                      </label>
                      <input
                        type="text"
                        value={block.title || ''}
                        onChange={(e) => handleUpdateBlock(index, { ...block, title: e.target.value })}
                        placeholder="Preguntas Frecuentes"
                        className="w-full text-xs font-medium border border-slate-200 rounded-xl px-3 py-2 bg-slate-50 text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600 focus:bg-white"
                      />
                    </div>

                    <div className="space-y-2.5 pt-1">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                          Preguntas y Respuestas ({block.items?.length || 0})
                        </span>
                        <button
                          type="button"
                          onClick={() => {
                            const newItems = [...(block.items || []), { q: '', a: '' }];
                            handleUpdateBlock(index, { ...block, items: newItems });
                          }}
                          className="px-2.5 py-1 text-xs font-bold text-purple-700 bg-purple-50 hover:bg-purple-100 rounded-lg border border-purple-200/80 transition-all flex items-center gap-1 cursor-pointer"
                        >
                          <Plus className="w-3 h-3" />
                          <span>+ Añadir Pregunta</span>
                        </button>
                      </div>

                      {(!block.items || block.items.length === 0) ? (
                        <p className="text-xs text-slate-400 italic bg-slate-50 p-3 rounded-xl border border-slate-100">
                          No hay preguntas aún. Haz clic en '+ Añadir Pregunta' para agregar una.
                        </p>
                      ) : (
                        <div className="space-y-2">
                          {block.items.map((item, qIdx) => (
                            <div key={qIdx} className="bg-slate-50 p-3 rounded-xl border border-slate-200 space-y-2 relative group">
                              <div className="flex items-center justify-between gap-2">
                                <span className="text-[10px] font-extrabold text-purple-700 uppercase tracking-wider">
                                  Pregunta #{qIdx + 1}
                                </span>
                                <button
                                  type="button"
                                  onClick={() => {
                                    const newItems = block.items.filter((_, i) => i !== qIdx);
                                    handleUpdateBlock(index, { ...block, items: newItems });
                                  }}
                                  className="text-slate-400 hover:text-rose-600 p-0.5 rounded cursor-pointer"
                                  title="Eliminar pregunta"
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                </button>
                              </div>

                              <input
                                type="text"
                                value={item.q}
                                onChange={(e) => {
                                  const newItems = [...block.items];
                                  newItems[qIdx] = { ...newItems[qIdx], q: e.target.value };
                                  handleUpdateBlock(index, { ...block, items: newItems });
                                }}
                                placeholder="¿Cuál es la pregunta frecuente?"
                                className="w-full text-xs font-bold border border-slate-200 rounded-lg px-2.5 py-1.5 bg-white text-slate-900 focus:outline-none focus:ring-1 focus:ring-purple-600"
                              />

                              <textarea
                                rows={2}
                                value={item.a}
                                onChange={(e) => {
                                  const newItems = [...block.items];
                                  newItems[qIdx] = { ...newItems[qIdx], a: e.target.value };
                                  handleUpdateBlock(index, { ...block, items: newItems });
                                }}
                                placeholder="Escribe la respuesta clara y concisa..."
                                className="w-full text-xs font-normal border border-slate-200 rounded-lg p-2 bg-white text-slate-900 focus:outline-none focus:ring-1 focus:ring-purple-600"
                              />
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* 4. MEDIA FORM (IMAGE, VIDEO, PDF) */}
                {block.type === 'media' && (
                  <div className="space-y-3">
                    {/* Media Type Switcher */}
                    <div>
                      <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                        Tipo de Contenido Multimedia *
                      </label>
                      <div className="grid grid-cols-3 gap-2">
                        {[
                          { id: 'image', label: 'Infografía / Imagen', icon: ImageIcon },
                          { id: 'video', label: 'Video Tutorial', icon: Video },
                          { id: 'pdf', label: 'Formato PDF', icon: FileDown },
                        ].map(t => {
                          const IconComp = t.icon;
                          const isSelected = (block.mediaType || 'image') === t.id;
                          return (
                            <button
                              key={t.id}
                              type="button"
                              onClick={() => handleUpdateBlock(index, { ...block, mediaType: t.id as any })}
                              className={`px-3 py-2 rounded-xl text-xs font-bold border flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                                isSelected
                                  ? 'bg-emerald-50 text-emerald-800 border-emerald-300 ring-2 ring-emerald-500/20 font-extrabold shadow-2xs'
                                  : 'border-slate-200 bg-slate-50 text-slate-600 hover:bg-slate-100'
                              }`}
                            >
                              <IconComp className="w-3.5 h-3.5" />
                              <span className="truncate">{t.label}</span>
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                        Título del Archivo o Video (Opcional)
                      </label>
                      <input
                        type="text"
                        value={block.title || ''}
                        onChange={(e) => handleUpdateBlock(index, { ...block, title: e.target.value })}
                        placeholder={
                          block.mediaType === 'video' ? 'ej. Video tutorial paso a paso' :
                          block.mediaType === 'pdf' ? 'ej. Formato de Solicitud Oficial (PDF)' :
                          'ej. Infografía del Flujo de Trabajo'
                        }
                        className="w-full text-xs font-medium border border-slate-200 rounded-xl px-3 py-2 bg-slate-50 text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600 focus:bg-white"
                      />
                    </div>

                    {/* Media Upload / URL Field */}
                    <MediaUploadField
                      type={(block.mediaType as any) || 'image'}
                      label={
                        block.mediaType === 'video' ? 'Enlace o Archivo de Video *' :
                        block.mediaType === 'pdf' ? 'Archivo PDF o Formato Oficial *' :
                        'Imagen o Infografía (PNG/JPG/WebP) *'
                      }
                      value={block.url || ''}
                      onChange={(newUrl) => handleUpdateBlock(index, { ...block, url: newUrl })}
                      helperText={
                        block.mediaType === 'video' ? 'Enlace a YouTube, Vimeo o archivo MP4 local' :
                        block.mediaType === 'pdf' ? 'Sube tu documento PDF o ingresa un enlace web directo' :
                        'Sube una imagen nítida o ingresa una URL web'
                      }
                      idPrefix={`media-block-${index}`}
                    />

                    <div>
                      <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                        Pie de Foto / Subtítulo Explicativo (Opcional)
                      </label>
                      <input
                        type="text"
                        value={block.caption || ''}
                        onChange={(e) => handleUpdateBlock(index, { ...block, caption: e.target.value })}
                        placeholder="ej. Haz clic sobre la imagen para abrir en pantalla completa con zoom..."
                        className="w-full text-xs font-medium border border-slate-200 rounded-xl px-3 py-2 bg-slate-50 text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600 focus:bg-white"
                      />
                    </div>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Action Buttons to Add New Blocks */}
      <div className="bg-slate-50 border border-slate-200/90 rounded-2xl p-4 shadow-2xs space-y-3">
        <span className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
          Añadir Nuevo Bloque al Trámite
        </span>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
          <button
            type="button"
            onClick={handleAddText}
            className="px-3 py-2.5 bg-white hover:bg-blue-50 text-blue-800 border border-slate-200 hover:border-blue-300 rounded-xl text-xs font-bold transition-all shadow-2xs flex items-center justify-center gap-1.5 cursor-pointer active:scale-95"
          >
            <Type className="w-3.5 h-3.5 text-blue-600" />
            <span>+ Añadir Texto</span>
          </button>

          <button
            type="button"
            onClick={handleAddAlert}
            className="px-3 py-2.5 bg-white hover:bg-amber-50 text-amber-800 border border-slate-200 hover:border-amber-300 rounded-xl text-xs font-bold transition-all shadow-2xs flex items-center justify-center gap-1.5 cursor-pointer active:scale-95"
          >
            <AlertTriangle className="w-3.5 h-3.5 text-amber-500" />
            <span>+ Añadir Aviso</span>
          </button>

          <button
            type="button"
            onClick={handleAddFAQ}
            className="px-3 py-2.5 bg-white hover:bg-purple-50 text-purple-800 border border-slate-200 hover:border-purple-300 rounded-xl text-xs font-bold transition-all shadow-2xs flex items-center justify-center gap-1.5 cursor-pointer active:scale-95"
          >
            <HelpCircle className="w-3.5 h-3.5 text-purple-600" />
            <span>+ Añadir FAQs</span>
          </button>

          <button
            type="button"
            onClick={handleAddMedia}
            className="px-3 py-2.5 bg-white hover:bg-emerald-50 text-emerald-800 border border-slate-200 hover:border-emerald-300 rounded-xl text-xs font-bold transition-all shadow-2xs flex items-center justify-center gap-1.5 cursor-pointer active:scale-95"
          >
            <ImageIcon className="w-3.5 h-3.5 text-emerald-600" />
            <span>+ Multimedia</span>
          </button>
        </div>
      </div>
    </div>
  );
};
