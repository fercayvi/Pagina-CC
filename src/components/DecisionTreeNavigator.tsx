import React, { useState } from 'react';
import { 
  ChevronRight, 
  ChevronLeft, 
  ZoomIn,
  ListOrdered,
  ArrowLeft,
  ArrowRight
} from 'lucide-react';
import { ServiceNode, ContentBlock } from '../types';

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
  onOpenLightbox
}) => {
  // Navigation stack: array of selected nodes from root to current
  const [navPath, setNavPath] = useState<ServiceNode[]>([]);

  if (!tree || tree.length === 0) {
    return null;
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

  // Video info if current content or step node has video
  const currentVideoInfo = currentNode && (currentNode.nodeType === 'content' || currentNode.nodeType === 'step')
    ? getEmbedVideoInfo(currentNode.contentData?.videoUrl) 
    : null;

  // Current options to display if at root or category node
  const currentOptions = currentNode ? (currentNode.children || []) : tree;

  // Reusable Step Navigation Bar (Top and Bottom)
  const renderStepNavigation = (isTop: boolean) => {
    return (
      <div className={`${isTop ? 'border-b border-slate-100 pb-4 mb-4' : 'border-t border-slate-100 pt-5 mt-5'} flex items-center justify-between gap-4`}>
        {navPath.length > 0 ? (
          <button
            type="button"
            onClick={handleGoBack}
            className="px-5 py-3 text-base font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 active:scale-95 rounded-xl transition-all flex items-center gap-2 cursor-pointer"
          >
            <ArrowLeft className="w-5 h-5" />
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
              className="px-6 py-3 text-base font-bold text-white bg-blue-600 hover:bg-blue-700 active:scale-95 rounded-xl shadow-sm transition-all flex items-center gap-2 ml-auto cursor-pointer"
            >
              <span>{currentNode.children[0].title || 'Siguiente'}</span>
              <ArrowRight className="w-5 h-5" />
            </button>
          ) : (
            <div className="flex flex-wrap items-center gap-2.5 ml-auto justify-end">
              {currentNode.children.map((childNode) => (
                <button
                  key={childNode.id}
                  type="button"
                  onClick={() => handleSelectNode(childNode)}
                  className="px-6 py-3 text-base font-bold text-white bg-blue-600 hover:bg-blue-700 active:scale-95 rounded-xl shadow-sm transition-all flex items-center gap-2 cursor-pointer"
                >
                  <span>{childNode.title}</span>
                  <ArrowRight className="w-5 h-5" />
                </button>
              ))}
            </div>
          )
        ) : (
          <span className="text-sm font-semibold text-slate-400 italic ml-auto">
            Fin del tutorial
          </span>
        )}
      </div>
    );
  };

  return (
    <div className="w-full">
      {/* 3. Navegación (Retroceso): Solo en listas de categorías */}
      {navPath.length > 0 && (!currentNode || currentNode.nodeType === 'category') && (
        <div className="mb-4">
          <button
            type="button"
            onClick={handleGoBack}
            className="inline-flex items-center gap-2 text-base text-blue-700 font-bold hover:bg-blue-100 bg-blue-50 px-4 py-2 rounded-xl transition-colors cursor-pointer"
          >
            <ChevronLeft className="w-5 h-5" />
            <span>Atrás</span>
          </button>
        </div>
      )}

      {/* 4A. Vista de Paso de Tutorial (Estilo Wizard: Doble barra de navegación y múltiples bloques) */}
      {currentNode && currentNode.nodeType === 'step' ? (
        <div className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-8 shadow-sm space-y-5 animate-fadeIn">
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider px-3 py-1 rounded-lg bg-purple-50 text-purple-700 border border-purple-200">
              <ListOrdered className="w-4 h-4 text-purple-600" />
              Paso de Tutorial
            </span>
          </div>

          {currentNode.title && (
            <h3 className="text-lg sm:text-xl font-bold text-slate-900 leading-snug">
              {currentNode.title}
            </h3>
          )}

          {/* Barra de navegación superior: justo debajo del título del paso */}
          {renderStepNavigation(true)}

          {/* Renderizado de Múltiples Bloques de Contenido con espaciado */}
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
                        onClick={() => onOpenLightbox && onOpenLightbox(block.imageUrl!, currentNode.title)}
                        className="relative group cursor-pointer overflow-hidden rounded-xl border border-slate-200 inline-block max-w-full bg-slate-50"
                        title="Clic para ampliar imagen"
                      >
                        <img 
                          src={block.imageUrl} 
                          alt={currentNode.title} 
                          className="max-w-full md:max-w-2xl h-auto rounded-xl shadow-sm object-contain" 
                        />
                        <div className="absolute inset-0 bg-slate-900/30 opacity-0 group-hover:opacity-100 transition-opacity rounded-xl flex items-center justify-center gap-2 text-white text-sm font-semibold">
                          <ZoomIn className="w-5 h-5" />
                          <span>Ampliar</span>
                        </div>
                      </div>
                    </div>
                  )}

                  {blockVideo && (
                    <div className="w-full flex justify-center my-4">
                      <div className="w-full max-w-3xl aspect-video rounded-xl overflow-hidden shadow-sm bg-black border border-slate-200">
                        {blockVideo.type === 'direct' ? (
                          <video src={blockVideo.embedUrl} controls className="w-full h-full" />
                        ) : (
                          <iframe
                            src={blockVideo.embedUrl}
                            title={currentNode.title}
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

          {/* Barra de navegación inferior: al final de la tarjeta */}
          {renderStepNavigation(false)}
        </div>
      ) : currentNode && currentNode.nodeType === 'content' ? (
        /* 4B. Vista de Contenido Final: tarjeta limpia con footer de regreso */
        <div className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-8 shadow-sm space-y-5 animate-fadeIn">
          {currentNode.title && (
            <h3 className="text-lg sm:text-xl font-bold text-slate-900 leading-snug">
              {currentNode.title}
            </h3>
          )}

          {currentNode.contentData?.text && (
            <div className="text-base sm:text-lg text-slate-700 leading-relaxed whitespace-pre-line font-normal">
              {currentNode.contentData.text}
            </div>
          )}

          {currentNode.contentData?.imageUrl && (
            <div className="w-full flex justify-center my-4">
              <div 
                onClick={() => onOpenLightbox && onOpenLightbox(currentNode.contentData!.imageUrl!, currentNode.title)}
                className="relative group cursor-pointer overflow-hidden rounded-xl border border-slate-200 inline-block max-w-full bg-slate-50"
                title="Clic para ampliar imagen"
              >
                <img 
                  src={currentNode.contentData.imageUrl} 
                  alt={currentNode.title} 
                  className="max-w-full md:max-w-2xl h-auto rounded-xl shadow-sm object-contain" 
                />
                <div className="absolute inset-0 bg-slate-900/30 opacity-0 group-hover:opacity-100 transition-opacity rounded-xl flex items-center justify-center gap-2 text-white text-sm font-semibold">
                  <ZoomIn className="w-5 h-5" />
                  <span>Ampliar</span>
                </div>
              </div>
            </div>
          )}

          {currentVideoInfo && (
            <div className="w-full flex justify-center my-4">
              <div className="w-full max-w-3xl aspect-video rounded-xl overflow-hidden shadow-sm bg-black border border-slate-200">
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

          {navPath.length > 0 && (
            <div className="mt-8 pt-5 border-t border-slate-100 flex items-center justify-between gap-4">
              <button
                type="button"
                onClick={handleGoBack}
                className="px-5 py-3 text-base font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 active:scale-95 rounded-xl transition-all flex items-center gap-2 cursor-pointer"
              >
                <ArrowLeft className="w-5 h-5" />
                <span>Atrás</span>
              </button>
            </div>
          )}
        </div>
      ) : (
        /* Opciones en Cuadrícula Responsiva (Grid de Tarjetas Clicables de Alto Contraste) */
        <div>
          {currentNode && (
            <h4 className="text-base font-bold text-slate-900 mb-3 px-1">
              {currentNode.title}
            </h4>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5 sm:gap-4 mt-2">
            {currentOptions.map((node) => (
              <button
                key={node.id}
                type="button"
                onClick={() => handleSelectNode(node)}
                className="bg-white border-2 border-slate-200 hover:border-blue-500 hover:bg-blue-50/40 active:bg-blue-50 active:border-blue-500 p-5 rounded-2xl flex items-center justify-between shadow-sm hover:shadow-md transition-all active:scale-[0.98] group cursor-pointer text-left min-h-[72px]"
              >
                <span className="text-base sm:text-lg font-semibold text-slate-800 group-hover:text-blue-700 leading-snug transition-colors pr-3">
                  {node.title}
                </span>
                <div className="w-10 h-10 rounded-xl bg-slate-100 group-hover:bg-blue-600 group-hover:text-white text-slate-500 flex items-center justify-center shrink-0 transition-colors shadow-2xs">
                  <ChevronRight className="w-5 h-5 transition-transform group-hover:translate-x-0.5" strokeWidth={2.5} />
                </div>
              </button>
            ))}
          </div>

          {currentOptions.length === 0 && (
            <div className="p-6 bg-slate-50 rounded-2xl border border-slate-200 text-center mt-4">
              <p className="text-sm font-medium text-slate-500">No hay más opciones disponibles.</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default DecisionTreeNavigator;
