import React from 'react';
import { ExternalLink, Building2, MapPin, Clock, Phone, MessageSquare } from 'lucide-react';
import { UserProfile } from '../types';

interface AsistenteTabProps {
  user?: UserProfile;
}

export default function AsistenteTab({ user }: AsistenteTabProps) {
  return (
    <div id="contacto-rh-tab-view" className="space-y-4 animate-fadeIn">
      {/* Title block */}
      <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-2xs">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 rounded-xl bg-blue-600 text-white flex items-center justify-center shrink-0 shadow-2xs">
            <Building2 className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[10px] font-bold text-blue-700 bg-blue-50 px-2 py-0.5 rounded-md uppercase tracking-wider">
              Atención Directa
            </span>
            <h2 className="text-lg font-bold text-slate-900 font-display">OFICINA DE RECURSOS HUMANOS</h2>
          </div>
        </div>
        <p className="text-xs text-slate-500 leading-relaxed font-medium pl-1">
          Canales oficiales de atención para consultas directas, trámites urgentes, dudas de nómina y aclaraciones sobre el personal de planta.
        </p>
      </div>

      {/* Direct Contact Buttons */}
      <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-2xs space-y-3" id="rh-contact-buttons-panel">
        <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider mb-1 flex items-center gap-1.5">
          <MessageSquare className="w-4 h-4 text-blue-600" />
          Canales de Contacto Directo
        </h3>

        {/* Button 1: WhatsApp */}
        <a 
          href="https://wa.me/525512345678" 
          target="_blank" 
          rel="noreferrer"
          id="btn-contact-whatsapp"
          className="flex items-center justify-between p-3.5 bg-emerald-50 hover:bg-emerald-100/70 border border-emerald-200/80 rounded-2xl transition-all active:scale-[0.99] group shadow-2xs"
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-emerald-500 text-white flex items-center justify-center text-xs font-extrabold shrink-0 shadow-2xs">
              WA
            </div>
            <div>
              <h4 className="text-xs font-bold text-slate-900 group-hover:text-emerald-900">WhatsApp Oficial de RH</h4>
              <p className="text-[11px] text-emerald-700 font-medium mt-0.5">Respuesta humana de Lunes a Viernes</p>
            </div>
          </div>
          <ExternalLink className="w-4.5 h-4.5 text-emerald-600 group-hover:translate-x-0.5 transition-transform shrink-0" />
        </a>

        {/* Button 2: Conmutador */}
        <a 
          href="tel:5512345678" 
          id="btn-contact-conmutador"
          className="flex items-center justify-between p-3.5 bg-blue-50 hover:bg-blue-100/70 border border-blue-200/80 rounded-2xl transition-all active:scale-[0.99] group shadow-2xs"
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-blue-600 text-white flex items-center justify-center text-xs font-extrabold shrink-0 shadow-2xs">
              Tel
            </div>
            <div>
              <h4 className="text-xs font-bold text-slate-900 group-hover:text-blue-900">Conmutador Interno (Ext. 202)</h4>
              <p className="text-[11px] text-blue-700 font-medium mt-0.5">Urgencias y permisos de incapacidad</p>
            </div>
          </div>
          <ExternalLink className="w-4.5 h-4.5 text-blue-600 group-hover:translate-x-0.5 transition-transform shrink-0" />
        </a>
      </div>

      {/* Office Schedule and Location Info */}
      <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-2xs space-y-3">
        <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
          <Clock className="w-4 h-4 text-slate-600" />
          Ventanilla Presencial
        </h3>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs text-slate-700">
          <div className="bg-slate-50 p-3 rounded-xl border border-slate-200/60 flex items-start gap-2.5">
            <MapPin className="w-4 h-4 text-slate-500 shrink-0 mt-0.5" />
            <div>
              <span className="font-bold text-slate-900 block">Ubicación física:</span>
              <span className="text-[11px] text-slate-600">Planta Baja • Edificio Administrativo (junto al Comedor General)</span>
            </div>
          </div>

          <div className="bg-slate-50 p-3 rounded-xl border border-slate-200/60 flex items-start gap-2.5">
            <Clock className="w-4 h-4 text-slate-500 shrink-0 mt-0.5" />
            <div>
              <span className="font-bold text-slate-900 block">Horario de atención:</span>
              <span className="text-[11px] text-slate-600">Lunes a Viernes de 8:00 AM a 5:00 PM • Sábados de 8:00 AM a 1:00 PM</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

