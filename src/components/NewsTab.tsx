import React, { useState } from 'react';
import { Award, ChevronRight, X } from 'lucide-react';
import { NewsItem } from '../types';

interface NewsTabProps {
  news?: NewsItem[];
  newsList?: NewsItem[];
}

export default function NewsTab({ news, newsList }: NewsTabProps) {
  const [selectedNews, setSelectedNews] = useState<NewsItem | null>(null);
  const displayNews = news || newsList || [];

  return (
    <div id="news-tab-container" className="space-y-5">
      {/* Employee of Month Feature Card (Bento Grid Style) */}
      <div className="bg-gradient-to-br from-amber-500 via-amber-600 to-amber-700 rounded-2xl p-5 text-white shadow-md border-2 border-amber-400/50">
        <div className="flex justify-between items-start mb-2">
          <span className="bg-white/20 text-amber-100 text-xs font-black px-3 py-1 rounded-full uppercase tracking-wider">
            Reconocimiento Mensual
          </span>
          <Award className="w-6 h-6 text-amber-200 animate-bounce" />
        </div>
        <div className="flex items-center gap-3.5 mt-2">
          <div className="w-14 h-14 rounded-2xl bg-amber-100 border-2 border-white flex items-center justify-center font-black text-amber-800 text-xl shadow-xs">
            MR
          </div>
          <div>
            <h3 className="text-base sm:text-lg font-black tracking-wide">Mateo Rodríguez</h3>
            <p className="text-xs sm:text-sm text-amber-100 font-extrabold">Línea 2 - Montacargas • ¡Cero Retardos y 5S Perfecto!</p>
          </div>
        </div>
        <p className="text-xs sm:text-sm text-amber-50/95 mt-3 leading-relaxed font-semibold bg-amber-800/20 p-3 rounded-xl border border-amber-400/30">
          "Mateo mantuvo su área de almacén 100% limpia y ordenada, asegurando que los materiales llegaran a tiempo a la línea de ensamble. ¡Gracias por tu esfuerzo, Mateo!"
        </p>
      </div>

      {/* Main News List */}
      <div className="space-y-3.5">
        <h3 className="text-xs sm:text-sm font-black text-slate-700 uppercase tracking-wider px-1">Comunicados Oficiales y Avisos</h3>
        
        {displayNews.length > 0 ? (
          displayNews.map((news) => (
            <button
              key={news.id}
              id={`news-item-${news.id}`}
              onClick={() => setSelectedNews(news)}
              className="w-full text-left bg-white border-2 border-slate-300 rounded-2xl p-4 sm:p-5 hover:border-blue-500 shadow-md active:scale-98 transition-all flex justify-between items-center cursor-pointer hover:bg-slate-50"
            >
              <div className="space-y-2 flex-1 pr-4">
                <div className="flex items-center gap-2.5">
                  <span className={`text-xs font-black uppercase px-2.5 py-0.5 rounded-md ${
                    news.category === 'evento' ? 'bg-indigo-100 text-indigo-900 border border-indigo-200' :
                    news.category === 'comunicado' ? 'bg-rose-100 text-rose-900 border border-rose-200' : 'bg-emerald-100 text-emerald-900 border border-emerald-200'
                  }`}>
                    {news.category}
                  </span>
                  <span className="text-xs text-slate-600 font-extrabold">{news.date}</span>
                </div>
                <h4 className="text-sm sm:text-base font-extrabold text-slate-900 tracking-tight leading-snug">{news.title}</h4>
                <p className="text-xs sm:text-sm text-slate-700 font-medium line-clamp-2 leading-relaxed">{news.summary}</p>
              </div>
              <div className="w-10 h-10 bg-slate-100 border-2 border-slate-300 rounded-xl flex items-center justify-center text-slate-800 shrink-0 self-center shadow-2xs">
                <ChevronRight className="w-5 h-5 text-slate-800" strokeWidth={2.5} />
              </div>
            </button>
          ))
        ) : (
          <div className="text-center py-10 bg-white border-2 border-slate-300 rounded-2xl p-6 shadow-md">
            <p className="text-sm font-extrabold text-slate-800">No hay comunicados o avisos publicados por el momento.</p>
          </div>
        )}
      </div>

      {/* News Detail Popup Modal */}
      {selectedNews && (
        <div id="news-modal" className="fixed inset-0 bg-slate-900/60 backdrop-blur-2xs z-50 flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-lg rounded-3xl p-6 space-y-4 max-h-[85vh] overflow-y-auto animate-fadeIn shadow-2xl border-2 border-slate-300">
            <div className="flex justify-between items-center">
              <span className="text-xs font-black text-blue-700 uppercase tracking-widest bg-blue-50 px-3 py-1 rounded-lg border border-blue-200">
                {selectedNews.category}
              </span>
              <button 
                id="close-news-modal"
                onClick={() => setSelectedNews(null)}
                className="w-10 h-10 rounded-2xl bg-rose-600 hover:bg-rose-700 text-white flex items-center justify-center shadow-md active:scale-95 transition-transform"
                aria-label="Cerrar"
              >
                <X className="w-6 h-6" strokeWidth={2.5} />
              </button>
            </div>
            
            <div className="space-y-1">
              <h3 className="text-lg sm:text-xl font-extrabold text-slate-900 leading-snug">{selectedNews.title}</h3>
              <p className="text-xs text-slate-600 font-bold">{selectedNews.date} • Publicado por Comunicación Interna</p>
            </div>

            <p className="text-sm text-slate-800 leading-relaxed font-semibold whitespace-pre-line bg-slate-100 p-4 rounded-2xl border border-slate-200">
              {selectedNews.content}
            </p>

            <button
              onClick={() => setSelectedNews(null)}
              className="w-full py-3 bg-slate-900 hover:bg-slate-800 text-white font-extrabold rounded-2xl text-sm transition-transform active:scale-95 shadow-md cursor-pointer uppercase tracking-wider"
              style={{ minHeight: '52px' }}
            >
              Entendido, volver a comunicados
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
