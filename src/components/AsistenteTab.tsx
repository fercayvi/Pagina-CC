import React, { useState } from 'react';
import { ExternalLink, MapPin, Clock, MessageSquare, ZoomIn } from 'lucide-react';
import { UserProfile, ContactInfo } from '../types';
import { initialContact } from '../data';
import { ImageLightboxModal } from './ImageLightboxModal';

interface AsistenteTabProps {
  user?: UserProfile;
  contactInfo?: ContactInfo;
}

export default function AsistenteTab({ user, contactInfo }: AsistenteTabProps) {
  const info = contactInfo || initialContact;
  const [isLightboxOpen, setIsLightboxOpen] = useState<boolean>(false);

  // Format whatsapp URL
  const whatsappUrl = info.whatsapp.startsWith('http') 
    ? info.whatsapp 
    : `https://wa.me/${info.whatsapp.replace(/[^0-9]/g, '')}`;

  return (
    <div id="contacto-rh-tab-view" className="space-y-5 animate-fadeIn">
      {/* Direct Contact Buttons - Solid High Contrast Kiosk Buttons */}
      <div className="bg-white border-2 border-slate-300 rounded-2xl p-5 sm:p-6 shadow-md space-y-4" id="rh-contact-buttons-panel">
        <h3 className="text-xs sm:text-sm font-extrabold text-slate-900 uppercase tracking-wider flex items-center gap-2">
          <MessageSquare className="w-5 h-5 text-emerald-700" />
          Canales de Contacto Directo
        </h3>

        {/* WhatsApp Button (Solid Emerald Kiosk Button) */}
        <a 
          href={whatsappUrl} 
          target="_blank" 
          rel="noreferrer"
          id="btn-contact-whatsapp"
          className="flex items-center justify-between p-5 sm:p-6 bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 border-2 border-emerald-500 rounded-2xl transition-all active:scale-[0.98] group shadow-lg cursor-pointer text-white w-full"
        >
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-white text-emerald-700 flex items-center justify-center text-base font-black shrink-0 shadow-md">
              WA
            </div>
            <div>
              <h4 className="text-sm sm:text-base font-black text-white tracking-wide">WhatsApp de Talento y Cultura</h4>
              <p className="text-xs sm:text-sm text-emerald-100 font-bold mt-0.5">{info.whatsapp}</p>
            </div>
          </div>
          <ExternalLink className="w-6 h-6 text-white group-hover:translate-x-1 transition-transform shrink-0" strokeWidth={2.5} />
        </a>
      </div>

      {/* Office Schedule and Location Info */}
      <div className="bg-white border-2 border-slate-300 rounded-2xl p-5 sm:p-6 shadow-md space-y-4">
        <h3 className="text-xs sm:text-sm font-extrabold text-slate-900 uppercase tracking-wider flex items-center gap-2">
          <Clock className="w-5 h-5 text-slate-800" />
          Ventanilla Presencial
        </h3>
        
        <div className="flex flex-col gap-4 text-xs sm:text-sm text-slate-800">
          {/* 1. Horario de atención */}
          <div className="w-full bg-slate-100 p-4 sm:p-5 rounded-2xl border-2 border-slate-200 flex items-start gap-3">
            <Clock className="w-5 h-5 text-blue-700 shrink-0 mt-0.5" strokeWidth={2.5} />
            <div className="w-full">
              <span className="font-extrabold text-slate-900 block text-sm">Horario de atención:</span>
              <div className="text-xs sm:text-sm text-slate-800 font-semibold block mt-1.5 space-y-1 leading-relaxed whitespace-pre-line">
                {info.horario}
              </div>
            </div>
          </div>

          {/* 2. Ubicación física y Croquis */}
          <div className="w-full bg-slate-100 p-4 sm:p-5 rounded-2xl border-2 border-slate-200 flex items-start gap-3">
            <MapPin className="w-5 h-5 text-blue-700 shrink-0 mt-0.5" strokeWidth={2.5} />
            <div className="w-full">
              <span className="font-extrabold text-slate-900 block text-sm">Ubicación física:</span>
              <span className="text-xs sm:text-sm text-slate-800 font-semibold block mt-1.5 leading-relaxed">{info.ubicacion}</span>
              
              {info.croquisUrl && (
                <div className="mt-4 flex justify-center w-full">
                  <div 
                    className="relative group cursor-pointer overflow-hidden rounded-xl inline-block max-w-full"
                    onClick={() => setIsLightboxOpen(true)}
                    title="Clic para ampliar croquis"
                  >
                    <img 
                      src={info.croquisUrl} 
                      alt="Croquis de ubicación" 
                      className="max-w-full md:max-w-md h-auto rounded-xl shadow-sm border border-gray-100 object-contain hover:opacity-95 transition-opacity" 
                    />
                    <div className="absolute inset-0 bg-slate-900/30 opacity-0 group-hover:opacity-100 transition-opacity rounded-xl flex items-center justify-center gap-1.5 text-white text-xs font-semibold">
                      <ZoomIn className="w-4 h-4" />
                      <span>Ampliar croquis</span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Lightbox Modal para el Croquis */}
      {info.croquisUrl && (
        <ImageLightboxModal
          isOpen={isLightboxOpen}
          imageUrl={info.croquisUrl}
          title="Croquis de Ubicación - Ventanilla de RH"
          onClose={() => setIsLightboxOpen(false)}
        />
      )}
    </div>
  );
}

