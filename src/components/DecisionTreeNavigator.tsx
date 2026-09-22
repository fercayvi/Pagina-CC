import React, { useState } from 'react';
import { 
  ChevronRight, 
  ChevronLeft, 
  ZoomIn,
  ListOrdered,
  ArrowLeft,
  ArrowRight,
  RotateCcw,
  CheckCircle2
} from 'lucide-react';
import { ServiceNode } from '../types';

interface DecisionTreeNavigatorProps {
  tree: ServiceNode[];
  onOpenLightbox?: (url: string, title?: string) => void;
  serviceTitle?: string;
}

// Helper to check and extract embed video info
function getEmbedVideoInfo(url?: string) {
  if (!url || typeof url !== 'string' || !url.trim()) return null;
  const cleanUrl = url.trim();

  // YouTube match
  const ytMatch = cleanUrl.match(/(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))([\w-]{11})/);
  if (ytMatch && ytMatch[1]) {
    return {
      type: 'youtube',
      embedUrl: `https://www.youtube-nocookie.com/embed/${ytMatch[1]}?rel=0&modestbranding=1`
    };
  }

  // Vimeo match
  const vimeoMatch = cleanUrl.match(/(?:vimeo\.com\/)(\d+)/);
  if (vimeoMatch && vimeoMatch[1]) {
    return {
      type: 'vimeo',
      embedUrl: `https://player.vimeo.com/video/${vimeoMatch[1]}`
    };
  }

  // Direct video file
  return {
    type: 'direct',
    embedUrl: cleanUrl
  };
}

