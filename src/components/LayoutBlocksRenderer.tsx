import React, { useState } from 'react';
import { 
  Type, 
  AlertTriangle, 
  AlertCircle, 
  CheckCircle2, 
  Info, 
  HelpCircle, 
  Image as ImageIcon, 
  Video, 
  FileDown, 
  ChevronDown, 
  ChevronUp, 
  ZoomIn, 
  Download,
  FileText
} from 'lucide-react';
import { LayoutBlock } from '../types';

export function getEmbedVideoInfo(url?: string | null): { type: 'youtube' | 'vimeo' | 'direct' | 'iframe'; embedUrl: string } | null {
  if (!url || !url.trim()) return null;
  const cleanUrl = url.trim();

  // Base64 Data URL video or direct MP4/WebM/OGG file
  if (cleanUrl.startsWith('data:video') || cleanUrl.match(/\.(mp4|webm|ogg)$/i)) {
    return { type: 'direct', embedUrl: cleanUrl };
  }

  // YouTube
  const ytRegExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
  const ytMatch = cleanUrl.match(ytRegExp);
  if (ytMatch && ytMatch[2].length === 11) {
    return { type: 'youtube', embedUrl: `https://www.youtube.com/embed/${ytMatch[2]}` };
  }

  // Vimeo
  const vimeoRegExp = /(vimeo\.com\/)(\d+)/;
  const vimeoMatch = cleanUrl.match(vimeoRegExp);
  if (vimeoMatch && vimeoMatch[2]) {
    return { type: 'vimeo', embedUrl: `https://player.vimeo.com/video/${vimeoMatch[2]}` };
  }

  return { type: 'iframe', embedUrl: cleanUrl };
}

// Simple text formatter supporting bold **text**, bullet points, and newlines
function FormattedTextBlock({ content }: { content: string }) {
  if (!content) return null;

  // Split into paragraphs by double newlines
  const paragraphs = content.split(/\n\n+/);

  return (
    <div className="space-y-2.5 text-xs text-slate-700 leading-relaxed">
      {paragraphs.map((para, pIdx) => {
        const lines = para.split('\n');
        return (
          <div key={pIdx} className="space-y-1">
            {lines.map((line, lIdx) => {
              const trimmed = line.trim();
              const isBullet = trimmed.startsWith('•') || trimmed.startsWith('- ') || trimmed.startsWith('* ');
              const cleanLine = isBullet ? trimmed.replace(/^[•\-\*]\s*/, '') : trimmed;

              // Parse bold **text**
              const parts = cleanLine.split(/(\*\*[^*]+\*\*)/g);
              const renderedContent = parts.map((part, i) => {
                if (part.startsWith('**') && part.endsWith('**')) {
                  return <strong key={i} className="font-bold text-slate-900">{part.slice(2, -2)}</strong>;
                }
                return part;
              });

              if (isBullet) {
                return (
                  <div key={lIdx} className="flex items-start gap-2 pl-1 py-0.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-blue-600 mt-1.5 shrink-0" />
                    <span className="flex-1">{renderedContent}</span>
                  </div>
                );
              }

              // Check if line looks like numbered item e.g. "1. Step"
              const numMatch = cleanLine.match(/^(\d+[\.\)])\s*(.*)/);
              if (numMatch) {
                const numParts = numMatch[2].split(/(\*\*[^*]+\*\*)/g);
                return (
                  <div key={lIdx} className="flex items-start gap-2.5 pl-1 py-0.5">
                    <span className="w-5 h-5 rounded-md bg-blue-50 text-blue-700 border border-blue-200/80 font-extrabold text-[11px] flex items-center justify-center shrink-0 mt-0.5">
                      {numMatch[1].replace(/[\.\)]/, '')}
                    </span>
                    <span className="flex-1 mt-0.5">
                      {numParts.map((p, i) => {
                        if (p.startsWith('**') && p.endsWith('**')) {
                          return <strong key={i} className="font-bold text-slate-900">{p.slice(2, -2)}</strong>;
                        }
                        return p;
                      })}
                    </span>
                  </div>
                );
              }

              return (
                <p key={lIdx} className="leading-relaxed">
                  {renderedContent}
                </p>
              );
            })}
          </div>
        );
      })}
    </div>
  );
}

