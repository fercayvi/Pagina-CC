import React, { useState, useRef } from 'react';
import { 
  ChevronRight, 
  ChevronLeft, 
  ArrowLeft, 
  ArrowRight, 
  RotateCcw, 
  CheckCircle2 
} from 'lucide-react';
import { ServiceNode, LayoutBlock } from '../types';
import { LayoutBlocksRenderer } from './LayoutBlocksRenderer';

interface DecisionTreeNavigatorProps {
  tree: ServiceNode[];
  onOpenLightbox?: (url: string, title?: string) => void;
  serviceTitle?: string;
}

// Helper de retrocompatibilidad: convierte datos antiguos (contentData) en LayoutBlock[]
function getNodeBlocks(node: ServiceNode): LayoutBlock[] {
  if (node.blocks && node.blocks.length > 0) return node.blocks;
  if (node.contentData?.layoutBlocks && node.contentData.layoutBlocks.length > 0) return node.contentData.layoutBlocks;

  const fallback: LayoutBlock[] = [];
  if (node.contentData?.blocks && node.contentData.blocks.length > 0) {
    node.contentData.blocks.forEach((b, idx) => {
      if (b.text) {
        fallback.push({
          id: `legacy-txt-${b.id || idx}`,
          type: 'text',
          content: b.text,
          align: 'left',
          style: 'normal'
        });
      }
      if (b.imageUrl) {
        fallback.push({
          id: `legacy-img-${b.id || idx}`,
          type: 'media',
          mediaType: 'image',
          url: b.imageUrl,
          size: 'full',
          alignment: 'center'
        });
      }
      if (b.videoUrl) {
        fallback.push({
          id: `legacy-vid-${b.id || idx}`,
          type: 'media',
          mediaType: 'video',
          url: b.videoUrl,
          size: 'full',
          alignment: 'center'
        });
      }
    });
  } else if (node.contentData) {
    if (node.contentData.text) {
      fallback.push({
        id: `legacy-txt-${node.id}`,
        type: 'text',
        content: node.contentData.text,
        align: 'left',
        style: 'normal'
      });
    }
    if (node.contentData.imageUrl) {
      fallback.push({
        id: `legacy-img-${node.id}`,
        type: 'media',
        mediaType: 'image',
        url: node.contentData.imageUrl,
        size: 'full',
        alignment: 'center'
      });
    }
    if (node.contentData.videoUrl) {
      fallback.push({
        id: `legacy-vid-${node.id}`,
        type: 'media',
        mediaType: 'video',
        url: node.contentData.videoUrl,
        size: 'full',
        alignment: 'center'
      });
    }
  }
  return fallback;
}

// Helper to check if a title is generic/empty or placeholder
function isGenericTitle(title?: string): boolean {
  if (!title) return true;
  const t = title.trim().toLowerCase();
  return t === '' || t === '-' || t === 'opción' || t === 'opcion';
}

function getCleanButtonTitle(title?: string): string {
  return isGenericTitle(title) ? 'Continuar' : title!.trim();
}

