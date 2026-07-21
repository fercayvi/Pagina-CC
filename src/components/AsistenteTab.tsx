import React from 'react';
import { MessageSquareText, ExternalLink } from 'lucide-react';
import { UserProfile } from '../types';
import ChatBot from './ChatBot';

interface AsistenteTabProps {
  user: UserProfile;
}

export default function AsistenteTab({ user }: AsistenteTabProps) {
  return (
    <div id="asistente-tab-view" className="space-y-4 animate-fadeIn">
      {/* Title block */}
      <div className="pb-1" id="asistente-title-block">
        <h2 className="text-xl font-extrabold tracking-tight text-slate-900 font-display">Asistente Virtual</h2>
        <p className="text-xs text-slate-500 leading-relaxed font-medium">
          Resuelve tus dudas sobre nómina, transporte, vacaciones y más de manera inmediata.
        </p>
      </div>

      <div className="bg-blue-50 border border-blue-100 rounded-2xl p-4 flex gap-3" id="asistente-info-banner">
        <div className="bg-blue-600 p-2.5 rounded-xl text-white shrink-0 h-10 w-10 flex items-center justify-center">
          <MessageSquareText className="w-5 h-5" />
        </div>
        <div>
          <h3 className="text-xs font-bold text-blue-950">Asistente Virtual Autoguiado</h3>
          <p className="text-[11px] text-blue-800 mt-0.5">El chatbot de abajo puede darte respuestas para resolver tus dudas en menos de 10 segundos.</p>
        </div>
      </div>

      {/* Embed Chatbot */}
      <ChatBot user={user} />

      {/* Quick Contacts Panel */}
      <div className="bg-white border border-slate-200/60 rounded-2xl p-4" id="asistente-quick-contacts">
        <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider mb-3">Oficina de Recursos Humanos</h3>
        <div className="space-y-3">
          <a 
            href="https://wa.me/525512345678" 
            target="_blank" 
            rel="noreferrer"
            className="flex items-center justify-between p-2.5 bg-emerald-50 hover:bg-emerald-100/50 border border-emerald-200/50 rounded-xl transition-all"
            id="link-wa-rh"
          >
            <div className="flex items-center gap-2">
              <span className="w-8 h-8 rounded-full bg-emerald-500 text-white flex items-center justify-center text-xs font-bold">WA</span>
              <div>
                <h4 className="text-xs font-bold text-slate-800">WhatsApp Oficial de RH</h4>
                <p className="text-[9px] text-emerald-600 font-semibold">Respuesta humana de Lunes a Viernes</p>
              </div>
            </div>
            <ExternalLink className="w-4 h-4 text-emerald-600" />
          </a>

          <a 
            href="tel:5512345678" 
            className="flex items-center justify-between p-2.5 bg-blue-50 hover:bg-blue-100/50 border border-blue-200/50 rounded-xl transition-all"
            id="link-tel-rh"
          >
            <div className="flex items-center gap-2">
              <span className="w-8 h-8 rounded-full bg-blue-500 text-white flex items-center justify-center text-xs font-bold">Tel</span>
              <div>
                <h4 className="text-xs font-bold text-slate-800">Conmutador Interno (Ext. 202)</h4>
                <p className="text-[9px] text-blue-600 font-semibold">Urgencias y permisos de incapacidad</p>
              </div>
            </div>
            <ExternalLink className="w-4 h-4 text-blue-600" />
          </a>
        </div>
      </div>
    </div>
  );
}
