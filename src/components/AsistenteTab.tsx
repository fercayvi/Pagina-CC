import React from 'react';
import { ExternalLink, Building2, MapPin, Clock, Phone, MessageSquare } from 'lucide-react';
import { UserProfile, ContactInfo } from '../types';
import { initialContact } from '../data';

interface AsistenteTabProps {
  user?: UserProfile;
  contactInfo?: ContactInfo;
}

export default function AsistenteTab({ user, contactInfo }: AsistenteTabProps) {
  const info = contactInfo || initialContact;

  // Format whatsapp URL
  const whatsappUrl = info.whatsapp.startsWith('http') 
    ? info.whatsapp 
    : `https://wa.me/${info.whatsapp.replace(/[^0-9]/g, '')}`;

  // Format tel URL
  const phoneDigits = info.telefono.replace(/[^0-9]/g, '');
  const telUrl = phoneDigits ? `tel:${phoneDigits}` : '#';

  return (
    <div id="contacto-rh-tab-view" className="space-y-5 animate-fadeIn">
      {/* Title block */}
      <div className="bg-white border-2 border-slate-300 rounded-2xl p-5 sm:p-6 shadow-md">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-12 h-12 rounded-2xl bg-blue-700 text-white flex items-center justify-center shrink-0 shadow-sm">
            <Building2 className="w-6 h-6" />
          </div>
          <div>
            <span className="text-xs font-black text-blue-800 bg-blue-100 px-3 py-1 rounded-lg uppercase tracking-wider">
              Atención Directa en Planta
            </span>
            <h2 className="text-xl font-black text-slate-900 font-display mt-0.5">OFICINA DE RECURSOS HUMANOS</h2>
          </div>
        </div>
        <p className="text-xs sm:text-sm text-slate-800 font-semibold leading-relaxed mt-2">
          Canales oficiales de atención para consultas directas, trámites urgentes, dudas de nómina y aclaraciones sobre el personal de planta.
        </p>
      </div>

      {/* Direct Contact Buttons - Solid High Contrast Kiosk Buttons */}
      <div className="bg-white border-2 border-slate-300 rounded-2xl p-5 sm:p-6 shadow-md space-y-4" id="rh-contact-buttons-panel">
        <h3 className="text-xs sm:text-sm font-extrabold text-slate-900 uppercase tracking-wider flex items-center gap-2">
          <MessageSquare className="w-5 h-5 text-blue-700" />
          Canales de Contacto Directo
        </h3>

        {/* Button 1: WhatsApp (Solid Emerald Kiosk Button) */}
        <a 
          href={whatsappUrl} 
          target="_blank" 
          rel="noreferrer"
          id="btn-contact-whatsapp"
          className="flex items-center justify-between p-5 sm:p-6 bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 border-2 border-emerald-500 rounded-2xl transition-all active:scale-[0.98] group shadow-lg cursor-pointer text-white"
        >
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-white text-emerald-700 flex items-center justify-center text-base font-black shrink-0 shadow-md">
              WA
            </div>
            <div>
              <h4 className="text-sm sm:text-base font-black text-white tracking-wide">WhatsApp Oficial de RH</h4>
              <p className="text-xs sm:text-sm text-emerald-100 font-bold mt-0.5">{info.whatsapp}</p>
            </div>
          </div>
          <ExternalLink className="w-6 h-6 text-white group-hover:translate-x-1 transition-transform shrink-0" strokeWidth={2.5} />
        </a>

        {/* Button 2: Conmutador (Solid Blue Kiosk Button) */}
        <a 
          href={telUrl} 
          id="btn-contact-conmutador"
          className="flex items-center justify-between p-5 sm:p-6 bg-blue-600 hover:bg-blue-700 active:bg-blue-800 border-2 border-blue-500 rounded-2xl transition-all active:scale-[0.98] group shadow-lg cursor-pointer text-white"
        >
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-white text-blue-700 flex items-center justify-center text-base font-black shrink-0 shadow-md">
              Tel
            </div>
            <div>
              <h4 className="text-sm sm:text-base font-black text-white tracking-wide">Conmutador Interno / Teléfono</h4>
              <p className="text-xs sm:text-sm text-blue-100 font-bold mt-0.5">{info.telefono}</p>
            </div>
          </div>
          <Phone className="w-6 h-6 text-white group-hover:translate-x-1 transition-transform shrink-0" strokeWidth={2.5} />
        </a>
      </div>

      {/* Office Schedule and Location Info */}
      <div className="bg-white border-2 border-slate-300 rounded-2xl p-5 sm:p-6 shadow-md space-y-4">
        <h3 className="text-xs sm:text-sm font-extrabold text-slate-900 uppercase tracking-wider flex items-center gap-2">
          <Clock className="w-5 h-5 text-slate-800" />
          Ventanilla Presencial
        </h3>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs sm:text-sm text-slate-800">
          <div className="bg-slate-100 p-4 rounded-2xl border-2 border-slate-200 flex items-start gap-3">
            <MapPin className="w-5 h-5 text-slate-700 shrink-0 mt-0.5" strokeWidth={2.5} />
            <div>
              <span className="font-extrabold text-slate-900 block text-sm">Ubicación física:</span>
              <span className="text-xs sm:text-sm text-slate-800 font-semibold block mt-1">{info.ubicacion}</span>
            </div>
          </div>

          <div className="bg-slate-100 p-4 rounded-2xl border-2 border-slate-200 flex items-start gap-3">
            <Clock className="w-5 h-5 text-slate-700 shrink-0 mt-0.5" strokeWidth={2.5} />
            <div>
              <span className="font-extrabold text-slate-900 block text-sm">Horario de atención:</span>
              <span className="text-xs sm:text-sm text-slate-800 font-semibold block mt-1">{info.horario}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