export const DecisionTreeNavigator: React.FC<DecisionTreeNavigatorProps> = ({
  tree,
  onOpenLightbox,
  serviceTitle = 'Trámite'
}) => {
  // Navigation stack: array of selected nodes from root to current
  const [navPath, setNavPath] = useState<ServiceNode[]>([]);
  const topRef = useRef<HTMLDivElement>(null);

  // Determine current active node (null means at root level)
  const currentNode = navPath.length > 0 ? navPath[navPath.length - 1] : null;

  // Migas de pan filtradas: excluye nodos sin título real, '-', 'Opción' o que comiencen con 'Paso'
  const visibleHistory = navPath.filter(
    (node) =>
      node.title &&
      node.title.trim() !== '' &&
      node.title !== '-' &&
      node.title.toLowerCase().trim() !== 'opción' &&
      node.title.toLowerCase().trim() !== 'opcion' &&
      !node.title.trim().startsWith('Paso')
  );

  if (!tree || tree.length === 0) {
    return (
      <div className="p-8 text-center bg-slate-50 border border-slate-100 rounded-2xl shadow-sm">
        <p className="text-slate-500 font-medium">No hay opciones configuradas en este árbol de decisiones.</p>
      </div>
    );
  }

  const scrollToTop = () => {
    setTimeout(() => {
      topRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 50);
  };

  // Handlers for step-by-step navigation
  const handleSelectNode = (node: ServiceNode) => {
    setNavPath((prev) => [...prev, node]);
    scrollToTop();
  };

  const handleGoBack = () => {
    setNavPath((prev) => prev.slice(0, prev.length - 1));
    scrollToTop();
  };

  const handleJumpToStep = (index: number) => {
    setNavPath((prev) => prev.slice(0, index + 1));
    scrollToTop();
  };

  const handleReset = () => {
    setNavPath([]);
    scrollToTop();
  };

  // Current options to display if at root or category node
  const currentOptions = currentNode ? (currentNode.children || []) : tree;

  // Reusable Step Navigation Bar (Top and Bottom)
  const renderStepNavigation = (isTop: boolean) => {
    return (
      <div className={`${isTop ? 'border-b border-slate-100 pb-3 mb-3' : 'border-t border-slate-100 pt-4 mt-4'} flex items-center justify-between gap-3`}>
        {navPath.length > 0 ? (
          <button
            type="button"
            onClick={handleGoBack}
            className="px-5 py-2.5 text-sm sm:text-base font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 active:scale-95 rounded-xl transition-all flex items-center gap-2 cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4 sm:w-5 sm:h-5" />
            <span>Atrás</span>
          </button>
        ) : (
          <div />
        )}

        {currentNode?.children && currentNode.children.length > 0 ? (
          currentNode.children.length === 1 ? (
            <button
              type="button"
              onClick={() => handleSelectNode(currentNode.children![0])}
              className="px-6 py-2.5 sm:py-3 text-sm sm:text-base font-bold text-white bg-blue-600 hover:bg-blue-700 active:scale-95 rounded-xl shadow-xs transition-all flex items-center gap-2 ml-auto cursor-pointer"
            >
              <span>{getCleanButtonTitle(currentNode.children[0].title)}</span>
              <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5" />
            </button>
          ) : (
            <div className="flex flex-wrap items-center gap-2 ml-auto justify-end">
              {currentNode.children.map((childNode) => {
                const childButtonText = getCleanButtonTitle(childNode.title);
                return (
                  <button
                    key={childNode.id}
                    type="button"
                    onClick={() => handleSelectNode(childNode)}
                    className="px-5 py-2.5 sm:py-3 text-sm sm:text-base font-bold text-white bg-blue-600 hover:bg-blue-700 active:scale-95 rounded-xl shadow-xs transition-all flex items-center gap-2 cursor-pointer"
                  >
                    <span>{childButtonText}</span>
                    <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5" />
                  </button>
                );
              })}
            </div>
          )
        ) : (
          <button
            type="button"
            onClick={handleReset}
            className="px-5 py-2.5 text-sm sm:text-base font-bold text-emerald-700 bg-emerald-50 hover:bg-emerald-100 active:scale-95 rounded-xl transition-all flex items-center gap-2 ml-auto cursor-pointer"
          >
            <RotateCcw className="w-4 h-4" />
            <span>Comenzar de nuevo</span>
          </button>
        )}
      </div>
    );
  };

  return (
    <div className="w-full">
      {/* =========================================================================
          CONTENEDOR PRINCIPAL FUSIONADO (Tarjeta sin bordes marcados con sombra suave)
          ========================================================================= */}
      <div className="bg-white border border-slate-100 rounded-2xl p-4 sm:p-6 shadow-md">
        {/* Ancla para Auto-Scroll al inicio de la tarjeta */}
        <div ref={topRef} />

        {/* Barra superior de navegación: Breadcrumbs a la izquierda y Controles a la derecha */}
        {navPath.length > 0 && (
          <div className="flex flex-wrap items-center justify-between gap-3 pb-3 mb-4 border-b border-slate-100">
            {/* Breadcrumbs limpios filtrados */}
            <nav className="flex flex-wrap items-center gap-1.5 text-xs text-slate-400">
              <button
                type="button"
                onClick={handleReset}
                className="hover:text-blue-600 font-medium cursor-pointer transition-colors"
              >
                Inicio
              </button>
              {visibleHistory.map((stepNode, idx) => {
                const isLast = idx === visibleHistory.length - 1;
                return (
                  <React.Fragment key={stepNode.id}>
                    <ChevronRight className="w-3.5 h-3.5 text-slate-300 shrink-0" />
                    {isLast ? (
                      <span className="font-semibold text-slate-600 truncate max-w-[200px] sm:max-w-xs">
                        {stepNode.title}
                      </span>
                    ) : (
                      <button
                        type="button"
                        onClick={() => {
                          const targetIdx = navPath.findIndex((n) => n.id === stepNode.id);
                          if (targetIdx !== -1) handleJumpToStep(targetIdx);
                        }}
                        className="hover:text-blue-600 font-medium truncate max-w-[150px] sm:max-w-xs cursor-pointer transition-colors"
                      >
                        {stepNode.title}
                      </button>
                    )}
                  </React.Fragment>
                );
              })}
            </nav>

            {/* Controles discretos fantasma */}
            <div className="flex items-center gap-1 ml-auto">
              <button
                type="button"
                onClick={handleGoBack}
                className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-slate-500 hover:text-slate-800 hover:bg-slate-100 text-xs font-semibold transition-all cursor-pointer"
                title="Paso anterior"
              >
                <ChevronLeft className="w-4 h-4" />
                <span>Paso anterior</span>
              </button>

              <button
                type="button"
                onClick={handleReset}
                className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-slate-500 hover:text-slate-800 hover:bg-slate-100 text-xs font-semibold transition-all cursor-pointer"
                title="Reiniciar asistente"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Reiniciar</span>
              </button>
            </div>
          </div>
        )}

        {/* ==================== VISTA 1: PASO DE TUTORIAL ==================== */}
        {currentNode && currentNode.nodeType === 'step' ? (
          <div className="space-y-4 animate-fadeIn">
            {currentNode.title && !isGenericTitle(currentNode.title) && (
              <h3 className="text-lg sm:text-xl font-bold text-slate-900 leading-snug">
                {currentNode.title}
              </h3>
            )}

            {/* Barra de navegación superior del paso */}
            {renderStepNavigation(true)}

            {/* Renderizado de Bloques Enriquecidos del Page Builder */}
            <div className="my-4">
              <LayoutBlocksRenderer 
                blocks={currentNode.blocks || getNodeBlocks(currentNode)} 
                onOpenLightbox={onOpenLightbox}
                serviceTitle={serviceTitle}
              />
            </div>

            {/* Barra de navegación inferior */}
            {renderStepNavigation(false)}
          </div>
        ) : currentNode && currentNode.nodeType === 'content' ? (
          /* ==================== VISTA 2: RESOLUCIÓN FINAL ==================== */
          <div className="space-y-4 animate-fadeIn">
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider px-3 py-1 rounded-lg bg-emerald-50 text-emerald-700 border border-emerald-200">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                Resolución del Trámite
              </span>
            </div>

            {currentNode.title && !isGenericTitle(currentNode.title) && (
              <h3 className="text-lg sm:text-xl font-bold text-slate-900 leading-snug">
                {currentNode.title}
              </h3>
            )}

            {/* Renderizado de Bloques Enriquecidos del Page Builder */}
            <div className="my-4">
              <LayoutBlocksRenderer 
                blocks={currentNode.blocks || getNodeBlocks(currentNode)} 
                onOpenLightbox={onOpenLightbox}
                serviceTitle={serviceTitle}
              />
            </div>

            <div className="mt-4 pt-4 border-t border-slate-100 flex items-center justify-between gap-4">
              <button
                type="button"
                onClick={handleGoBack}
                className="px-5 py-3 text-base font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 active:scale-95 rounded-xl transition-all flex items-center gap-2 cursor-pointer"
              >
                <ArrowLeft className="w-5 h-5" />
                <span>Atrás</span>
              </button>

              <button
                type="button"
                onClick={handleReset}
                className="px-6 py-3 text-base font-bold text-white bg-blue-600 hover:bg-blue-700 active:scale-95 rounded-xl shadow-xs transition-all flex items-center gap-2 ml-auto cursor-pointer"
              >
                <RotateCcw className="w-5 h-5" />
                <span>Finalizar y Reiniciar</span>
              </button>
            </div>
          </div>
        ) : (
          /* ==================== VISTA 3: PREGUNTA Y OPCIONES ==================== */
          <div className="animate-fadeIn">
            {/* Pregunta Principal con círculo de paso con peso visual */}
            <div className="flex items-start gap-3 sm:gap-4 mb-4">
              <span className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-blue-600 text-white font-extrabold shadow-sm flex items-center justify-center text-sm shrink-0 mt-0.5">
                {navPath.length + 1}
              </span>
              <div className="flex-1 min-w-0">
                <h3 className="text-lg sm:text-xl font-bold text-slate-900 leading-snug">
                  {currentNode && !isGenericTitle(currentNode.title)
                    ? currentNode.title 
                    : '¿Qué necesitas consultar o resolver?'}
                </h3>
              </div>
            </div>

            {/* Grid de opciones con estilo azul por defecto y margen superior compacto */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5 sm:gap-4 mt-4">
              {currentOptions.map((option) => {
                const buttonText = getCleanButtonTitle(option.title);
                return (
                  <button
                    key={option.id}
                    type="button"
                    onClick={() => handleSelectNode(option)}
                    className="bg-white border border-blue-300 text-blue-700 hover:bg-blue-50 hover:shadow-md hover:-translate-y-0.5 p-4 sm:p-5 rounded-2xl flex items-center justify-between transition-all group cursor-pointer text-left min-h-[72px] shadow-2xs"
                  >
                    <div className="pr-3 flex-1 min-w-0">
                      <span className="text-sm sm:text-base font-bold text-blue-700 leading-snug">
                        {buttonText}
                      </span>
                    </div>
                    <div className="bg-blue-600 text-white rounded-full p-1 flex items-center justify-center shrink-0 shadow-2xs">
                      <ChevronRight className="w-5 h-5 transition-transform group-hover:translate-x-0.5" strokeWidth={2.5} />
                    </div>
                  </button>
                );
              })}
            </div>

            {currentOptions.length === 0 && (
              <div className="p-6 bg-slate-50 rounded-2xl border border-slate-200 text-center mt-4">
                <p className="text-sm font-medium text-slate-500">No hay más opciones disponibles en esta rama.</p>
                <button
                  type="button"
                  onClick={handleGoBack}
                  className="mt-3 px-4 py-2 bg-blue-600 text-white text-sm font-bold rounded-xl cursor-pointer"
                >
                  Volver al paso anterior
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default DecisionTreeNavigator;
