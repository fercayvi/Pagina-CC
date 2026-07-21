import React from 'react';
import { Calendar, Shield, CreditCard, Award, Phone, Compass, QrCode } from 'lucide-react';
import { UserProfile } from '../types';

interface PerfilTabProps {
  user: UserProfile;
}

export default function PerfilTab({ user }: PerfilTabProps) {
  return (
    <div id="perfil-tab-container" className="space-y-4">
      {/* Digital Operator Badge (Card visual representation) */}
      <div className="bg-slate-900 rounded-3xl p-5 text-white shadow-lg relative overflow-hidden border border-slate-800">
        {/* Glow decoration */}
        <div className="absolute -right-10 -top-10 w-32 h-32 bg-blue-500/20 rounded-full blur-2xl"></div>
        <div className="absolute -left-10 -bottom-10 w-32 h-32 bg-emerald-500/10 rounded-full blur-2xl"></div>

        {/* Badge Header */}
        <div className="flex justify-between items-start mb-4">
          <div className="flex items-center gap-2">
            <Shield className="w-5 h-5 text-blue-400" />
            <span className="text-[10px] font-bold tracking-widest text-slate-300 uppercase">Gafete Digital de Planta</span>
          </div>
          <span className="text-[10px] font-black bg-blue-500/30 text-blue-300 px-2 py-0.5 rounded-full border border-blue-500/20 uppercase tracking-widest">
            {user.shift.split(' ')[0]}
          </span>
        </div>

        {/* Badge Body */}
        <div className="flex gap-4 items-center mb-4">
          {/* Avatar box */}
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-600 border-2 border-white flex items-center justify-center font-extrabold text-white text-xl shadow-md">
            {user.name.split(' ').map(n => n[0]).slice(0, 2).join('')}
          </div>
          
          <div className="space-y-1">
            <h3 className="text-sm font-bold tracking-tight text-white leading-tight">{user.name}</h3>
            <p className="text-xs text-slate-300 font-medium">{user.position}</p>
            <p className="text-[10px] text-slate-400 font-semibold uppercase">{user.department}</p>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-slate-800 my-3"></div>

        {/* Badge Footer info + QR */}
        <div className="flex justify-between items-center">
          <div className="space-y-2">
            <div>
              <p className="text-[9px] text-slate-400 font-bold uppercase tracking-wider">Número de Empleado</p>
              <p className="text-xs font-mono font-bold text-blue-300">{user.employeeId}</p>
            </div>
            <div>
              <p className="text-[9px] text-slate-400 font-bold uppercase tracking-wider">Fecha de Ingreso</p>
              <p className="text-xs font-bold text-slate-200">{user.hiringDate}</p>
            </div>
          </div>
          
          {/* Mock QR Code for clock-in and dining hall */}
          <div className="bg-white p-2 rounded-xl flex flex-col items-center gap-1 shadow-md border border-slate-100">
            <QrCode className="w-12 h-12 text-slate-900" />
            <span className="text-[8px] text-slate-500 font-black tracking-widest uppercase">ESCANEAR</span>
          </div>
        </div>
      </div>

      {/* General Information Card */}
      <div className="bg-white border-2 border-slate-200/80 rounded-2xl p-4 space-y-3 shadow-2xs">
        <h4 className="text-xs font-extrabold text-slate-900 uppercase tracking-wider">Información para Trámites IMSS / SAT</h4>
        
        <div className="grid grid-cols-2 gap-3 text-xs">
          <div className="bg-slate-50 p-2.5 rounded-xl border-2 border-slate-200/60">
            <span className="text-[9px] text-slate-400 font-extrabold uppercase tracking-wide block">NSS (Seguro Social)</span>
            <span className="font-mono font-extrabold text-slate-800 mt-0.5 block">{user.nss}</span>
          </div>
          <div className="bg-slate-50 p-2.5 rounded-xl border-2 border-slate-200/60">
            <span className="text-[9px] text-slate-400 font-extrabold uppercase tracking-wide block">RFC con Homoclave</span>
            <span className="font-mono font-extrabold text-slate-800 mt-0.5 block">{user.rfc}</span>
          </div>
        </div>
      </div>

      {/* Supervisor Card */}
      <div className="bg-white border-2 border-slate-200/80 rounded-2xl p-4 shadow-2xs">
        <h4 className="text-xs font-extrabold text-slate-900 uppercase tracking-wider mb-2.5">Tu Líder de Turno</h4>
        
        <div className="flex justify-between items-center bg-slate-50 border-2 border-slate-200/60 p-3 rounded-xl">
          <div className="flex items-center gap-3">
            <div className="bg-blue-100 p-2 rounded-lg text-blue-700">
              <Award className="w-5 h-5" strokeWidth={2.5} />
            </div>
            <div>
              <h5 className="text-xs font-extrabold text-slate-900">Supervisor Directo</h5>
              <p className="text-[11px] text-slate-600 font-semibold">{user.supervisor.split('(')[0].trim()}</p>
            </div>
          </div>
          
          <a 
            href="tel:5598765432" 
            className="p-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors flex items-center justify-center cursor-pointer shadow-xs"
            style={{ minHeight: '36px', minWidth: '36px' }}
            aria-label="Llamar a supervisor"
          >
            <Phone className="w-4 h-4" strokeWidth={2.5} />
          </a>
        </div>
      </div>

      {/* App Disclaimer / Info footer */}
      <div className="text-center p-3 text-slate-400">
        <p className="text-[9px] font-bold tracking-wide uppercase">Centro de Servicios • Versión Móvil 1.1</p>
        <p className="text-[8px] mt-0.5 leading-relaxed">Diseñado exclusivamente para el personal de producción. Si notas alguna inconsistencia en tus saldos, repórtalo directamente en Recursos Humanos.</p>
      </div>
    </div>
  );
}
