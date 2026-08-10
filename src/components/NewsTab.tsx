import React, { useState } from 'react';
import { Award, Gift, Calendar, Sparkles, ChevronRight, X, Heart } from 'lucide-react';
import { NewsItem } from '../types';
import { newsData } from '../data';

interface NewsTabProps {
  newsList?: NewsItem[];
}

export default function NewsTab({ newsList }: NewsTabProps) {
  const [selectedNews, setSelectedNews] = useState<NewsItem | null>(null);
  const displayNews = newsList || newsData;

  // Simulated birth list for operator team bonding
  const birthdays = [
    { name: 'Ana María G.', dept: 'Línea 1 - Ensamble', date: 'Hoy' },
    { name: 'Pedro Luis M.', dept: 'Línea 4 - Embalaje', date: 'Mañana' },
    { name: 'Sofía Isabel T.', dept: 'Calidad - Recibo', date: 'Jul 18' }
  ];

  return (
    <div id="news-tab-container" className="space-y-5">
      {/* Employee of Month Feature Card (Bento Grid Style) */}
      <div className="bg-gradient-to-br from-amber-500 via-amber-600 to-amber-700 rounded-2xl p-4 text-white shadow-xs">
        <div className="flex justify-between items-start mb-2">
          <span className="bg-white/20 text-amber-100 text-[9px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider">
            Reconocimiento Mensual
          </span>
          <Award className="w-5 h-5 text-amber-200 animate-bounce" />
        </div>
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-full bg-amber-100 border-2 border-white flex items-center justify-center font-bold text-amber-800 text-lg">
            MR
          </div>
          <div>
            <h3 className="text-sm font-extrabold">Mateo Rodríguez</h3>
            <p className="text-[11px] text-amber-100 font-medium">Línea 2 - Montacargas • ¡Cero Retardos y 5S Perfecto!</p>
          </div>
        </div>
        <p className="text-[10px] text-amber-50/90 mt-2.5 leading-relaxed">
          "Mateo mantuvo su área de almacén 100% limpia y ordenada, asegurando que los materiales llegaran a tiempo a la línea de ensamble. ¡Gracias por tu esfuerzo, Mateo!"
        </p>
      </div>

      {/* Main News List */}
      <div className="space-y-3">
        <h3 className="text-xs font-extrabold text-slate-400 uppercase tracking-wider px-1">Comunidad e Información</h3>
        
        {newsData.length > 0 && displayNews.map((news) => (
          <button
            key={news.id}
            id={`news-item-${news.id}`}
            onClick={() => setSelectedNews(news)}
            className="w-full text-left bg-white border-2 border-slate-200/80 rounded-2xl p-4 hover:shadow-sm active:scale-99 transition-all flex justify-between items-start cursor-pointer hover:bg-slate-50/50"
          >
            <div className="space-y-1.5 flex-1 pr-3">
              <div className="flex items-center gap-2">
                <span className={`text-[8px] font-extrabold uppercase px-1.5 py-0.5 rounded-md ${
                  news.category === 'evento' ? 'bg-indigo-50 text-indigo-700' :
                  news.category === 'comunicado' ? 'bg-rose-50 text-rose-700' : 'bg-emerald-50 text-emerald-700'
                }`}>
                  {news.category}
                </span>
                <span className="text-[10px] text-slate-400 font-bold">{news.date}</span>
              </div>
              <h4 className="text-xs font-extrabold text-slate-900 tracking-tight leading-snug">{news.title}</h4>
              <p className="text-[11px] text-slate-500 font-medium line-clamp-2 leading-relaxed">{news.summary}</p>
            </div>
            <div className="w-9 h-9 bg-slate-50 border-2 border-slate-200 rounded-xl flex items-center justify-center text-slate-400 shrink-0 self-center">
              <ChevronRight className="w-4 h-4 text-slate-600" strokeWidth={2.5} />
            </div>
          </button>
        ))}
      </div>

      {/* Birthdays Week */}
      <div className="bg-white border-2 border-slate-200/80 rounded-2xl p-4">
        <h3 className="text-xs font-extrabold text-slate-900 uppercase tracking-wider mb-2.5 flex items-center gap-1.5">
          <Gift className="w-4 h-4 text-rose-500 animate-pulse" />
          Cumpleaños de la Semana
        </h3>
        <div className="space-y-2">
          {birthdays.map((b, i) => (
            <div key={i} className="flex justify-between items-center py-2 border-b border-slate-100 last:border-0 last:pb-0">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-full bg-rose-50 text-rose-600 flex items-center justify-center font-bold text-xs">
                  <Heart className="w-3.5 h-3.5" />
                </div>
                <div>
                  <h4 className="text-xs font-extrabold text-slate-900">{b.name}</h4>
                  <p className="text-[10px] text-slate-500 font-medium">{b.dept}</p>
                </div>
              </div>
              <span className={`text-[9px] font-extrabold px-2 py-0.5 rounded-full ${
                b.date === 'Hoy' ? 'bg-rose-100 text-rose-800 animate-pulse' : 'bg-slate-100 text-slate-500'
              }`}>{b.date}</span>
            </div>
          ))}
        </div>
      </div>

      {/* News Detail Popup Modal */}
      {selectedNews && (
        <div id="news-modal" className="fixed inset-0 bg-slate-900/60 z-50 flex items-end justify-center p-4">
          <div className="bg-white w-full max-w-md rounded-t-3xl rounded-b-xl p-5 space-y-4 max-h-[85vh] overflow-y-auto animate-slideUp">
            <div className="flex justify-between items-center">
              <span className="text-[10px] font-bold text-blue-600 uppercase tracking-widest">{selectedNews.category}</span>
              <button 
                id="close-news-modal"
                onClick={() => setSelectedNews(null)}
                className="w-8 h-8 rounded-full bg-slate-100 text-slate-500 flex items-center justify-center hover:bg-slate-200"
                aria-label="Cerrar"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            
            <div className="space-y-2">
              <h3 className="text-base font-extrabold text-slate-900 leading-snug">{selectedNews.title}</h3>
              <p className="text-[10px] text-slate-400">{selectedNews.date} • Publicado por Comunicación Interna</p>
            </div>

            <p className="text-xs text-slate-700 leading-relaxed font-medium whitespace-pre-line bg-slate-50 p-3 rounded-xl border border-slate-100">
              {selectedNews.content}
            </p>

            <button
              onClick={() => setSelectedNews(null)}
              className="w-full py-2.5 bg-slate-800 hover:bg-slate-900 text-white font-bold rounded-xl text-xs transition-colors"
              style={{ minHeight: '48px' }}
            >
              Entendido, volver a noticias
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