// Single Accordion for FAQs
function SingleFAQBlock({ title, items }: { title?: string; items: { q: string; a: string }[]; key?: React.Key }) {
  const [openIndices, setOpenIndices] = useState<number[]>([0]);

  const toggleIndex = (idx: number) => {
    setOpenIndices(prev => 
      prev.includes(idx) ? prev.filter(i => i !== idx) : [...prev, idx]
    );
  };

  if (!items || items.length === 0) return null;

  return (
    <div className="bg-white border border-slate-200/90 rounded-2xl p-4 shadow-2xs space-y-3">
      <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider border-b border-slate-100 pb-2 flex items-center gap-1.5">
        <HelpCircle className="w-4 h-4 text-purple-600" />
        <span>{title || 'Preguntas Frecuentes'}</span>
      </h3>

      <div className="space-y-2">
        {items.map((item, idx) => {
          const isOpen = openIndices.includes(idx);
          return (
            <div key={idx} className="bg-white border border-slate-200 rounded-xl overflow-hidden transition-all shadow-2xs">
              <button
                type="button"
                onClick={() => toggleIndex(idx)}
                className="w-full text-left p-3.5 flex items-center justify-between gap-3 hover:bg-slate-50 transition-colors focus:outline-none cursor-pointer"
              >
                <div className="flex items-start gap-2.5 min-w-0 pr-2">
                  <span className={`text-[10px] font-extrabold rounded-md px-1.5 py-0.5 shrink-0 transition-colors ${
                    isOpen ? 'bg-purple-600 text-white' : 'bg-purple-50 text-purple-700 border border-purple-200/60'
                  }`}>
                    FAQ
                  </span>
                  <span className="text-xs font-bold text-slate-800 leading-snug">
                    {item.q}
                  </span>
                </div>
                <div className="shrink-0 text-slate-400">
                  {isOpen ? <ChevronUp className="w-4 h-4 text-purple-600" /> : <ChevronDown className="w-4 h-4" />}
                </div>
              </button>

              {isOpen && (
                <div className="px-4 pb-3.5 pt-2 text-xs text-slate-600 leading-relaxed border-t border-slate-100 bg-slate-50/70 animate-fadeIn">
                  <FormattedTextBlock content={item.a} />
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

interface LayoutBlocksRendererProps {
  blocks?: LayoutBlock[];
  onOpenLightbox?: (url: string, title?: string) => void;
  serviceTitle?: string;
}

export const LayoutBlocksRenderer: React.FC<LayoutBlocksRendererProps> = ({
  blocks,
  onOpenLightbox,
  serviceTitle
}) => {
  if (!blocks || blocks.length === 0) return null;

  return (
    <div className="space-y-3.5 animate-fadeIn">
      {blocks.map((block, index) => {
        // ==================== 1. TEXT BLOCK ====================
        if (block.type === 'text') {
          return (
            <div 
              key={block.id || `text-${index}`}
              className="bg-white border border-slate-200/90 rounded-2xl p-4 sm:p-5 shadow-2xs space-y-2.5"
            >
              {block.title && (
                <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider border-b border-slate-100 pb-2 flex items-center gap-1.5">
                  <FileText className="w-4 h-4 text-blue-600" />
                  <span>{block.title}</span>
                </h3>
              )}
              <FormattedTextBlock content={block.content} />
            </div>
          );
        }

        // ==================== 2. ALERT BLOCK ====================
        if (block.type === 'alert') {
          const isWarning = block.level === 'warning';
          const isDanger = block.level === 'danger';
          const isSuccess = block.level === 'success';

          let bgClass = 'bg-blue-50 border-blue-200 text-blue-900';
          let headerClass = 'text-blue-700';
          let IconComponent = Info;

          if (isWarning) {
            bgClass = 'bg-amber-500 text-white';
            headerClass = 'text-amber-100';
            IconComponent = AlertTriangle;
          } else if (isDanger) {
            bgClass = 'bg-rose-600 text-white';
            headerClass = 'text-rose-100';
            IconComponent = AlertCircle;
          } else if (isSuccess) {
            bgClass = 'bg-emerald-600 text-white';
            headerClass = 'text-emerald-100';
            IconComponent = CheckCircle2;
          }

          return (
            <div 
              key={block.id || `alert-${index}`}
              className={`${bgClass} rounded-2xl p-4 shadow-md flex items-start gap-3 transition-all`}
            >
              <IconComponent className={`w-5 h-5 shrink-0 mt-0.5 ${isWarning || isDanger || isSuccess ? 'text-white' : 'text-blue-600'}`} />
              <div className="min-w-0 flex-1 space-y-0.5">
                {block.title && (
                  <h4 className={`text-xs font-extrabold uppercase tracking-wider ${headerClass}`}>
                    {block.title}
                  </h4>
                )}
                <p className="text-xs font-medium leading-relaxed whitespace-pre-line">
                  {block.message}
                </p>
              </div>
            </div>
          );
        }

        // ==================== 3. FAQ BLOCK ====================
        if (block.type === 'faq') {
          return (
            <SingleFAQBlock 
              key={block.id || `faq-${index}`} 
              title={block.title} 
              items={block.items || []} 
            />
          );
        }

        // ==================== 4. MEDIA BLOCK ====================
        if (block.type === 'media') {
          const mediaType = block.mediaType || 'image';

          // IMAGE
          if (mediaType === 'image') {
            return (
              <div 
                key={block.id || `media-${index}`}
                className="bg-white border border-slate-200 rounded-2xl shadow-2xs p-3 space-y-2"
              >
                {block.title && (
                  <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider border-b border-slate-100 pb-2 flex items-center gap-1.5">
                    <ImageIcon className="w-4 h-4 text-emerald-600" />
                    <span>{block.title}</span>
                  </h3>
                )}

                {block.url ? (
                  <div 
                    onClick={() => onOpenLightbox && onOpenLightbox(block.url, block.title || serviceTitle)}
                    className="relative group cursor-pointer overflow-hidden rounded-xl border border-slate-100 bg-slate-50"
                    title="Clic para ver infografía en pantalla completa con zoom"
                  >
                    <img 
                      src={block.url} 
                      alt={block.title || 'Contenido multimedia'} 
                      className="w-full h-auto max-w-full rounded-xl object-contain shadow-2xs mx-auto max-h-[500px]" 
                    />
                    <div className="absolute inset-0 bg-slate-900/40 opacity-0 group-hover:opacity-100 transition-opacity rounded-xl flex items-center justify-center gap-2 text-white text-xs font-bold pointer-events-none backdrop-blur-xs">
                      <ZoomIn className="w-4 h-4" />
                      <span>Ver imagen completa (Zoom)</span>
                    </div>
                  </div>
                ) : (
                  <div className="p-4 bg-slate-50 rounded-xl text-center text-slate-400 text-xs italic">
                    Sin imagen cargada
                  </div>
                )}

                {block.caption && (
                  <p className="text-[11px] text-slate-500 font-medium text-center pt-0.5 italic">
                    {block.caption}
                  </p>
                )}
              </div>
            );
          }

          // VIDEO
          if (mediaType === 'video') {
            const videoInfo = getEmbedVideoInfo(block.url);
            return (
              <div 
                key={block.id || `media-${index}`}
                className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-2xs p-3 space-y-2"
              >
                {block.title && (
                  <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider border-b border-slate-100 pb-2 flex items-center gap-1.5">
                    <Video className="w-4 h-4 text-emerald-600" />
                    <span>{block.title}</span>
                  </h3>
                )}

                {videoInfo ? (
                  <div className="aspect-video w-full rounded-xl overflow-hidden bg-black shadow-inner">
                    {videoInfo.type === 'direct' ? (
                      <video src={videoInfo.embedUrl} controls className="w-full h-full" />
                    ) : (
                      <iframe 
                        src={videoInfo.embedUrl} 
                        title={block.title || 'Video tutorial'} 
                        className="w-full h-full border-0"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                        allowFullScreen
                      />
                    )}
                  </div>
                ) : (
                  <div className="p-4 bg-slate-50 rounded-xl text-center text-slate-400 text-xs italic">
                    Sin video configurado
                  </div>
                )}

                {block.caption && (
                  <p className="text-[11px] text-slate-500 font-medium text-center pt-0.5 italic">
                    {block.caption}
                  </p>
                )}
              </div>
            );
          }

          // PDF / FORMATO
          if (mediaType === 'pdf') {
            return (
              <div 
                key={block.id || `media-${index}`}
                className="bg-white border border-slate-200 rounded-2xl p-4 shadow-2xs space-y-2.5"
              >
                {block.title && (
                  <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-1.5 border-b border-slate-100 pb-2">
                    <FileDown className="w-4 h-4 text-emerald-600" />
                    <span>{block.title}</span>
                  </h3>
                )}

                {block.url ? (
                  <a
                    href={block.url}
                    download={block.url.startsWith('data:') ? `${block.title || 'formato_oficial'}.pdf` : undefined}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-3.5 rounded-xl border border-slate-200 hover:border-blue-400 bg-blue-50/60 hover:bg-blue-100/70 transition-all flex items-center justify-between gap-3 group"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="w-10 h-10 rounded-lg bg-blue-600 text-white flex items-center justify-center shrink-0 shadow-2xs">
                        <FileText className="w-5 h-5" />
                      </div>
                      <div className="min-w-0">
                        <p className="text-xs font-bold text-slate-900 group-hover:text-blue-700 truncate">
                          {block.title || 'Descargar Formato / Documento Oficial (PDF)'}
                        </p>
                        <p className="text-[10px] text-slate-500 font-medium">
                          {block.caption || 'Haz clic para abrir o descargar el documento adjunto'}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white border border-slate-200 text-blue-700 text-xs font-bold shadow-2xs group-hover:bg-blue-600 group-hover:text-white transition-all shrink-0">
                      <Download className="w-3.5 h-3.5" />
                      <span>Descargar</span>
                    </div>
                  </a>
                ) : (
                  <div className="p-3 bg-slate-50 rounded-xl text-center text-slate-400 text-xs italic">
                    Sin archivo PDF adjunto
                  </div>
                )}
              </div>
            );
          }
        }

        return null;
      })}
    </div>
  );
};
