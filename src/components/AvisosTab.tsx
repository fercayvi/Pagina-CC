import React from 'react';
import { AlertCircle, AlertTriangle, Info, Check, CheckSquare } from 'lucide-react';
import { Aviso } from '../types';

interface AvisosTabProps {
  avisos: Aviso[];
  onMarkAsRead: (id: string) => void;
  onMarkAllAsRead: () => void;
}

export default function AvisosTab({ avisos, onMarkAsRead, onMarkAllAsRead }: AvisosTabProps) {
  
  const getUrgencyStyles = (urgency: string, read: boolean) => {
    if (read) {
      return {
        bg: 'bg-slate-50/50 border-slate-200/40 text-slate-500',
        badge: 'bg-slate-100 text-slate-400',
        icon: Info,
        iconColor: 'text-slate-400'
      };
    }
    
    switch (urgency) {
      case 'alta':
        return {
          bg: 'bg-rose-50 border-rose-150 text-rose-950',
          badge: 'bg-rose-100 text-rose-800 font-extrabold',
          icon: AlertCircle,
          iconColor: 'text-rose-600'
        };
      case 'media':
        return {
          bg: 'bg-amber-50 border-amber-150 text-amber-950',
          badge: 'bg-amber-100 text-amber-800 font-extrabold',
          icon: AlertTriangle,
          iconColor: 'text-amber-600'
        };
      case 'baja':
      default:
        return {
          bg: 'bg-blue-50 border-blue-150 text-blue-950',
          badge: 'bg-blue-100 text-blue-800 font-extrabold',
          icon: Info,
          iconColor: 'text-blue-600'
        };
    }
  };

  return (
    <div id="avisos-tab-container" className="space-y-4">
      <div className="flex justify-between items-center px-1">
        <div>
          <h3 className="text-xs font-extrabold text-slate-400 uppercase tracking-wider">Avisos de Supervisión</h3>
          <p className="text-[10px] text-slate-500 font-semibold mt-0.5">Alertas y avisos importantes de planta.</p>
        </div>
        
        {avisos.some(a => !a.read) && (
          <button
            id="mark-all-read-btn"
            onClick={onMarkAllAsRead}
            className="text-[11px] text-blue-600 font-extrabold hover:underline flex items-center gap-1 focus:outline-none"
            style={{ minHeight: '32px' }}
          >
            <CheckSquare className="w-3.5 h-3.5" />
            Marcar todo leído
          </button>
        )}
      </div>

      <div className="space-y-3">
        {avisos.map((aviso) => {
          const styles = getUrgencyStyles(aviso.urgency, aviso.read);
          const IconComponent = styles.icon;

          return (
            <div
              key={aviso.id}
              id={`aviso-card-${aviso.id}`}
              className={`border-2 rounded-2xl p-4 transition-all ${styles.bg} ${!aviso.read ? 'shadow-xs' : 'opacity-80'}`}
            >
              <div className="flex justify-between items-start mb-2.5">
                <div className="flex items-center gap-2">
                  <IconComponent className={`w-4 h-4 shrink-0 ${styles.iconColor}`} strokeWidth={2.5} />
                  <span className={`text-[9px] font-extrabold px-2 py-0.5 rounded-md uppercase tracking-wider ${styles.badge}`}>
                    {aviso.urgency === 'alta' ? 'Urgente' : aviso.urgency === 'media' ? 'Importante' : 'Noticia'}
                  </span>
                </div>
                <span className="text-[9px] text-slate-500 font-bold">{aviso.date}</span>
              </div>

              <h4 className={`text-xs font-extrabold ${aviso.read ? 'text-slate-600' : 'text-slate-900'} leading-snug`}>
                {aviso.title}
              </h4>
              
              <p className={`text-[11px] mt-1.5 leading-relaxed ${aviso.read ? 'text-slate-500' : 'text-slate-700'} font-medium whitespace-pre-line`}>
                {aviso.message}
              </p>

              <div className="mt-3.5 pt-2.5 border-t border-slate-200/50 flex justify-between items-center">
                <span className="text-[9px] text-slate-500 font-extrabold uppercase tracking-wider">De: {aviso.sender}</span>
                
                {!aviso.read ? (
                  <button
                    id={`mark-read-btn-${aviso.id}`}
                    onClick={() => onMarkAsRead(aviso.id)}
                    className="text-[10px] bg-white border-2 border-slate-200 text-slate-700 font-extrabold py-1 px-3 rounded-lg hover:bg-slate-50 hover:text-slate-900 hover:border-slate-300 transition-all flex items-center gap-1 cursor-pointer shadow-2xs"
                    style={{ minHeight: '32px' }}
                  >
                    <Check className="w-3.5 h-3.5 text-emerald-500" strokeWidth={3} />
                    Entendido
                  </button>
                ) : (
                  <span className="text-[10px] text-slate-500 font-bold italic flex items-center gap-1">
                    <Check className="w-3.5 h-3.5 text-slate-400" strokeWidth={2.5} /> Leído
                  </span>
                )}
              </div>
            </div>
          );
        })}

        {avisos.length === 0 && (
          <div className="bg-white border border-slate-100 rounded-2xl p-8 text-center text-slate-400">
            <Check className="w-10 h-10 text-emerald-500 mx-auto mb-2" />
            <p className="text-xs font-bold">¡Estás al día!</p>
            <p className="text-[10px] mt-0.5">No hay avisos pendientes por el momento.</p>
          </div>
        )}
      </div>
    </div>
  );
}
