import React, { useState, useEffect } from 'react';
import { ChevronRight, X, Bell, CheckCheck } from 'lucide-react';
import { NewsItem } from '../types';
import { newsData } from '../data';

export interface NewsTabProps {
  newsList?: NewsItem[];
  onUnreadCountChange?: (count: number) => void;
}

export default function NewsTab({ newsList, onUnreadCountChange }: NewsTabProps) {
  const [selectedNews, setSelectedNews] = useState<NewsItem | null>(null);
  const displayNews = newsList || newsData;

  // Local storage read state
  const [readIds, setReadIds] = useState<Set<string>>(() => {
    try {
      const saved = localStorage.getItem('cc-read-news-v1');
      return saved ? new Set(JSON.parse(saved)) : new Set();
    } catch {
      return new Set();
    }
  });

  // Calculate unread items
  const unreadCount = displayNews.filter(n => !readIds.has(String(n.id))).length;

  useEffect(() => {
    if (onUnreadCountChange) {
      onUnreadCountChange(unreadCount);
    }
  }, [unreadCount, onUnreadCountChange]);

  const markAsRead = (id: string | number) => {
    const next = new Set(readIds);
    next.add(String(id));
    setReadIds(next);
    try {
      localStorage.setItem('cc-read-news-v1', JSON.stringify(Array.from(next)));
    } catch (e) {
      console.error('Error saving read news state', e);
    }
  };

  const markAllAsRead = () => {
    const allIds = new Set(displayNews.map(n => String(n.id)));
    setReadIds(allIds);
    try {
      localStorage.setItem('cc-read-news-v1', JSON.stringify(Array.from(allIds)));
    } catch (e) {
      console.error('Error saving read news state', e);
    }
  };

  const handleOpenNews = (news: NewsItem) => {
    setSelectedNews(news);
    markAsRead(news.id);
  };

  return (
    <div id="news-tab-container" className="space-y-4">
      {/* Header with Title and Mark all as read button */}
      <div className="flex items-center justify-between gap-3 px-1">
        <div className="flex items-center gap-2">
          <h3 className="text-xs sm:text-sm font-bold text-slate-800 uppercase tracking-wider">
            Comunicados Oficiales y Avisos
          </h3>
          {unreadCount > 0 && (
            <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-bold bg-rose-50 text-rose-700 border border-rose-200">
              {unreadCount} {unreadCount === 1 ? 'nuevo' : 'nuevos'}
            </span>
          )}
        </div>

        {unreadCount > 0 && (
          <button
            type="button"
            onClick={markAllAsRead}
            className="flex items-center gap-1.5 text-xs font-semibold text-blue-600 hover:text-blue-800 transition-colors py-1 px-2.5 rounded-lg hover:bg-blue-50 cursor-pointer"
          >
            <CheckCheck className="w-3.5 h-3.5" />
            <span>Marcar todas como leídas</span>
          </button>
        )}
      </div>
      
      {/* Main News List */}
      <div className="space-y-3">
        {displayNews.length > 0 && displayNews.map((news) => {
          const isUnread = !readIds.has(String(news.id));
          return (
            <button
              key={news.id}
              id={`news-item-${news.id}`}
              onClick={() => handleOpenNews(news)}
              className={`w-full text-left bg-white border rounded-2xl p-4 sm:p-5 transition-all flex justify-between items-center cursor-pointer relative shadow-xs hover:shadow-md ${
                isUnread 
                  ? 'border-blue-400 hover:border-blue-600 bg-blue-50/10' 
                  : 'border-slate-200/90 hover:border-slate-300'
              }`}
            >
              <div className="space-y-1.5 flex-1 pr-3">
                <div className="flex items-center gap-2 flex-wrap">
                  {/* Category Pill */}
                  <span className={`text-[11px] font-bold uppercase px-2.5 py-0.5 rounded-md ${
                    news.category === 'evento' 
                      ? 'bg-indigo-50 text-indigo-700 border border-indigo-200' 
                      : news.category === 'comunicado' 
                      ? 'bg-rose-50 text-rose-700 border border-rose-200' 
                      : 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                  }`}>
                    {news.category}
                  </span>

                  {/* Notification Badge: "Nuevo" */}
                  {isUnread && (
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-extrabold uppercase tracking-wide bg-rose-600 text-white shadow-2xs">
                      <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
                      Nuevo
                    </span>
                  )}

                  <span className="text-xs text-slate-500 font-medium">{news.date}</span>
                </div>

                <h4 className="text-sm sm:text-base font-bold text-slate-900 tracking-tight leading-snug">
                  {news.title}
                </h4>
                <p className="text-xs sm:text-sm text-slate-600 font-normal line-clamp-2 leading-relaxed">
                  {news.summary}
                </p>
              </div>

              <div className="w-9 h-9 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-xl flex items-center justify-center text-slate-600 shrink-0 self-center shadow-2xs">
                <ChevronRight className="w-4 h-4" />
              </div>
            </button>
          );
        })}
      </div>

      {/* News Detail Popup Modal */}
      {selectedNews && (
        <div id="news-modal" className="fixed inset-0 bg-slate-900/40 backdrop-blur-2xs z-50 flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-lg rounded-2xl p-5 sm:p-6 space-y-4 max-h-[85vh] overflow-y-auto animate-fadeIn shadow-2xl border border-slate-200">
            <div className="flex justify-between items-center">
              <span className="text-xs font-bold text-blue-700 uppercase tracking-wider bg-blue-50 px-2.5 py-1 rounded-lg border border-blue-200">
                {selectedNews.category}
              </span>
              <button 
                id="close-news-modal"
                onClick={() => setSelectedNews(null)}
                className="w-9 h-9 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 flex items-center justify-center transition-colors cursor-pointer"
                aria-label="Cerrar"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="space-y-1">
              <h3 className="text-base sm:text-lg font-bold text-slate-900 leading-snug">{selectedNews.title}</h3>
              <p className="text-xs text-slate-500 font-medium">{selectedNews.date} • Publicado por Comunicación Interna</p>
            </div>

            <p className="text-sm text-slate-700 leading-relaxed font-normal whitespace-pre-line bg-slate-50 p-4 rounded-xl border border-slate-200">
              {selectedNews.content}
            </p>

            <button
              onClick={() => setSelectedNews(null)}
              className="w-full py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl text-sm transition-colors shadow-xs cursor-pointer min-h-[44px]"
            >
              Entendido, volver a comunicados
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
