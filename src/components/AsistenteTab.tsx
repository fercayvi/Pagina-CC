import React, { useState } from 'react';
import { MapPin, Clock, Phone } from 'lucide-react';
import { UserProfile, ContactInfo } from '../types';
import { initialContact } from '../data';
import { ImageLightboxModal } from './ImageLightboxModal';

export interface AsistenteTabProps {
  user?: UserProfile;
  contactInfo?: ContactInfo;
}

export default function AsistenteTab({ 
  user, 
  contactInfo 
}: AsistenteTabProps) {
  const info = contactInfo || initialContact;
  const [isLightboxOpen, setIsLightboxOpen] = useState<boolean>(false);

  const rawWhatsapp = (contactInfo?.whatsapp ?? info.whatsapp ?? '').trim();
  const hasWhatsapp = Boolean(rawWhatsapp);

  const formatPhoneNumber = (num: string) => {
    const cleaned = num.replace(/[^0-9]/g, '');
    if (cleaned.length === 10) {
      return `${cleaned.slice(0, 2)} ${cleaned.slice(2, 6)} ${cleaned.slice(6)}`;
    }
    if (cleaned.length === 12 && cleaned.startsWith('52')) {
      const ten = cleaned.slice(2);
      return `${ten.slice(0, 2)} ${ten.slice(2, 6)} ${ten.slice(6)}`;
    }
    return num;
  };

  return (
    <div id="contacto-rh-tab-view" className="space-y-3">
      {/* Direct Contact Buttons - Solid High Contrast Kiosk Buttons */}
      {hasWhatsapp && (
        <div className="bg-white border border-slate-200/90 rounded-2xl p-4 sm:p-5 shadow-xs space-y-3.5" id="rh-contact-buttons-panel">
          <h3 className="text-xs sm:text-sm font-bold text-slate-800 uppercase tracking-wider flex items-center gap-2">
            <Phone className="w-4 h-4 text-emerald-600" />
            <span>Canales de Contacto Directo</span>
          </h3>

          <div 
            id="info-contact-whatsapp"
            className="p-4 sm:p-5 bg-slate-50 border border-slate-200 rounded-xl flex items-center gap-4"
          >
            <div className="flex items-center gap-3.5 min-w-0">
              <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0 shadow-2xs">
                <Phone className="w-5 h-5 text-emerald-600" />
              </div>
              <div className="space-y-0.5 min-w-0">
                <span className="text-xs font-semibold text-slate-500 uppercase tracking-wide block">
                  Teléfono de Centro de Servicios
                </span>
                <p className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight select-all">
                  {formatPhoneNumber(rawWhatsapp)}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Office Schedule and Location Info */}
      <div className="bg-white border border-slate-200/90 rounded-2xl p-4 sm:p-5 shadow-xs space-y-3.5">
        <h3 className="text-xs sm:text-sm font-bold text-slate-800 uppercase tracking-wider flex items-center gap-2">
          <Clock className="w-4 h-4 text-blue-600" />
          <span>Módulo de Servicios al Personal</span>
        </h3>
        
        <div className="flex flex-col gap-3 text-xs sm:text-sm text-slate-800">
          {/* 1. Horario de atención */}
          <div className="w-full bg-slate-50 p-3.5 sm:p-4 rounded-xl border border-slate-200 flex items-start gap-3">
            <Clock className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
            <div className="w-full">
              <span className="font-bold text-slate-900 block text-xs sm:text-sm">Horario de atención:</span>
              <div className="text-xs sm:text-sm text-slate-700 font-medium block mt-1 leading-relaxed whitespace-pre-line">
                {info.horario}
              </div>
            </div>
          </div>

          {/* 2. Ubicación física y Croquis */}
          <div className="w-full bg-slate-50 p-3.5 sm:p-4 rounded-xl border border-slate-200 flex items-start gap-3">
            <MapPin className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
            <div className="w-full">
              <span className="font-bold text-slate-900 block text-xs sm:text-sm">Ubicación física:</span>
              <span className="text-xs sm:text-sm text-slate-700 font-medium block mt-1 leading-relaxed">{info.ubicacion}</span>
              
              {info.croquisUrl && (
                <div className="mt-3 flex justify-center w-full">
                  <div 
                    className="relative cursor-pointer overflow-hidden rounded-xl inline-block max-w-full border border-slate-200 shadow-2xs"
                    onClick={() => setIsLightboxOpen(true)}
                  >
                    <img 
                      src={info.croquisUrl} 
                      alt="Croquis de ubicación" 
                      className="max-w-full md:max-w-sm h-auto rounded-xl object-contain" 
                    />
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
          title="Croquis de Ubicación - Módulo de Servicios al Personal"
          onClose={() => setIsLightboxOpen(false)}
        />
      )}
    </div>
  );
}