export const DecisionTreeNavigator: React.FC<DecisionTreeNavigatorProps> = ({
  tree,
  onOpenLightbox,
  serviceTitle = 'Trámite'
}) => {
  // Navigation stack: array of selected nodes from root to current
  const [navPath, setNavPath] = useState<ServiceNode[]>([]);

  if (!tree || tree.length === 0) {
    return (
      <div className="p-8 text-center bg-slate-50 border border-slate-100 rounded-2xl shadow-sm">
        <p className="text-slate-500 font-medium">No hay opciones configuradas en este árbol de decisiones.</p>
      </div>
    );
  }

  // Determine current active node (null means at root level)
  const currentNode = navPath.length > 0 ? navPath[navPath.length - 1] : null;

  // Handlers for step-by-step navigation
  const handleSelectNode = (node: ServiceNode) => {
    setNavPath((prev) => [...prev, node]);
  };

  const handleGoBack = () => {
    setNavPath((prev) => prev.slice(0, prev.length - 1));
  };

  const handleJumpToStep = (index: number) => {
    setNavPath((prev) => prev.slice(0, index + 1));
  };

  const handleReset = () => {
    setNavPath([]);
  };

  // Video info if current content or step node has video
  const currentVideoInfo = currentNode && (currentNode.nodeType === 'content' || currentNode.nodeType === 'step')
    ? getEmbedVideoInfo(currentNode.contentData?.videoUrl) 
    : null;

  // Current options to display if at root or category node
  const currentOptions = currentNode ? (currentNode.children || []) : tree;

  // Reusable Step Navigation Bar (Top and Bottom)
  const renderStepNavigation = (isTop: boolean) => {
    return (
      <div className={`${isTop ? 'border-b border-slate-100 pb-4 mb-4' : 'border-t border-slate-100 pt-5 mt-5'} flex items-center justify-between gap-3`}>
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
              <span>{(!currentNode.children[0].title || currentNode.children[0].title.trim() === '' || currentNode.children[0].title === '-') ? 'Continuar' : currentNode.children[0].title}</span>
              <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5" />
            </button>
          ) : (
            <div className="flex flex-wrap items-center gap-2 ml-auto justify-end">
              {currentNode.children.map((childNode) => {
                const childButtonText = (!childNode.title || childNode.title.trim() === '' || childNode.title === '-') ? 'Continuar' : childNode.title;
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
      <div className="bg-white border border-slate-100 rounded-2xl p-6 sm:p-8 shadow-md">
        {/* Barra superior de navegación: Breadcrumbs a la izquierda y Controles a la derecha */}
        {navPath.length > 0 && (
          <div className="flex flex-wrap items-center justify-between gap-3 pb-4 mb-5 border-b border-slate-100">
            {/* Breadcrumbs limpios */}
            <nav className="flex flex-wrap items-center gap-1.5 text-xs text-slate-400">
              <button
                type="button"
                onClick={handleReset}
                className="hover:text-blue-600 font-medium cursor-pointer transition-colors"
              >
                Inicio
              </button>
              {navPath.map((stepNode, idx) => (
                <React.Fragment key={stepNode.id}>
                  <ChevronRight className="w-3.5 h-3.5 text-slate-300 shrink-0" />
                  {idx === navPath.length - 1 ? (
                    <span className="font-semibold text-slate-600 truncate max-w-[200px] sm:max-w-xs">
                      {stepNode.title}
                    </span>
                  ) : (
                    <button
                      type="button"
                      onClick={() => handleJumpToStep(idx)}
                      className="hover:text-blue-600 font-medium truncate max-w-[150px] sm:max-w-xs cursor-pointer transition-colors"
                    >
                      {stepNode.title}
                    </button>
                  )}
                </React.Fragment>
              ))}
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
          <div className="space-y-5 animate-fadeIn">
            <div className="flex items-center gap-3">
              <span className="w-8 h-8 rounded-full bg-purple-600 text-white font-extrabold shadow-sm flex items-center justify-center text-sm shrink-0">
                {navPath.length}
              </span>
              <span className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider px-3 py-1 rounded-lg bg-purple-50 text-purple-700 border border-purple-200">
                <ListOrdered className="w-4 h-4 text-purple-600" />
                Paso de Instrucción
              </span>
            </div>

            {currentNode.title && (
              <h3 className="text-lg sm:text-xl font-bold text-slate-900 leading-snug">
                {currentNode.title}
              </h3>
            )}

            {/* Barra de navegación superior del paso */}
            {renderStepNavigation(true)}

            {/* Renderizado de Bloques de Contenido */}
            <div className="space-y-8 my-5">
              {((currentNode.contentData?.blocks && currentNode.contentData.blocks.length > 0)
                ? currentNode.contentData.blocks
                : [
                    {
                      id: 'default',
                      text: currentNode.contentData?.text || '',
                      imageUrl: currentNode.contentData?.imageUrl || '',
                      videoUrl: currentNode.contentData?.videoUrl || '',
                    }
                  ]
              ).map((block, index) => {
                const blockVideo = getEmbedVideoInfo(block.videoUrl);
                return (
                  <div key={block.id || `block-${index}`} className="space-y-4">
                    {block.text && (
                      <div className="text-base sm:text-lg text-slate-700 leading-relaxed whitespace-pre-line font-normal">
                        {block.text}
                      </div>
                    )}

                    {block.imageUrl && (
                      <div className="w-full flex justify-center my-4">
                        <div 
                          onClick={() => onOpenLightbox && onOpenLightbox(block.imageUrl!, `${currentNode.title} - Imagen ${index + 1}`)}
                          className="relative group cursor-pointer overflow-hidden rounded-2xl border border-slate-200 inline-block max-w-full bg-slate-50 shadow-2xs hover:shadow-md transition-all"
                          title="Clic para ampliar imagen"
                        >
                          <img 
                            src={block.imageUrl} 
                            alt={`${currentNode.title} - Imagen ${index + 1}`} 
                            className="max-w-full md:max-w-2xl h-auto rounded-2xl object-contain" 
                          />
                          <div className="absolute inset-0 bg-slate-900/40 opacity-0 group-hover:opacity-100 transition-opacity rounded-2xl flex items-center justify-center gap-2 text-white text-sm font-bold">
                            <ZoomIn className="w-5 h-5" />
                            <span>Ampliar</span>
                          </div>
                        </div>
                      </div>
                    )}

                    {blockVideo && (
                      <div className="w-full flex justify-center my-4">
                        <div className="w-full max-w-3xl aspect-video rounded-2xl overflow-hidden shadow-xs bg-black border border-slate-200">
                          {blockVideo.type === 'direct' ? (
                            <video src={blockVideo.embedUrl} controls className="w-full h-full" />
                          ) : (
                            <iframe
                              src={blockVideo.embedUrl}
                              title={`${currentNode.title} - Video ${index + 1}`}
                              className="w-full h-full border-0"
                              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                              allowFullScreen
                            />
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            {/* Barra de navegación inferior */}
            {renderStepNavigation(false)}
          </div>
        ) : currentNode && currentNode.nodeType === 'content' ? (
          /* ==================== VISTA 2: RESOLUCIÓN FINAL ==================== */
          <div className="space-y-6 animate-fadeIn">
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider px-3 py-1 rounded-lg bg-emerald-50 text-emerald-700 border border-emerald-200">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                Resolución del Trámite
              </span>
            </div>

            <h3 className="text-lg sm:text-xl font-bold text-slate-900 leading-snug">
              {currentNode.title}
            </h3>

            {currentNode.contentData?.text && (
              <div className="text-base sm:text-lg text-slate-700 leading-relaxed whitespace-pre-line font-normal">
                {currentNode.contentData.text}
              </div>
            )}

            {currentNode.contentData?.imageUrl && (
              <div className="w-full flex justify-center my-4">
                <div 
                  onClick={() => onOpenLightbox && onOpenLightbox(currentNode.contentData!.imageUrl!, currentNode.title)}
                  className="relative group cursor-pointer overflow-hidden rounded-2xl border border-slate-200 inline-block max-w-full bg-slate-50 shadow-2xs hover:shadow-md transition-all"
                  title="Clic para ampliar imagen"
                >
                  <img 
                    src={currentNode.contentData.imageUrl} 
                    alt={currentNode.title} 
                    className="max-w-full md:max-w-2xl h-auto rounded-2xl object-contain" 
                  />
                  <div className="absolute inset-0 bg-slate-900/40 opacity-0 group-hover:opacity-100 transition-opacity rounded-2xl flex items-center justify-center gap-2 text-white text-sm font-bold">
                    <ZoomIn className="w-5 h-5" />
                    <span>Ampliar</span>
                  </div>
                </div>
              </div>
            )}

            {currentVideoInfo && (
              <div className="w-full flex justify-center my-4">
                <div className="w-full max-w-3xl aspect-video rounded-2xl overflow-hidden shadow-xs bg-black border border-slate-200">
                  {currentVideoInfo.type === 'direct' ? (
                    <video src={currentVideoInfo.embedUrl} controls className="w-full h-full" />
                  ) : (
                    <iframe
                      src={currentVideoInfo.embedUrl}
                      title={currentNode.title}
                      className="w-full h-full border-0"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                    />
                  )}
                </div>
              </div>
            )}

            <div className="mt-8 pt-5 border-t border-slate-100 flex items-center justify-between gap-4">
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
            <div className="flex items-start gap-3 sm:gap-4 mb-6">
              <span className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-blue-600 text-white font-extrabold shadow-sm flex items-center justify-center text-sm shrink-0 mt-0.5">
                {navPath.length + 1}
              </span>
              <div className="flex-1 min-w-0">
                <h3 className="text-lg sm:text-xl font-bold text-slate-900 leading-snug">
                  {currentNode ? currentNode.title : '¿Qué necesitas consultar o resolver?'}
                </h3>
              </div>
            </div>

            {/* Grid de opciones con estilo azul por defecto */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5 sm:gap-4">
              {currentOptions.map((option) => {
                const buttonText = (!option.title || option.title.trim() === '' || option.title === '-') ? 'Continuar' : option.title;
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
