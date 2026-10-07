import React, { useState } from 'react';
import { ExternalLink, MapPin, Clock, MessageSquare, ZoomIn } from 'lucide-react';
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
  const isLink = rawWhatsapp.startsWith('http://') || rawWhatsapp.startsWith('https://') || rawWhatsapp.includes('wa.me');

  // Format whatsapp URL
  const whatsappUrl = isLink
    ? (rawWhatsapp.startsWith('http') ? rawWhatsapp : `https://${rawWhatsapp}`)
    : `https://wa.me/${rawWhatsapp.replace(/[^0-9]/g, '')}`;

  const formatPhoneNumber = (num: string) => {
    const cleaned = num.replace(/[^0-9]/g, '');
    if (cleaned.length === 10) {
      return `${cleaned.slice(0, 2)} ${cleaned.slice(2, 6)} ${cleaned.slice(6)}`;
    }
    if (cleaned.length === 12 && cleaned.startsWith('52')) {
      const ten = cleaned.slice(2);
      return `+52 ${ten.slice(0, 2)} ${ten.slice(2, 6)} ${ten.slice(6)}`;
    }
    return num;
  };

  return (
    <div id="contacto-rh-tab-view" className="space-y-3">
      {/* Direct Contact Buttons - Solid High Contrast Kiosk Buttons */}
      {hasWhatsapp && (
        <div className="bg-white border border-slate-200/90 rounded-2xl p-4 sm:p-5 shadow-xs space-y-3.5" id="rh-contact-buttons-panel">
          <h3 className="text-xs sm:text-sm font-bold text-slate-800 uppercase tracking-wider flex items-center gap-2">
            <MessageSquare className="w-4 h-4 text-emerald-600" />
            <span>Canales de Contacto Directo</span>
          </h3>

          {/* WhatsApp Button / Contacto - Condicionado por import.meta.env.DEV */}
          {import.meta.env.DEV ? (
            <a 
              href={whatsappUrl} 
              target="_blank" 
              rel="noreferrer"
              id="btn-contact-whatsapp"
              className="flex items-center justify-between p-4 sm:p-5 bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 rounded-xl transition-all active:scale-[0.98] group shadow-xs cursor-pointer text-white w-full min-h-[52px]"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-white text-emerald-700 flex items-center justify-center text-sm font-extrabold shrink-0 shadow-2xs">
                  WA
                </div>
                <div>
                  <h4 className="text-sm font-bold text-white tracking-tight">WhatsApp de Talento y Cultura</h4>
                  <p className="text-xs text-emerald-100 font-medium mt-0.5">
                    {isLink ? 'Atención por WhatsApp' : formatPhoneNumber(rawWhatsapp)}
                  </p>
                </div>
              </div>
              <ExternalLink className="w-5 h-5 text-white group-hover:translate-x-0.5 transition-transform shrink-0" />
            </a>
          ) : (
            <div 
              id="info-contact-whatsapp"
              className="p-4 sm:p-5 bg-slate-50 border border-slate-200 rounded-xl flex justify-between items-center gap-4"
            >
              <div className="flex items-start gap-3">
                <div className="w-9 h-9 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center text-xs font-bold shrink-0 mt-0.5">
                  WA
                </div>
                <div className="space-y-0.5">
                  {isLink ? (
                    <h4 className="text-base sm:text-lg font-bold text-slate-900 tracking-tight">
                      WhatsApp de Talento y Cultura
                    </h4>
                  ) : (
                    <>
                      <span className="text-xs font-semibold text-slate-500 uppercase tracking-wide block">
                        WhatsApp de Talento y Cultura
                      </span>
                      <p className="text-base sm:text-lg font-bold text-slate-900 tracking-tight select-all">
                        {formatPhoneNumber(rawWhatsapp)}
                      </p>
                    </>
                  )}
                  <p className="text-xs text-slate-500 font-normal">
                    Comunícate a este número vía WhatsApp desde tu dispositivo personal.
                  </p>
                </div>
              </div>
              <img 
                src={`https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${encodeURIComponent(whatsappUrl)}`} 
                alt="Escanear para WhatsApp" 
                className="w-20 h-20 sm:w-24 sm:h-24 rounded-lg shadow-sm shrink-0" 
              />
            </div>
          )}
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
                    className="relative group cursor-pointer overflow-hidden rounded-xl inline-block max-w-full border border-slate-200 shadow-2xs"
                    onClick={() => setIsLightboxOpen(true)}
                    title="Clic para ampliar croquis"
                  >
                    <img 
                      src={info.croquisUrl} 
                      alt="Croquis de ubicación" 
                      className="max-w-full md:max-w-sm h-auto rounded-xl object-contain hover:opacity-95 transition-opacity" 
                    />
                    <div className="absolute inset-0 bg-slate-900/40 opacity-0 group-hover:opacity-100 transition-opacity rounded-xl flex items-center justify-center gap-1.5 text-white text-xs font-bold">
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
          title="Croquis de Ubicación - Módulo de Servicios al Personal"
          onClose={() => setIsLightboxOpen(false)}
        />
      )}
    </div>
  );
}


