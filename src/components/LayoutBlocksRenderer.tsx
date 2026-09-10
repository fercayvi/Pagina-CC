import React, { useState } from 'react';
import DOMPurify from 'dompurify';
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
  if (!url || typeof url !== 'string' || !url.trim()) return null;
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

// Converts legacy markdown (such as **bold** and *italic*) or raw text with newlines to clean HTML if not already HTML
function prepareHtmlContent(content: string): string {
  if (!content || typeof content !== 'string') return '';
  const trimmed = content.trim();
  if (!trimmed) return '';

  // Check if content already contains HTML tags
  const hasHtmlTags = /<[a-z][\s\S]*>/i.test(content);

  if (!hasHtmlTags) {
    // Process markdown-like formatting for backwards compatibility
    const paragraphs = content.split(/\n\n+/);
    const htmlParas = paragraphs.map(para => {
      const lines = para.split('\n');
      const htmlLines = lines.map(line => {
        let l = line
          .replace(/&/g, '&amp;')
          .replace(/</g, '&lt;')
          .replace(/>/g, '&gt;');
        
        // Bullet
        if (l.trim().startsWith('•') || l.trim().startsWith('- ') || l.trim().startsWith('* ')) {
          const clean = l.trim().replace(/^[•\-\*]\s*/, '');
          const bolded = clean.replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>');
          return `<li>${bolded}</li>`;
        }

        // Bold
        l = l.replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>');
        // Italic
        l = l.replace(/\*([^*]+)\*/g, '<em>$1</em>');
        return l;
      });

      if (htmlLines.some(l => l.startsWith('<li>'))) {
        return `<ul class="list-disc pl-5 my-1.5 space-y-1">${htmlLines.join('')}</ul>`;
      }

      return `<p class="my-1 leading-relaxed">${htmlLines.join('<br>')}</p>`;
    });

    return htmlParas.join('');
  }

  return content;
}

