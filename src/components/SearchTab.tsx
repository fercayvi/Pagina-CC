import React, { useState, useMemo } from 'react';
import { 
  Search, 
  X, 
  ChevronRight, 
  ArrowUpRight, 
  Tag, 
  FileText, 
  HelpCircle, 
  CheckCircle2, 
  Sparkles,
  SlidersHorizontal,
  Info
} from 'lucide-react';
import { Service, CategoryConfig } from '../types';
import { SERVICE_ICON_MAP } from './ServiceCard';

interface SearchTabProps {
  services: (Service & { hidden?: boolean })[];
  searchQuery: string;
  onSearchQueryChange: (query: string) => void;
  onSelectService: (service: Service & { hidden?: boolean }) => void;
  categories?: CategoryConfig[];
}

interface SearchMatchResult {
  service: Service & { hidden?: boolean };
  score: number;
  matchType: 'title' | 'tag' | 'category' | 'description' | 'faq' | 'requirement' | 'block' | 'tree';
  matchedSnippet: string;
  matchedFieldLabel: string;
}

// Normalize text: lowercase, remove accents/diacritics for flexible search
function normalizeText(text: string): string {
  if (!text) return '';
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .trim();
}

// Highlight matching words inside text
function HighlightedText({ text, query }: { text: string; query: string }) {
  if (!text || !query.trim()) {
    return <span>{text}</span>;
  }

  const queryTerms = query
    .trim()
    .split(/\s+/)
    .filter(t => t.length > 0)
    .map(t => normalizeText(t));

  if (queryTerms.length === 0) {
    return <span>{text}</span>;
  }

  // Escape regex specials
  const escapedTerms = queryTerms
    .map(t => t.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'))
    .join('|');

  try {
    // Regex that matches whole or partial words regardless of accents
    // We create a regex from the normalized words
    const regex = new RegExp(`(${escapedTerms})`, 'gi');
    
    // Split retaining delimiters
    const parts = text.split(regex);

    return (
      <span>
        {parts.map((part, index) => {
          const isMatch = queryTerms.some(term => normalizeText(part) === term);
          if (isMatch) {
            return (
              <mark
                key={index}
                className="bg-blue-100 text-blue-900 font-bold px-1 py-0.5 rounded transition-colors"
              >
                {part}
              </mark>
            );
          }
          return <span key={index}>{part}</span>;
        })}
      </span>
    );
  } catch {
    return <span>{text}</span>;
  }
}

// Extract a concise contextual excerpt around the matched text
function extractSnippet(fullText: string, query: string, maxLength: number = 140): string {
  if (!fullText) return '';
  const clean = fullText.replace(/\s+/g, ' ').trim();
  if (clean.length <= maxLength) return clean;

  const normClean = normalizeText(clean);
  const normQuery = normalizeText(query.split(' ')[0] || query);

  const matchIdx = normClean.indexOf(normQuery);
  if (matchIdx === -1) {
    return clean.slice(0, maxLength) + '...';
  }

  // Center around the match
  const start = Math.max(0, matchIdx - Math.floor(maxLength / 3));
  const end = Math.min(clean.length, start + maxLength);
  let snippet = clean.slice(start, end);

  if (start > 0) snippet = '...' + snippet;
  if (end < clean.length) snippet = snippet + '...';

  return snippet;
}

export default function SearchTab({
  services,
  searchQuery,
  onSearchQueryChange,
  onSelectService,
  categories = []
}: SearchTabProps) {
  const [selectedCategoryFilter, setSelectedCategoryFilter] = useState<string>('all');

  const popularKeywords = [
    'Vacaciones',
    'Nómina',
    'Constancia',
    'Incapacidad IMSS',
    'Días de Pago',
    'Tarjeta y Vales',
    'Infonavit',
    'Préstamos',
    'Checador'
  ];

  // Perform multi-criteria search and scoring
  const searchResults: SearchMatchResult[] = useMemo(() => {
    const trimmed = searchQuery.trim();
    if (!trimmed) return [];

    const normQuery = normalizeText(trimmed);
    const queryTokens = normQuery.split(/\s+/).filter(Boolean);

    const publicServices = services.filter(s => !s.hidden);
    const results: SearchMatchResult[] = [];

    for (const s of publicServices) {
      const normTitle = normalizeText(s.title || '');
      const normCategory = normalizeText(s.category || '');
      const normShortDesc = normalizeText(s.shortDesc || '');
      const normFullDesc = normalizeText(s.fullDescription || '');
      const tags = Array.isArray(s.tags) ? s.tags : [];
      const normTags = tags.map(t => normalizeText(t));

      let score = 0;
      let matchType: SearchMatchResult['matchType'] = 'description';
      let matchedSnippet = s.shortDesc || '';
      let matchedFieldLabel = 'Descripción del trámite';

      // 1. Title match (Highest Priority)
      if (normTitle.includes(normQuery)) {
        score += 100;
        matchType = 'title';
        matchedFieldLabel = 'Título del trámite';
        matchedSnippet = s.shortDesc || s.title;
      } else if (queryTokens.every(t => normTitle.includes(t))) {
        score += 80;
        matchType = 'title';
        matchedFieldLabel = 'Título del trámite';
        matchedSnippet = s.shortDesc || s.title;
      }

      // 2. Tags match
      const matchedTag = tags.find(tag => {
        const nTag = normalizeText(tag);
        return nTag.includes(normQuery) || queryTokens.some(tok => nTag.includes(tok));
      });
      if (matchedTag) {
        score += 75;
        if (score < 100) {
          matchType = 'tag';
          matchedFieldLabel = `Palabra clave: "${matchedTag}"`;
          matchedSnippet = s.shortDesc || `Etiqueta asociada: ${tags.join(', ')}`;
        }
      }

      // 3. Category match
      if (normCategory.includes(normQuery)) {
        score += 60;
        if (score < 75) {
          matchType = 'category';
          matchedFieldLabel = `Categoría: ${s.category}`;
          matchedSnippet = s.shortDesc || '';
        }
      }

      // 4. Short Description match
      if (normShortDesc.includes(normQuery)) {
        score += 50;
        if (score < 75) {
          matchType = 'description';
          matchedFieldLabel = 'Descripción corta';
          matchedSnippet = extractSnippet(s.shortDesc, trimmed, 130);
        }
      } else if (queryTokens.every(t => normShortDesc.includes(t))) {
        score += 40;
        if (score < 75) {
          matchType = 'description';
          matchedFieldLabel = 'Descripción corta';
          matchedSnippet = extractSnippet(s.shortDesc, trimmed, 130);
        }
      }

      // 5. Full Description match
      if (normFullDesc && normFullDesc.includes(normQuery)) {
        score += 35;
        if (score < 50) {
          matchType = 'description';
          matchedFieldLabel = 'Detalle del trámite';
          matchedSnippet = extractSnippet(s.fullDescription || '', trimmed, 140);
        }
      }

      // 6. Requirements match
      if (Array.isArray(s.requirements)) {
        const foundReq = s.requirements.find(r => normalizeText(r).includes(normQuery));
        if (foundReq) {
          score += 30;
          if (score < 50) {
            matchType = 'requirement';
            matchedFieldLabel = 'Requisitos del trámite';
            matchedSnippet = extractSnippet(foundReq, trimmed, 130);
          }
        }
      }

      // 7. FAQs match
      if (Array.isArray(s.faqs)) {
        const foundFaq = s.faqs.find(f => 
          normalizeText(f.question).includes(normQuery) || 
          normalizeText(f.answer).includes(normQuery)
        );
        if (foundFaq) {
          score += 30;
          if (score < 50) {
            matchType = 'faq';
            matchedFieldLabel = 'Preguntas Frecuentes';
            matchedSnippet = `${foundFaq.question} - ${extractSnippet(foundFaq.answer, trimmed, 100)}`;
          }
        }
      }

      // 8. Decision Tree match (if applicable)
      if (Array.isArray(s.decisionTree)) {
        let treeFoundText = '';
        const searchTree = (nodes: any[]) => {
          for (const node of nodes) {
            if (normalizeText(node.title || '').includes(normQuery)) {
              treeFoundText = node.title;
              return;
            }
            if (node.contentData?.text && normalizeText(node.contentData.text).includes(normQuery)) {
              treeFoundText = extractSnippet(node.contentData.text, trimmed, 120);
              return;
            }
            if (node.children) searchTree(node.children);
          }
        };
        searchTree(s.decisionTree);
        if (treeFoundText) {
          score += 25;
          if (score < 50) {
            matchType = 'tree';
            matchedFieldLabel = 'Guía interactiva';
            matchedSnippet = treeFoundText;
          }
        }
      }

      // 9. Layout Blocks match (if custom blocks exist)
      if (Array.isArray(s.layoutBlocks)) {
        for (const block of s.layoutBlocks) {
          if (block.type === 'text') {
            const cleanContent = (block.content || '').replace(/<[^>]+>/g, ' ');
            if (normalizeText(cleanContent).includes(normQuery)) {
              score += 20;
              if (score < 50) {
                matchType = 'block';
                matchedFieldLabel = block.title ? `Sección "${block.title}"` : 'Contenido del trámite';
                matchedSnippet = extractSnippet(cleanContent, trimmed, 130);
              }
              break;
            }
          }
        }
      }

      if (score > 0) {
        results.push({
          service: s,
          score,
          matchType,
          matchedSnippet,
          matchedFieldLabel
        });
      }
    }

    // Sort by relevance score descending, then by title
    return results.sort((a, b) => {
      if (b.score !== a.score) return b.score - a.score;
      return a.service.title.localeCompare(b.service.title);
    });
  }, [services, searchQuery]);

  // Filter by category if user selects a tab
  const filteredResults = useMemo(() => {
    if (selectedCategoryFilter === 'all') return searchResults;
    return searchResults.filter(r => r.service.category === selectedCategoryFilter);
  }, [searchResults, selectedCategoryFilter]);

  // Unique categories in results for pills
  const availableCategories = useMemo(() => {
    const cats = new Set<string>();
    searchResults.forEach(r => {
      if (r.service.category) cats.add(r.service.category);
    });
    return Array.from(cats);
  }, [searchResults]);

  const handleSelectServiceItem = (service: Service & { hidden?: boolean }) => {
    window.scrollTo({ top: 0, behavior: 'instant' });
    const scrollContainer = document.getElementById('phone-main-scrollable-content');
    if (scrollContainer) {
      scrollContainer.scrollTo({ top: 0, behavior: 'instant' });
    }
    onSelectService(service);
  };

  return (
    <div className="space-y-4 animate-fadeIn pb-12">
      {/* Search Bar Input & Filter Header */}
      <section className="bg-white rounded-2xl border border-slate-200/80 p-4 sm:p-5 shadow-xs">
        <div className="max-w-3xl mx-auto space-y-3">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2.5">
                <Search className="w-6 h-6 text-blue-600 shrink-0" strokeWidth={2.5} />
                <span>Búsqueda Global de Trámites</span>
              </h2>
              <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
                Escribe palabras clave como vacaciones, nómina, constancia, vales o IMSS.
              </p>
            </div>
          </div>

          {/* Large Input with Quick Clear and Submit */}
          <div className="relative flex items-center">
            <Search className="absolute left-4 w-5 h-5 text-slate-400 pointer-events-none" />
            <input
              type="text"
              id="global-search-input"
              value={searchQuery}
              onChange={(e) => onSearchQueryChange(e.target.value)}
              placeholder="Buscar trámite, servicio, nómina, vacaciones..."
              className="w-full pl-11 pr-11 py-3.5 bg-slate-50 hover:bg-slate-100/80 focus:bg-white text-slate-800 placeholder:text-slate-400 font-medium text-base rounded-xl border border-slate-200 focus:border-blue-500 focus:ring-3 focus:ring-blue-100 outline-none transition-all shadow-inner"
              autoFocus
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => onSearchQueryChange('')}
                className="absolute right-3.5 p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-200/70 transition-colors cursor-pointer"
                title="Limpiar búsqueda"
              >
                <X className="w-5 h-5" />
              </button>
            )}
          </div>

          {/* Suggestion Chips */}
          <div className="flex items-center gap-1.5 flex-wrap pt-1 text-xs text-slate-500">
            <span className="font-semibold text-slate-400 flex items-center gap-1">
              <Sparkles className="w-3 h-3 text-amber-500" /> Búsquedas comunes:
            </span>
            {popularKeywords.map((kw) => (
              <button
                key={kw}
                type="button"
                onClick={() => onSearchQueryChange(kw)}
                className={`px-2.5 py-1 rounded-lg border text-xs font-semibold transition-all cursor-pointer ${
                  searchQuery.toLowerCase() === kw.toLowerCase()
                    ? 'bg-blue-600 text-white border-blue-600 shadow-2xs'
                    : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-blue-50 hover:text-blue-700 hover:border-blue-200'
                }`}
              >
                {kw}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Results Section */}
      {searchQuery.trim() ? (
        <section className="space-y-4">
          {/* Header Indicating Match Count (Requirement 2) */}
          <div className="bg-white rounded-xl border border-slate-200/80 p-3 sm:p-4 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h3 className="text-base sm:text-lg font-bold text-slate-800">
                Se muestran <span className="text-blue-600 font-black">{filteredResults.length}</span> {filteredResults.length === 1 ? 'coincidencia' : 'coincidencias'} de <span className="text-blue-700 font-black underline decoration-blue-300">"{searchQuery.trim()}"</span>
              </h3>
              {availableCategories.length > 1 && (
                <p className="text-xs text-slate-500 mt-0.5">
                  Haz clic en cualquier trámite para abrir su tarjeta y comenzar tu solicitud.
                </p>
              )}
            </div>

            {/* Category Filter Pills */}
            {availableCategories.length > 1 && (
              <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
                <button
                  type="button"
                  onClick={() => setSelectedCategoryFilter('all')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
                    selectedCategoryFilter === 'all'
                      ? 'bg-slate-900 text-white shadow-xs'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  Todos ({searchResults.length})
                </button>
                {availableCategories.map((cat) => {
                  const count = searchResults.filter(r => r.service.category === cat).length;
                  return (
                    <button
                      key={cat}
                      type="button"
                      onClick={() => setSelectedCategoryFilter(cat)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
                        selectedCategoryFilter === cat
                          ? 'bg-blue-600 text-white shadow-xs'
                          : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                      }`}
                    >
                      {cat} ({count})
                    </button>
                  );
                })}
              </div>
            )}
          </div>

          {/* Results List */}
          {filteredResults.length > 0 ? (
            <div className="grid grid-cols-1 gap-3">
              {filteredResults.map((result) => {
                const service = result.service;
                const IconComponent = SERVICE_ICON_MAP[service.iconName || ''] || FileText;

                return (
                  <div
                    key={service.id}
                    onClick={() => handleSelectServiceItem(service)}
                    className="group bg-white rounded-2xl border border-slate-200/90 p-4 sm:p-5 hover:border-blue-400 hover:shadow-md transition-all duration-200 cursor-pointer relative overflow-hidden"
                  >
                    {/* Left Accent Bar on Hover */}
                    <div className="absolute top-0 left-0 bottom-0 w-1 bg-blue-600 opacity-0 group-hover:opacity-100 transition-opacity" />

                    <div className="flex items-start gap-3.5 sm:gap-4.5">
                      {/* Service Icon Box */}
                      <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-blue-50 group-hover:bg-blue-600 text-blue-600 group-hover:text-white flex items-center justify-center shrink-0 transition-colors shadow-2xs border border-blue-100/60 group-hover:border-blue-600">
                        <IconComponent className="w-6 h-6 sm:w-7 sm:h-7 transition-transform group-hover:scale-110" />
                      </div>

                      {/* Content Column */}
                      <div className="flex-1 min-w-0">
                        {/* Breadcrumbs / Categoría */}
                        <div className="flex items-center gap-1.5 text-xs text-slate-400 font-medium mb-1">
                          <span className="text-slate-400">Inicio</span>
                          <ChevronRight className="w-3 h-3 text-slate-300 shrink-0" />
                          <span className="font-semibold text-blue-700 bg-blue-50 px-2 py-0.5 rounded-md">
                            {service.category || 'Trámite'}
                          </span>
                        </div>

                        {/* Título del Servicio/Trámite */}
                        <h4 className="text-base sm:text-lg font-black text-slate-900 group-hover:text-blue-600 transition-colors flex items-center gap-2">
                          <HighlightedText text={service.title} query={searchQuery} />
                          <ArrowUpRight className="w-4 h-4 text-slate-400 group-hover:text-blue-600 opacity-0 group-hover:opacity-100 transition-all -translate-y-0.5 group-hover:translate-x-0.5 shrink-0" />
                        </h4>

                        {/* Extracto / Coincidencia de texto resaltando el fragmento relevante */}
                        <div className="mt-1.5 text-sm text-slate-600 leading-relaxed">
                          <div className="inline-flex items-center gap-1 text-[11px] font-semibold text-slate-400 mr-1.5">
                            <Tag className="w-3 h-3 text-slate-400" />
                            <span>{result.matchedFieldLabel}:</span>
                          </div>
                          <span className="text-slate-700 font-normal">
                            <HighlightedText text={result.matchedSnippet} query={searchQuery} />
                          </span>
                        </div>
                      </div>

                      {/* Right Action Button on Desktop */}
                      <div className="hidden sm:flex flex-col items-end justify-center self-center shrink-0 pl-2">
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleSelectServiceItem(service);
                          }}
                          className="px-3.5 py-2 bg-slate-100 group-hover:bg-blue-600 text-slate-700 group-hover:text-white font-bold text-xs rounded-xl transition-all shadow-2xs group-hover:shadow-xs flex items-center gap-1 cursor-pointer"
                        >
                          <span>Ver trámite</span>
                          <ChevronRight className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            /* Friendly Empty State (Requirement 4) */
            <div className="bg-white rounded-2xl border border-slate-200/80 p-8 sm:p-12 text-center space-y-4 shadow-xs">
              <div className="w-16 h-16 rounded-full bg-amber-50 text-amber-600 flex items-center justify-center mx-auto border border-amber-200/60 shadow-inner">
                <Search className="w-8 h-8 text-amber-500" strokeWidth={2} />
              </div>

              <div className="max-w-md mx-auto space-y-1.5">
                <h3 className="text-lg sm:text-xl font-bold text-slate-800">
                  No se encontraron trámites relacionados con "{searchQuery.trim()}"
                </h3>
                <p className="text-sm text-slate-500 leading-relaxed">
                  Verifica que las palabras estén bien escritas o prueba buscando por categorías generales como nómina, vacaciones o IMSS.
                </p>
              </div>

              {/* Suggestions to try again */}
              <div className="pt-2">
                <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2.5">
                  Quizás quisiste buscar:
                </p>
                <div className="flex flex-wrap items-center justify-center gap-2 max-w-lg mx-auto">
                  {['Vacaciones', 'Recibos de Nómina', 'Incapacidad IMSS', 'Constancia', 'Vales y Tarjeta'].map((item) => (
                    <button
                      key={item}
                      type="button"
                      onClick={() => onSearchQueryChange(item)}
                      className="px-3 py-1.5 bg-slate-100 hover:bg-blue-50 text-slate-700 hover:text-blue-700 text-xs font-semibold rounded-lg border border-slate-200 transition-colors cursor-pointer"
                    >
                      {item}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}
        </section>
      ) : (
        /* Default State when no query is typed yet */
        <section className="bg-white rounded-2xl border border-slate-200/80 p-6 sm:p-8 shadow-xs space-y-6">
          <div className="max-w-2xl mx-auto text-center space-y-2">
            <h3 className="text-lg sm:text-xl font-black text-slate-800">
              ¿Qué trámite deseas consultar hoy?
            </h3>
            <p className="text-sm text-slate-500 leading-relaxed">
              Encuentra al instante información sobre tus recibos, vacaciones disponibles, incapacidades, préstamos o checador.
            </p>
          </div>

          {/* Quick Category Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5 max-w-4xl mx-auto">
            <div 
              onClick={() => onSearchQueryChange('nómina')}
              className="p-4 rounded-xl border border-slate-200 bg-emerald-50/30 hover:bg-emerald-50 hover:border-emerald-300 transition-all cursor-pointer group"
            >
              <div className="w-10 h-10 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center mb-2.5 group-hover:scale-105 transition-transform">
                <Tag className="w-5 h-5" />
              </div>
              <h4 className="font-bold text-slate-900 text-sm group-hover:text-emerald-800">Nómina y Pagos</h4>
              <p className="text-xs text-slate-500 mt-1">Fechas de pago, recibos de nómina CIF y dudas con depósitos.</p>
            </div>

            <div 
              onClick={() => onSearchQueryChange('vacaciones')}
              className="p-4 rounded-xl border border-slate-200 bg-amber-50/30 hover:bg-amber-50 hover:border-amber-300 transition-all cursor-pointer group"
            >
              <div className="w-10 h-10 rounded-lg bg-amber-100 text-amber-700 flex items-center justify-center mb-2.5 group-hover:scale-105 transition-transform">
                <CheckCircle2 className="w-5 h-5" />
              </div>
              <h4 className="font-bold text-slate-900 text-sm group-hover:text-amber-800">Control y Asistencia</h4>
              <p className="text-xs text-slate-500 mt-1">Vacaciones, permisos, checador de huella e incapacidades IMSS.</p>
            </div>

            <div 
              onClick={() => onSearchQueryChange('tarjeta')}
              className="p-4 rounded-xl border border-slate-200 bg-violet-50/30 hover:bg-violet-50 hover:border-violet-300 transition-all cursor-pointer group"
            >
              <div className="w-10 h-10 rounded-lg bg-violet-100 text-violet-700 flex items-center justify-center mb-2.5 group-hover:scale-105 transition-transform">
                <SlidersHorizontal className="w-5 h-5" />
              </div>
              <h4 className="font-bold text-slate-900 text-sm group-hover:text-violet-800">Tarjetas y Créditos</h4>
              <p className="text-xs text-slate-500 mt-1">Vales de despensa, caja de ahorro, préstamos e Infonavit.</p>
            </div>
          </div>

          <div className="bg-slate-50 border border-slate-200/80 rounded-xl p-3.5 flex items-start gap-2.5 max-w-2xl mx-auto">
            <Info className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
            <p className="text-xs text-slate-600">
              <span className="font-bold text-slate-700">Tip de búsqueda:</span> Puedes buscar por palabras clave específicas como <span className="font-semibold text-blue-700">"constancia"</span>, <span className="font-semibold text-blue-700">"reposición"</span> o <span className="font-semibold text-blue-700">"maternidad"</span>.
            </p>
          </div>
        </section>
      )}
    </div>
  );
}
