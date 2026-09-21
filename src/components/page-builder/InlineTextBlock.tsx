import React, { useRef, useEffect, useState, useCallback } from 'react';
import { 
  Bold, 
  Italic, 
  List, 
  ListOrdered,
  AlignLeft, 
  AlignCenter, 
  AlignRight, 
  FileText,
  Link as LinkIcon
} from 'lucide-react';
import DOMPurify from 'dompurify';
import { TextLayoutBlock } from '../../types';

interface InlineTextBlockProps {
  block: TextLayoutBlock;
  onChange: (updated: TextLayoutBlock) => void;
  isSelected?: boolean;
  readOnly?: boolean;
}

// Utility to clean empty html artifacts like <br>, <p><br></p>, etc.
function normalizeHtmlContent(html: string): string {
  if (!html) return '';
  const trimmed = html.trim();
  if (
    trimmed === '' ||
    trimmed === '<br>' ||
    trimmed === '<p><br></p>' ||
    trimmed === '<div><br></div>' ||
    trimmed === '<p></p>' ||
    trimmed === '<div></div>'
  ) {
    return '';
  }
  return html;
}

export const InlineTextBlock: React.FC<InlineTextBlockProps> = ({
  block,
  onChange,
  isSelected = false,
  readOnly = false
}) => {
  const contentRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLInputElement>(null);
  const [isFocused, setIsFocused] = useState<boolean>(false);
  const [isBoldActive, setIsBoldActive] = useState<boolean>(false);
  const [isItalicActive, setIsItalicActive] = useState<boolean>(false);

  // Check whether content is genuinely empty
  const cleanContent = normalizeHtmlContent(block.content || '');
  const hasContent = Boolean(cleanContent !== '');

  // Synchronize external block.content into contentEditable without overriding while actively typing
  useEffect(() => {
    if (!readOnly && contentRef.current && document.activeElement !== contentRef.current) {
      const currentHtml = contentRef.current.innerHTML;
      const targetHtml = block.content || '';
      if (normalizeHtmlContent(currentHtml) !== normalizeHtmlContent(targetHtml)) {
        contentRef.current.innerHTML = targetHtml;
      }
    }
  }, [block.content, readOnly]);

  // Ensure default paragraph separator is <p>
  useEffect(() => {
    if (!readOnly) {
      try {
        document.execCommand('defaultParagraphSeparator', false, 'p');
      } catch {
        // Ignore if browser restricts command outside focus
      }
    }
  }, [readOnly]);

  // Update active state of bold/italic on selection change
  const updateActiveFormats = useCallback(() => {
    if (readOnly) return;
    try {
      setIsBoldActive(document.queryCommandState('bold'));
      setIsItalicActive(document.queryCommandState('italic'));
    } catch {
      // Non-critical format query error
    }
  }, [readOnly]);

  const handleContentInput = () => {
    if (contentRef.current) {
      const rawHtml = contentRef.current.innerHTML;
      const cleanHtml = normalizeHtmlContent(rawHtml);
      onChange({ ...block, content: cleanHtml });
      updateActiveFormats();
    }
  };

  const handleBlur = () => {
    setIsFocused(false);
    if (contentRef.current) {
      const rawHtml = contentRef.current.innerHTML;
      const cleanHtml = normalizeHtmlContent(rawHtml);
      // Clean up stray browser empty tags
      if (cleanHtml === '') {
        contentRef.current.innerHTML = '';
      }
      onChange({ ...block, content: cleanHtml });
    }
  };

  const handleFocus = () => {
    if (readOnly) return;
    setIsFocused(true);
    try {
      document.execCommand('defaultParagraphSeparator', false, 'p');
    } catch {
      // ignore
    }
    updateActiveFormats();
  };

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange({ ...block, title: e.target.value });
  };

  // Keyboard navigation for Enter and Shift+Enter
  const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (readOnly) return;
    if (e.key === 'Enter') {
      if (e.shiftKey) {
        // Shift + Enter: clean line break (<br>)
        e.preventDefault();
        document.execCommand('insertLineBreak');
        handleContentInput();
      } else {
        // Normal Enter: new paragraph or list item
        // Allow default browser behaviour with <p> separator
        setTimeout(handleContentInput, 0);
      }
    }
  };

  // Helper formatting buttons using document.execCommand with immediate state sync
  const applyFormat = (command: 'bold' | 'italic' | 'insertUnorderedList' | 'insertOrderedList') => {
    if (readOnly) return;
    if (contentRef.current) {
      contentRef.current.focus();
    }

    document.execCommand(command, false);

    if (contentRef.current) {
      const rawHtml = contentRef.current.innerHTML;
      const cleanHtml = normalizeHtmlContent(rawHtml);
      onChange({ ...block, content: cleanHtml });
    }

    updateActiveFormats();
  };

  const handleInsertLink = () => {
    if (readOnly) return;
    if (contentRef.current) {
      contentRef.current.focus();
    }
    const inputUrl = window.prompt('Introduce la dirección web (URL) para el hipervínculo:', 'https://');
    if (inputUrl === null) return;
    const trimmed = inputUrl.trim();
    if (!trimmed || trimmed === 'https://' || trimmed === 'http://') {
      document.execCommand('unlink', false);
    } else {
      const finalUrl = trimmed.startsWith('http://') || trimmed.startsWith('https://') || trimmed.startsWith('mailto:') || trimmed.startsWith('tel:')
        ? trimmed
        : `https://${trimmed}`;
      document.execCommand('createLink', false, finalUrl);
    }

    if (contentRef.current) {
      const rawHtml = contentRef.current.innerHTML;
      const cleanHtml = normalizeHtmlContent(rawHtml);
      onChange({ ...block, content: cleanHtml });
    }
    updateActiveFormats();
  };

  const handleAlign = (align: 'left' | 'center' | 'right') => {
    onChange({ ...block, align });
  };

  const alignClass = 
    block.align === 'center' ? 'text-center' : 
    block.align === 'right' ? 'text-right' : 
    'text-left';

  const styleClass = 
    block.style === 'lead' ? 'text-base sm:text-lg leading-relaxed text-slate-800' : 
    block.style === 'heading' ? 'text-lg sm:text-xl font-bold text-slate-900' : 
    'text-sm sm:text-base leading-relaxed text-slate-700';

  const shouldShowToolbar = !readOnly && (isSelected || isFocused);

  // READ-ONLY MODE (e.g. Preview Mode)
  if (readOnly) {
    const sanitizedHtml = DOMPurify.sanitize(cleanContent, {
      ALLOWED_TAGS: [
        'b', 'strong', 'i', 'em', 'u', 's', 'strike', 'p', 'br', 'ul', 'ol', 'li',
        'span', 'div', 'a', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'blockquote', 'code', 'pre'
      ],
      ALLOWED_ATTR: ['href', 'target', 'rel', 'class', 'style']
    });

    return (
      <div className="space-y-2">
        {block.title && (
          <div className={`flex items-center gap-2 border-b border-slate-100 pb-2 ${
            block.align === 'center' ? 'justify-center' : block.align === 'right' ? 'justify-end' : ''
          }`}>
            <FileText className="w-4 h-4 text-blue-600 shrink-0 opacity-75" />
            <h3 className={`text-base sm:text-lg font-bold text-slate-900 ${alignClass}`}>
              {block.title}
            </h3>
          </div>
        )}
        <div
          style={{
            whiteSpace: 'pre-wrap',
            wordBreak: 'break-word',
          }}
          className={`whitespace-pre-wrap break-words ${styleClass} ${alignClass} [&>ul]:list-disc [&>ul]:pl-5 [&>ol]:list-decimal [&>ol]:pl-5 [&>p]:my-1.5 [&_strong]:font-bold [&_b]:font-bold`}
          dangerouslySetInnerHTML={{ __html: sanitizedHtml || '<p class="text-slate-300 italic">Sin contenido</p>' }}
        />
      </div>
    );
  }

  return (
    <div className={`relative group/text rounded-xl transition-all ${
      shouldShowToolbar ? 'ring-2 ring-blue-500/80 border-blue-400 bg-blue-50/5' : ''
    }`}>
      {/* Floating mini formatting toolbar - positioned above without obscuring the first line */}
      {shouldShowToolbar && (
        <div 
          className="absolute -top-12 sm:-top-13 left-0 z-30 flex items-center gap-1 bg-slate-900 text-white px-2.5 py-1.5 rounded-xl shadow-xl border border-slate-800 animate-fadeIn select-none"
          onMouseDown={(e) => {
            // Prevent blur of editable content when clicking toolbar buttons
            e.preventDefault();
          }}
        >
          <button
            type="button"
            onClick={() => applyFormat('bold')}
            className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
              isBoldActive ? 'bg-blue-600 text-white' : 'hover:bg-slate-800 text-slate-300 hover:text-white'
            }`}
            title="Negrita (Ctrl+B)"
          >
            <Bold className="w-3.5 h-3.5" />
          </button>

          <button
            type="button"
            onClick={() => applyFormat('italic')}
            className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
              isItalicActive ? 'bg-blue-600 text-white' : 'hover:bg-slate-800 text-slate-300 hover:text-white'
            }`}
            title="Cursiva (Ctrl+I)"
          >
            <Italic className="w-3.5 h-3.5" />
          </button>

          <button
            type="button"
            onClick={handleInsertLink}
            className="p-1.5 hover:bg-slate-800 text-slate-300 hover:text-white rounded-lg transition-colors cursor-pointer"
            title="Insertar o editar hipervínculo"
          >
            <LinkIcon className="w-3.5 h-3.5" />
          </button>

          <button
            type="button"
            onClick={() => applyFormat('insertUnorderedList')}
            className="p-1.5 hover:bg-slate-800 text-slate-300 hover:text-white rounded-lg transition-colors cursor-pointer"
            title="Lista con viñetas"
          >
            <List className="w-3.5 h-3.5" />
          </button>

          <button
            type="button"
            onClick={() => applyFormat('insertOrderedList')}
            className="p-1.5 hover:bg-slate-800 text-slate-300 hover:text-white rounded-lg transition-colors cursor-pointer"
            title="Lista numerada (1, 2, 3...)"
          >
            <ListOrdered className="w-3.5 h-3.5" />
          </button>

          <div className="w-px h-4 bg-slate-700 mx-1" />

          <button
            type="button"
            onClick={() => handleAlign('left')}
            className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
              block.align === 'left' || !block.align ? 'bg-blue-600 text-white' : 'hover:bg-slate-800 text-slate-300'
            }`}
            title="Alinear a la izquierda"
          >
            <AlignLeft className="w-3.5 h-3.5" />
          </button>

          <button
            type="button"
            onClick={() => handleAlign('center')}
            className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
              block.align === 'center' ? 'bg-blue-600 text-white' : 'hover:bg-slate-800 text-slate-300'
            }`}
            title="Centrar texto"
          >
            <AlignCenter className="w-3.5 h-3.5" />
          </button>

          <button
            type="button"
            onClick={() => handleAlign('right')}
            className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
              block.align === 'right' ? 'bg-blue-600 text-white' : 'hover:bg-slate-800 text-slate-300'
            }`}
            title="Alinear a la derecha"
          >
            <AlignRight className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* Editable Title */}
      <div className={`flex items-center gap-2 border-b border-slate-100 pb-2.5 pt-1 ${
        block.align === 'center' ? 'justify-center' : block.align === 'right' ? 'justify-end' : ''
      }`}>
        <FileText className="w-4 h-4 text-blue-600 shrink-0 opacity-75" />
        <input
          ref={titleRef}
          type="text"
          value={block.title || ''}
          onChange={handleTitleChange}
          placeholder="Escribe un título para esta sección (opcional)..."
          className={`w-full text-base sm:text-lg font-bold text-slate-900 bg-transparent border-0 focus:outline-none focus:ring-0 placeholder:text-slate-300 ${alignClass}`}
        />
      </div>

      {/* Direct WYSIWYG contentEditable Body with strict whitespace and line break preservation */}
      <div className="relative pt-2">
        {/* Native-behaving visual placeholder: only visible when completely empty AND NOT focused */}
        {!hasContent && !isFocused && (
          <div 
            onClick={() => {
              if (contentRef.current) {
                contentRef.current.focus();
              }
            }}
            className={`absolute inset-0 pt-2 pointer-events-none text-slate-300 italic select-none ${styleClass} ${alignClass}`}
          >
            Haz clic aquí y escribe directamente tu texto... Puedes dar Enters, espacios, viñetas o listas.
          </div>
        )}

        <div
          ref={contentRef}
          contentEditable
          suppressContentEditableWarning
          onInput={handleContentInput}
          onFocus={handleFocus}
          onBlur={handleBlur}
          onKeyDown={handleKeyDown}
          onKeyUp={updateActiveFormats}
          onMouseUp={updateActiveFormats}
          style={{
            whiteSpace: 'pre-wrap',
            wordBreak: 'break-word',
          }}
          className={`min-h-[85px] p-2 -m-2 rounded-xl focus:outline-none transition-colors outline-none whitespace-pre-wrap break-words ${styleClass} ${alignClass}`}
        />
      </div>
    </div>
  );
};