// Safe rich text formatter supporting direct HTML, bold, italics, bullets, newlines, and strict spacing
function FormattedTextBlock({ content, alignClass = '' }: { content: string; alignClass?: string }) {
  if (!content || typeof content !== 'string') return null;

  const rawHtml = prepareHtmlContent(content);
  if (!rawHtml.trim()) return null;

  const cleanHtml = DOMPurify.sanitize(rawHtml, {
    ALLOWED_TAGS: [
      'b', 'strong', 'i', 'em', 'u', 's', 'strike', 'p', 'br', 'ul', 'ol', 'li',
      'span', 'div', 'a', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'blockquote', 'code', 'pre'
    ],
    ALLOWED_ATTR: ['href', 'target', 'rel', 'class', 'style']
  });

  return (
    <div
      style={{
        whiteSpace: 'pre-wrap',
        wordBreak: 'break-word',
      }}
      className={`text-slate-700 leading-relaxed whitespace-pre-wrap break-words ${alignClass} [&>ul]:list-disc [&>ul]:pl-5 [&>ol]:list-decimal [&>ol]:pl-5 [&>p]:my-1.5 [&>p:first-child]:mt-0 [&>p:last-child]:mb-0 [&_strong]:font-bold [&_strong]:text-slate-900 [&_b]:font-bold [&_b]:text-slate-900`}
      dangerouslySetInnerHTML={{ __html: cleanHtml }}
    />
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
    <div className="bg-white border border-slate-200 rounded-2xl p-5 sm:p-6 shadow-sm space-y-4">
      <h3 className="text-base sm:text-lg font-bold text-slate-900 border-b border-slate-100 pb-3 flex items-center gap-2">
        <HelpCircle className="w-5 h-5 text-blue-600 shrink-0" />
        <span>{title || 'Preguntas Frecuentes'}</span>
      </h3>

      <div className="space-y-3">
        {items.map((item, idx) => {
          const isOpen = openIndices.includes(idx);
          return (
            <div 
              key={idx} 
              className={`bg-white border transition-all rounded-xl overflow-hidden shadow-xs ${
                isOpen ? 'border-blue-400 ring-1 ring-blue-100' : 'border-slate-200 hover:border-slate-300'
              }`}
            >
              <button
                type="button"
                onClick={() => toggleIndex(idx)}
                className="w-full text-left p-4 sm:p-5 flex items-center justify-between gap-4 hover:bg-slate-50 transition-colors focus:outline-none cursor-pointer select-none"
                aria-expanded={isOpen}
              >
                <div className="flex items-center gap-3.5 min-w-0 pr-2">
                  <span className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 font-extrabold text-xs transition-colors ${
                    isOpen ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-700'
                  }`}>
                    {idx + 1}
                  </span>
                  <span className="text-base sm:text-lg font-semibold text-slate-800 leading-snug">
                    {item.q}
                  </span>
                </div>
                <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 transition-all ${
                  isOpen ? 'bg-blue-50 text-blue-700 rotate-180' : 'bg-slate-100 text-slate-600'
                }`}>
                  <ChevronDown className="w-5 h-5 stroke-[2.5]" />
                </div>
              </button>

              {isOpen && (
                <div className="px-5 pb-5 pt-3 border-t border-slate-100 bg-slate-50/60 animate-fadeIn">
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
    <div className="space-y-4 animate-fadeIn">
      {blocks.map((block, index) => {
        // ==================== 1. TEXT BLOCK ====================
        if (block.type === 'text') {
          const alignClass = block.align === 'center' ? 'text-center' : block.align === 'right' ? 'text-right' : 'text-left';
          const styleClass = block.style === 'lead' ? 'text-base sm:text-lg font-medium text-slate-800' : block.style === 'heading' ? 'text-lg sm:text-xl font-bold text-slate-900' : 'text-sm sm:text-base';

          return (
            <div 
              key={block.id || `text-${index}`}
              className={`bg-white border border-slate-200 rounded-2xl p-5 sm:p-6 shadow-xs space-y-3.5 ${alignClass}`}
            >
              {block.title && (
                <h3 className={`text-base sm:text-lg font-bold text-slate-900 border-b border-slate-100 pb-3 flex items-center gap-2 ${block.align === 'center' ? 'justify-center' : block.align === 'right' ? 'justify-end' : ''}`}>
                  <FileText className="w-5 h-5 text-blue-600 shrink-0" />
                  <span>{block.title}</span>
                </h3>
              )}
              <div 
                style={{
                  whiteSpace: 'pre-wrap',
                  wordBreak: 'break-word',
                }}
                className={`${styleClass} whitespace-pre-wrap break-words`}
              >
                <FormattedTextBlock content={block.content} alignClass={alignClass} />
              </div>
            </div>
          );
        }

        // ==================== 2. ALERT BLOCK (NOTIFICACIONES OFICIALES) ====================
        if (block.type === 'alert') {
          const isWarning = block.level === 'warning';
          const isDanger = block.level === 'danger';
          const isSuccess = block.level === 'success';

          let containerClass = 'bg-blue-50 border-l-4 border-blue-600 text-blue-950';
          let headerClass = 'text-blue-900';
          let iconColor = 'text-blue-600';
          let IconComponent = Info;

          if (isWarning) {
            containerClass = 'bg-amber-50 border-l-4 border-amber-500 text-amber-950';
            headerClass = 'text-amber-900';
            iconColor = 'text-amber-600';
            IconComponent = AlertTriangle;
          } else if (isDanger) {
            containerClass = 'bg-rose-50 border-l-4 border-rose-600 text-rose-950';
            headerClass = 'text-rose-900';
            iconColor = 'text-rose-600';
            IconComponent = AlertCircle;
          } else if (isSuccess) {
            containerClass = 'bg-emerald-50 border-l-4 border-emerald-600 text-emerald-950';
            headerClass = 'text-emerald-900';
            iconColor = 'text-emerald-600';
            IconComponent = CheckCircle2;
          }

          return (
            <div 
              key={block.id || `alert-${index}`}
              className={`${containerClass} rounded-xl p-4 sm:p-5 shadow-sm flex items-start gap-3.5 sm:gap-4 transition-all`}
            >
              <IconComponent className={`w-7 h-7 sm:w-8 sm:h-8 shrink-0 mt-0.5 ${iconColor}`} />
              <div className="min-w-0 flex-1 space-y-1">
                {block.title && (
                  <h4 className={`text-base font-bold uppercase tracking-wider ${headerClass}`}>
                    {block.title}
                  </h4>
                )}
                <p className="text-base text-slate-800 font-medium leading-relaxed whitespace-pre-line">
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
            const alignClass = block.alignment === 'left' ? 'mr-auto' : block.alignment === 'right' ? 'ml-auto' : 'mx-auto';
            const sizeClass = block.size === 'small' ? 'max-w-xs' : block.size === 'medium' ? 'max-w-md' : 'w-full';

            return (
              <div 
                key={block.id || `media-${index}`}
                className={`bg-white border border-slate-200 rounded-2xl shadow-xs p-4 sm:p-5 space-y-3 ${sizeClass} ${alignClass}`}
              >
                {block.title && (
                  <h3 className="text-base sm:text-lg font-bold text-slate-900 border-b border-slate-100 pb-3 flex items-center gap-2">
                    <ImageIcon className="w-5 h-5 text-emerald-600 shrink-0" />
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
                    <div className="absolute inset-0 bg-slate-900/40 opacity-0 group-hover:opacity-100 transition-opacity rounded-xl flex items-center justify-center gap-2 text-white text-sm font-bold pointer-events-none backdrop-blur-xs">
                      <ZoomIn className="w-5 h-5" />
                      <span>Ver imagen completa (Zoom)</span>
                    </div>
                  </div>
                ) : (
                  <div className="p-5 bg-slate-50 rounded-xl text-center text-slate-400 text-sm italic">
                    Sin imagen cargada
                  </div>
                )}

                {block.caption && (
                  <p className="text-xs sm:text-sm text-slate-500 font-medium text-center pt-1 italic">
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
                className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm p-4 sm:p-5 space-y-3"
              >
                {block.title && (
                  <h3 className="text-base sm:text-lg font-bold text-slate-900 border-b border-slate-100 pb-3 flex items-center gap-2">
                    <Video className="w-5 h-5 text-emerald-600 shrink-0" />
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
                  <div className="p-5 bg-slate-50 rounded-xl text-center text-slate-400 text-sm italic">
                    Sin video configurado
                  </div>
                )}

                {block.caption && (
                  <p className="text-xs sm:text-sm text-slate-500 font-medium text-center pt-1 italic">
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
                className="bg-white border border-slate-200 rounded-2xl p-5 sm:p-6 shadow-sm space-y-3.5"
              >
                {block.title && (
                  <h3 className="text-base sm:text-lg font-bold text-slate-900 border-b border-slate-100 pb-3 flex items-center gap-2">
                    <FileDown className="w-5 h-5 text-blue-600 shrink-0" />
                    <span>{block.title}</span>
                  </h3>
                )}

                {block.url ? (
                  <a
                    href={block.url}
                    download={block.url.startsWith('data:') ? `${block.title || 'formato_oficial'}.pdf` : undefined}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-4 sm:p-5 rounded-2xl border-2 border-blue-100 hover:border-blue-400 bg-blue-50/70 hover:bg-blue-100/80 transition-all flex items-center justify-between gap-4 group cursor-pointer active:scale-98"
                  >
                    <div className="flex items-center gap-3.5 min-w-0">
                      <div className="w-12 h-12 rounded-xl bg-blue-600 text-white flex items-center justify-center shrink-0 shadow-xs">
                        <FileText className="w-6 h-6" />
                      </div>
                      <div className="min-w-0">
                        <p className="text-sm sm:text-base font-bold text-slate-900 group-hover:text-blue-700 truncate">
                          {block.title || 'Descargar Formato / Documento Oficial (PDF)'}
                        </p>
                        <p className="text-xs sm:text-sm text-slate-600 font-medium mt-0.5">
                          {block.caption || 'Haz clic para abrir o descargar el documento adjunto'}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-blue-600 text-white text-sm font-bold shadow-xs group-hover:bg-blue-700 transition-all shrink-0">
                      <Download className="w-4 h-4" />
                      <span>Descargar</span>
                    </div>
                  </a>
                ) : (
                  <div className="p-4 bg-slate-50 rounded-xl text-center text-slate-400 text-sm italic">
                    Sin archivo PDF adjunto
                  </div>
                )}
              </div>
            );
          }
        }

        // ==================== 5. COLUMNS / CONTAINER BLOCK ====================
        if (block.type === 'columns') {
          const colsCount = block.columnsCount || block.columns?.length || 2;
          let gridClass = 'grid-cols-1 md:grid-cols-2';
          if (colsCount === 3) {
            gridClass = 'grid-cols-1 md:grid-cols-3';
          } else if (block.layout === '1-2') {
            gridClass = 'grid-cols-1 md:grid-cols-3';
          } else if (block.layout === '2-1') {
            gridClass = 'grid-cols-1 md:grid-cols-3';
          }

          return (
            <div 
              key={block.id || `cols-${index}`}
              className="space-y-3"
            >
              {block.title && (
                <h3 className="text-base sm:text-lg font-bold text-slate-900 border-b border-slate-100 pb-2">
                  {block.title}
                </h3>
              )}
              <div className={`grid ${gridClass} gap-4 sm:gap-6 items-start`}>
                {block.columns.map((col, colIdx) => {
                  let colSpan = '';
                  if (block.layout === '1-2' && colIdx === 1) colSpan = 'md:col-span-2';
                  if (block.layout === '2-1' && colIdx === 0) colSpan = 'md:col-span-2';

                  return (
                    <div key={col.id || `col-${colIdx}`} className={`space-y-4 ${colSpan}`}>
                      <LayoutBlocksRenderer 
                        blocks={col.blocks}
                        onOpenLightbox={onOpenLightbox}
                        serviceTitle={serviceTitle}
                      />
                    </div>
                  );
                })}
              </div>
            </div>
          );
        }

        return null;
      })}
    </div>
  );
};
