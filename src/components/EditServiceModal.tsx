import React, { useState, useEffect } from 'react';
import { 
  X, Save, FileText, CheckCircle2, 
  HelpCircle, AlertTriangle, Plus, Trash2, MapPin, Clock, Phone,
  Sparkles, Eye, Image as ImageLucide, Layers, GitBranch, LayoutGrid,
  Maximize2, Type
} from 'lucide-react';
import { Service } from '../types';
import { MediaUploadField } from './MediaUploadField';
import { SERVICE_ICON_MAP } from './ServiceCard';
import { DecisionTreeBuilder } from './DecisionTreeBuilder';
import { DecisionTreeNavigator } from './DecisionTreeNavigator';
import { DecisionTreeCanvasEditor } from './DecisionTreeCanvasEditor';
import { PageBuilderFullScreenEditor } from './PageBuilderFullScreenEditor';
import { ensureServiceLayoutBlocks } from '../utils/layoutBlocks';

interface EditServiceModalProps {
  isOpen: boolean;
  onClose: () => void;
  service: (Service & { hidden?: boolean }) | null;
  onSave: (updatedService: Service & { hidden?: boolean }) => void;
}

export const EditServiceModal: React.FC<EditServiceModalProps> = ({
  isOpen,
  onClose,
  service,
  onSave
}) => {
  const [activeTab, setActiveTab] = useState<'general' | 'arbol' | 'bloques'>('general');
  const [editingService, setEditingService] = useState<(Service & { hidden?: boolean }) | null>(null);
  const [visualMode, setVisualMode] = useState<'icon' | 'image'>('icon');
  const [isFlowEditorOpen, setIsFlowEditorOpen] = useState(false);
  const [isPageBuilderOpen, setIsPageBuilderOpen] = useState(false);

  useEffect(() => {
    if (service) {
      const hasImage = Boolean(service.cardImage && service.cardImage.trim().length > 0);
      setVisualMode(hasImage ? 'image' : 'icon');
      setEditingService({
        ...service,
        layoutBlocks: ensureServiceLayoutBlocks(service),
        steps: service.steps ? [...service.steps] : [],
        requirements: service.requirements ? [...service.requirements] : [],
        faqs: service.faqs ? [...service.faqs] : [],
        decisionTree: service.decisionTree ? [...service.decisionTree] : [],
        cardImage: service.cardImage || '',
        imageUrl: service.imageUrl || '',
        videoUrl: service.videoUrl || '',
        pdfUrl: service.pdfUrl || '',
        pdfTitle: service.pdfTitle || '',
        alertNotice: service.alertNotice || ''
      });
    }
  }, [service, isOpen]);

  if (!isOpen || !editingService) return null;

  // Render Fullscreen Page Builder Editor if open
  if (isPageBuilderOpen) {
    return (
      <PageBuilderFullScreenEditor
        blocks={editingService.layoutBlocks || []}
        onChange={(newBlocks) => {
          setEditingService(prev => prev ? ({ ...prev, layoutBlocks: newBlocks }) : prev);
        }}
        onClose={() => setIsPageBuilderOpen(false)}
        serviceTitle={editingService.title || 'Trámite'}
      />
    );
  }

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingService.title.trim()) {
      alert('Por favor, ingresa el título del trámite.');
      return;
    }
    // If user explicitly chose icon mode and emptied cardImage, ensure cardImage is clean
    const serviceToSave = {
      ...editingService,
      cardImage: visualMode === 'icon' && !editingService.cardImage ? '' : editingService.cardImage
    };
    onSave(serviceToSave);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-fadeIn">
      <div className="bg-white rounded-2xl w-full max-w-4xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[92vh]">
        
        {/* Modal Header */}
        <div className="p-4 sm:p-5 bg-slate-900 text-white flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-600/30 border border-blue-400/40 flex items-center justify-center text-blue-400">
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-base text-white">
                {editingService.id ? 'Editar Trámite o Servicio' : 'Nuevo Trámite de Talento y Cultura'}
              </h3>
              <p className="text-xs text-slate-300">
                {editingService.title || 'Configura la información para el catálogo del colaborador'}
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-white rounded-xl hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Navigation Tabs */}
        <div className="flex border-b border-slate-200 bg-slate-100/80 px-4 pt-2 gap-1 overflow-x-auto custom-scrollbar shrink-0">
          <button
            type="button"
            onClick={() => setActiveTab('general')}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 whitespace-nowrap cursor-pointer ${
              activeTab === 'general'
                ? 'bg-white text-blue-700 shadow-2xs border border-slate-200'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
            }`}
          >
            <FileText className="w-3.5 h-3.5" />
            <span>General</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('arbol')}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 whitespace-nowrap cursor-pointer ${
              activeTab === 'arbol'
                ? 'bg-white text-blue-700 shadow-2xs border border-slate-200 font-extrabold'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
            }`}
          >
            <Layers className="w-3.5 h-3.5 text-blue-600" />
            <span>Árbol de Decisión ({editingService.decisionTree?.length || 0})</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('bloques')}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 whitespace-nowrap cursor-pointer ${
              activeTab === 'bloques'
                ? 'bg-white text-blue-700 shadow-2xs border border-slate-200 font-extrabold'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
            }`}
          >
            <LayoutGrid className="w-3.5 h-3.5 text-blue-600" />
            <span>Constructor de Página ({editingService.layoutBlocks?.length || 0})</span>
          </button>
        </div>

        {/* Modal Form Content */}
        <form onSubmit={handleSave} className="flex flex-col flex-1 min-h-0">
          <div className="p-5 overflow-y-auto custom-scrollbar flex-1 space-y-4">

            {/* TAB 1: INFORMACIÓN GENERAL */}
            {activeTab === 'general' && (
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 animate-fadeIn">
                {/* Form Fields Left Column */}
                <div className="lg:col-span-7 space-y-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                      Título del Trámite *
                    </label>
                    <input
                      type="text"
                      value={editingService.title}
                      onChange={(e) => setEditingService({ ...editingService, title: e.target.value })}
                      placeholder="Ej. Póliza de Seguro Social o Solicitud de Vacaciones"
                      className="w-full px-3 py-2 text-xs font-medium border border-slate-200 rounded-xl bg-slate-50 text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600 focus:bg-white"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                      Módulo / Categoría Oficial *
                    </label>
                    <select
                      value={editingService.category}
                      onChange={(e) => setEditingService({ ...editingService, category: e.target.value as any })}
                      className="w-full px-3 py-2 text-xs font-medium border border-slate-200 rounded-xl bg-slate-50 text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600 focus:bg-white"
                    >
                      <option value="Nómina y Pagos">Nómina y Pagos</option>
                      <option value="Tarjetas y Créditos">Tarjetas y Créditos</option>
                      <option value="Control y Asistencia">Control y Asistencia</option>
                    </select>
                  </div>

                  {/* IDENTIFICADOR VISUAL DE LA TARJETA (SELECTOR ÍCONO vs FOTO) */}
                  <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-2xl space-y-3">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-200/80 pb-2.5">
                      <div>
                        <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider">
                          Identificador Visual de la Tarjeta *
                        </label>
                        <p className="text-[11px] text-slate-500">
                          Elige cómo se presentará este trámite en el catálogo de inicio.
                        </p>
                      </div>

                      <div className="flex bg-slate-200/80 p-0.5 rounded-xl text-xs font-semibold shrink-0">
                        <button
                          type="button"
                          onClick={() => setVisualMode('icon')}
                          className={`px-3 py-1.5 rounded-lg transition-all flex items-center gap-1.5 cursor-pointer ${
                            visualMode === 'icon'
                              ? 'bg-white text-blue-700 shadow-xs font-bold'
                              : 'text-slate-600 hover:text-slate-900'
                          }`}
                        >
                          <FileText className="w-3.5 h-3.5" />
                          <span>Usar Ícono</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => setVisualMode('image')}
                          className={`px-3 py-1.5 rounded-lg transition-all flex items-center gap-1.5 cursor-pointer ${
                            visualMode === 'image'
                              ? 'bg-white text-blue-700 shadow-xs font-bold'
                              : 'text-slate-600 hover:text-slate-900'
                          }`}
                        >
                          <ImageLucide className="w-3.5 h-3.5" />
                          <span>Subir Foto</span>
                        </button>
                      </div>
                    </div>

                    {visualMode === 'icon' ? (
                      <div>
                        <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-1">
                          Seleccionar Ícono Vectorial
                        </label>
                        <select
                          value={editingService.iconName || editingService.icon || 'FileText'}
                          onChange={(e) => setEditingService({ ...editingService, iconName: e.target.value, icon: e.target.value })}
                          className="w-full px-3 py-2 text-xs font-medium border border-slate-200 rounded-xl bg-white text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600"
                        >
                          <option value="Banknote">💵 Billete (Banknote)</option>
                          <option value="Coins">🪙 Monedas (Coins)</option>
                          <option value="ReceiptText">🧾 Recibo / Nómina (ReceiptText)</option>
                          <option value="FileText">📄 Documento (FileText)</option>
                          <option value="FileCheck">✅ Documento Verificado (FileCheck)</option>
                          <option value="HelpCircle">❓ Duda / Ayuda (HelpCircle)</option>
                          <option value="CreditCard">💳 Tarjeta (CreditCard)</option>
                          <option value="PiggyBank">🐷 Ahorro (PiggyBank)</option>
                          <option value="Home">🏠 Casa (Home)</option>
                          <option value="Calendar">📅 Calendario (Calendar)</option>
                          <option value="CalendarDays">📆 Días Calendario (CalendarDays)</option>
                          <option value="Shield">🛡️ Seguridad / Salud (Shield)</option>
                          <option value="ShieldAlert">🛡️ Alerta de Seguridad (ShieldAlert)</option>
                          <option value="Clock">⏰ Reloj (Clock)</option>
                          <option value="Briefcase">💼 Maletín (Briefcase)</option>
                        </select>
                      </div>
                    ) : (
                      <div className="space-y-2">
                        <MediaUploadField
                          type="image"
                          label="Imagen / Foto de la tarjeta (Opcional)"
                          value={editingService.cardImage || ''}
                          onChange={(val) => setEditingService(prev => prev ? ({ ...prev, cardImage: val }) : prev)}
                          placeholderUrl="https://ejemplo.com/foto_tarjeta.jpg o .png"
                          helperText="Sube una foto o pega un enlace. Se ajustará automáticamente a proporción cuadrada con bordes redondeados."
                          idPrefix="modal-service-card-general"
                        />
                      </div>
                    )}
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                      Descripción Corta (Tarjeta Catálogo) *
                    </label>
                    <textarea
                      rows={2}
                      value={editingService.shortDesc}
                      onChange={(e) => setEditingService({ ...editingService, shortDesc: e.target.value })}
                      placeholder="Resumen para la vista en cuadrícula..."
                      className="w-full px-3 py-2 text-xs font-medium border border-slate-200 rounded-xl bg-slate-50 text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600 focus:bg-white"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                      Descripción Completa (Vista Detalle)
                    </label>
                    <textarea
                      rows={3}
                      value={editingService.fullDescription || ''}
                      onChange={(e) => setEditingService({ ...editingService, fullDescription: e.target.value })}
                      placeholder="Explicación detallada del trámite para el trabajador..."
                      className="w-full px-3 py-2 text-xs font-medium border border-slate-200 rounded-xl bg-slate-50 text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600 focus:bg-white"
                    />
                  </div>
                </div>

                {/* Right Column: Live Card Preview */}
                <div className="lg:col-span-5 flex flex-col justify-start">
                  <div className="bg-slate-100/80 rounded-2xl p-4 border border-slate-200 space-y-3 sticky top-0">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1.5 text-xs font-extrabold uppercase tracking-wider text-slate-700">
                        <Eye className="w-3.5 h-3.5 text-blue-600" />
                        <span>Vista previa de la Tarjeta</span>
                      </div>
                      <span className="text-[10px] font-bold text-slate-400 bg-white px-2 py-0.5 rounded-full border border-slate-200">
                        En vivo
                      </span>
                    </div>

                    <p className="text-[11px] text-slate-500">
                      Así se mostrará este trámite en el catálogo general:
                    </p>

                    {/* Card Mockup */}
                    <div className="bg-white border-2 border-slate-200 rounded-2xl p-5 flex flex-col items-center justify-center text-center shadow-sm w-full transition-all">
                      <div className="mb-3 flex items-center justify-center">
                        {editingService.cardImage && editingService.cardImage.trim().length > 0 ? (
                          <img 
                            src={editingService.cardImage} 
                            alt={editingService.title || 'Foto de tarjeta'} 
                            className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl object-cover shadow-sm border border-slate-200 mx-auto mb-2" 
                          />
                        ) : (
                          <div className="w-16 h-16 rounded-2xl bg-blue-100 text-blue-700 border-2 border-blue-300 flex items-center justify-center shadow-sm mx-auto">
                            {React.createElement(
                              SERVICE_ICON_MAP[editingService.iconName || editingService.icon || 'FileText'] || FileText, 
                              { size: 32, strokeWidth: 2.5 }
                            )}
                          </div>
                        )}
                      </div>

                      <div className="w-full space-y-1.5">
                        <span className="inline-block text-[10px] font-extrabold uppercase tracking-wider text-blue-700 bg-blue-50 border border-blue-200/80 px-2 py-0.5 rounded-md">
                          {editingService.category || 'Categoría'}
                        </span>
                        <h4 className="text-sm font-bold text-slate-900 leading-snug line-clamp-2">
                          {editingService.title || 'Título del Trámite'}
                        </h4>
                        <p className="text-xs text-slate-500 font-medium line-clamp-2 leading-relaxed">
                          {editingService.shortDesc || 'Descripción corta de ejemplo para la tarjeta del catálogo...'}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* TAB: ÁRBOL DE DECISIÓN (DIVULGACIÓN PROGRESIVA) */}
            {activeTab === 'arbol' && (
              <div className="space-y-5 animate-fadeIn">
                {/* Banner de acceso al Editor de Diagrama de Flujo en Pantalla Completa */}
                <div className="bg-gradient-to-r from-blue-50 via-indigo-50/40 to-slate-50 border border-blue-200/80 rounded-2xl p-6 shadow-xs">
                  <div className="space-y-1.5">
                    <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md bg-blue-100/70 text-blue-700 text-[11px] font-bold uppercase tracking-wider">
                      <Layers className="w-3.5 h-3.5" />
                      <span>Editor Visual Bidimensional</span>
                    </div>
                    <h4 className="text-sm font-bold text-gray-900">
                      Editor de Diagrama de Flujo (Flowchart Canvas)
                    </h4>
                    <p className="text-xs text-gray-600 max-w-xl leading-relaxed">
                      Edita el árbol de decisiones en un lienzo infinito interactivo con zoom, paneo, conexión de ramas y panel de propiedades lateral.
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={() => setIsFlowEditorOpen(true)}
                    className="w-full mt-4 bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-4 rounded-xl flex items-center justify-center gap-2 shadow-sm transition-all cursor-pointer active:scale-95"
                  >
                    <GitBranch className="w-4 h-4" />
                    <span>Abrir Editor en Pantalla Completa</span>
                  </button>

                  <div className="mt-4 pt-3 border-t border-blue-100 flex items-center justify-between text-xs text-blue-900/80 font-medium">
                    <span>Estado actual: {editingService.decisionTree?.length || 0} ramas de nivel raíz</span>
                    <span className="text-[11px] text-blue-600 font-semibold">React Flow 2D Canvas</span>
                  </div>
                </div>

                {/* Live Interactive Preview for Admin */}
                {editingService.decisionTree && editingService.decisionTree.length > 0 ? (
                  <div className="space-y-3">
                    <div className="flex items-center justify-between px-1">
                      <span className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
                        <Eye className="w-3.5 h-3.5 text-blue-600" />
                        Vista Previa Interactiva (Estilo Colaborador)
                      </span>
                      <span className="text-[10px] text-slate-500 font-medium">
                        Prueba la navegación paso a paso
                      </span>
                    </div>

                    <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200">
                      <DecisionTreeNavigator
                        tree={editingService.decisionTree}
                        serviceTitle={editingService.title}
                      />
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-8 px-4 bg-slate-50 border border-dashed border-slate-200 rounded-2xl space-y-3">
                    <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center mx-auto">
                      <GitBranch className="w-6 h-6" />
                    </div>
                    <div className="space-y-1">
                      <h5 className="text-xs font-bold text-slate-800">No hay árbol de decisiones creado aún</h5>
                      <p className="text-xs text-slate-500 max-w-sm mx-auto">
                        Haz clic en el botón superior para abrir el lienzo visual y comenzar a trazar las preguntas y opciones de este trámite.
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => setIsFlowEditorOpen(true)}
                      className="px-4 py-2 bg-white border border-blue-200 text-blue-700 hover:bg-blue-50 rounded-xl text-xs font-bold transition-colors cursor-pointer inline-flex items-center gap-1.5"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>Crear Primer Diagrama</span>
                    </button>
                  </div>
                )}
              </div>
            )}

            {/* TAB: CONSTRUCTOR DE PÁGINA (BLOQUES MODULARES) */}
            {activeTab === 'bloques' && (
              <div className="space-y-5 animate-fadeIn">
                {/* Banner de acceso al Editor de Página en Pantalla Completa */}
                <div className="bg-gradient-to-r from-blue-50 via-indigo-50/40 to-slate-50 border border-blue-200/80 rounded-2xl p-6 shadow-xs">
                  <div className="space-y-1.5">
                    <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md bg-blue-100/70 text-blue-700 text-[11px] font-bold uppercase tracking-wider">
                      <LayoutGrid className="w-3.5 h-3.5 text-blue-600" />
                      <span>Constructor de Bloques Modulares</span>
                    </div>
                    <h4 className="text-sm font-bold text-slate-900">
                      Editor de Página Completa (Block Builder)
                    </h4>
                    <p className="text-xs text-slate-600 max-w-xl leading-relaxed">
                      Diseña la estructura del trámite organizando bloques de texto con formato, avisos de alerta, preguntas frecuentes y material multimedia en un espacio amplio y sin distracciones.
                    </p>
                  </div>

                  {/* Botón Principal Grande (Launcher) */}
                  <button
                    id="btn-open-page-builder-fullscreen"
                    type="button"
                    onClick={() => setIsPageBuilderOpen(true)}
                    className="w-full mt-4 bg-blue-600 hover:bg-blue-700 text-white font-bold py-3.5 px-5 rounded-xl flex items-center justify-center gap-2 shadow-sm transition-all cursor-pointer active:scale-95 text-xs sm:text-sm"
                  >
                    <Maximize2 className="w-4 h-4" />
                    <span>Abrir Editor de Página (Pantalla Completa)</span>
                  </button>

                  <div className="mt-4 pt-3 border-t border-blue-100 flex items-center justify-between text-xs text-blue-900/80 font-medium">
                    <span className="font-bold">
                      Estado actual: {editingService.layoutBlocks?.length || 0}{' '}
                      {(editingService.layoutBlocks?.length || 0) === 1
                        ? 'bloque configurado'
                        : 'bloques configurados'}
                    </span>
                    <span className="text-[11px] text-blue-600 font-semibold">
                      Layout Blocks v2
                    </span>
                  </div>
                </div>

                {/* Tarjeta de Resumen Limpia de Bloques */}
                {editingService.layoutBlocks && editingService.layoutBlocks.length > 0 ? (
                  <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-2xs space-y-3">
                    <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                      <span className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
                        <Layers className="w-3.5 h-3.5 text-blue-600" />
                        Resumen de Bloques Configurados
                      </span>
                      <span className="text-[11px] font-bold text-blue-700 bg-blue-50 px-2 py-0.5 rounded-md border border-blue-200/70">
                        {editingService.layoutBlocks.length}{' '}
                        {editingService.layoutBlocks.length === 1 ? 'bloque configurado' : 'bloques configurados'}
                      </span>
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                      <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-200/80 flex flex-col items-center justify-center text-center">
                        <Type className="w-4 h-4 text-blue-600 mb-1" />
                        <span className="text-[11px] font-bold text-slate-700">
                          {editingService.layoutBlocks.filter(b => b.type === 'text').length}
                        </span>
                        <span className="text-[10px] text-slate-400">Texto</span>
                      </div>
                      <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-200/80 flex flex-col items-center justify-center text-center">
                        <AlertTriangle className="w-4 h-4 text-amber-500 mb-1" />
                        <span className="text-[11px] font-bold text-slate-700">
                          {editingService.layoutBlocks.filter(b => b.type === 'alert').length}
                        </span>
                        <span className="text-[10px] text-slate-400">Avisos</span>
                      </div>
                      <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-200/80 flex flex-col items-center justify-center text-center">
                        <HelpCircle className="w-4 h-4 text-purple-600 mb-1" />
                        <span className="text-[11px] font-bold text-slate-700">
                          {editingService.layoutBlocks.filter(b => b.type === 'faq').length}
                        </span>
                        <span className="text-[10px] text-slate-400">FAQs</span>
                      </div>
                      <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-200/80 flex flex-col items-center justify-center text-center">
                        <ImageLucide className="w-4 h-4 text-emerald-600 mb-1" />
                        <span className="text-[11px] font-bold text-slate-700">
                          {editingService.layoutBlocks.filter(b => b.type === 'media').length}
                        </span>
                        <span className="text-[10px] text-slate-400">Media</span>
                      </div>
                    </div>

                    <p className="text-[11px] text-slate-500 text-center pt-1">
                      Para editar, reordenar o añadir nuevos bloques, haz clic en el botón superior de Pantalla Completa.
                    </p>
                  </div>
                ) : (
                  <div className="text-center py-8 px-4 bg-slate-50 border border-dashed border-slate-200 rounded-2xl space-y-3">
                    <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center mx-auto border border-blue-100">
                      <LayoutGrid className="w-6 h-6" />
                    </div>
                    <div className="space-y-1">
                      <h5 className="text-xs font-bold text-slate-800">
                        0 bloques configurados actualmente
                      </h5>
                      <p className="text-xs text-slate-500 max-w-sm mx-auto">
                        Este trámite aún no tiene bloques modulares. Abre el editor en pantalla completa para comenzar a agregar textos, avisos, preguntas frecuentes y multimedia.
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => setIsPageBuilderOpen(true)}
                      className="px-4 py-2 bg-white border border-blue-200 text-blue-700 hover:bg-blue-50 rounded-xl text-xs font-bold transition-colors cursor-pointer inline-flex items-center gap-1.5"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>Crear Primeros Bloques</span>
                    </button>
                  </div>
                )}
              </div>
            )}





          </div>

          {/* Modal Footer Controls */}
          <div className="p-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between gap-2 shrink-0">
            <div className="text-[11px] text-slate-500 font-medium hidden sm:block">
              Los cambios se actualizarán inmediatamente en el portal y LocalStorage.
            </div>
            <div className="flex items-center gap-2 ml-auto">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-xs font-bold text-slate-600 bg-white border border-slate-200 rounded-xl hover:bg-slate-100 cursor-pointer"
              >
                Cancelar
              </button>
              <button
                type="submit"
                className="px-5 py-2 text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-xl flex items-center gap-1.5 shadow-2xs active:scale-95 transition-all cursor-pointer"
              >
                <Save className="w-4 h-4" />
                <span>Guardar Cambios</span>
              </button>
            </div>
          </div>
        </form>

      </div>

      {/* Fullscreen Flowchart Canvas Editor */}
      {isFlowEditorOpen && editingService && (
        <DecisionTreeCanvasEditor
          tree={editingService.decisionTree || []}
          serviceTitle={editingService.title}
          onSave={(newTree) => {
            setEditingService(prev => prev ? ({ ...prev, decisionTree: newTree }) : prev);
            setIsFlowEditorOpen(false);
          }}
          onClose={() => setIsFlowEditorOpen(false)}
        />
      )}
    </div>
  );
};
