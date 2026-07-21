import React, { useState } from 'react';
import { 
  ChevronLeft, Banknote, PiggyBank, CreditCard, CalendarDays, Bus, 
  Shirt, ShieldAlert, HelpCircle, MessageSquareText, CheckCircle2, 
  AlertTriangle, Phone, ExternalLink, Clock, Send, Sparkles, AlertCircle, Info, MapPin
} from 'lucide-react';
import { ServiceId, Service, UserProfile, FAQ } from '../types';
import { faqsData } from '../data';
import ChatBot from './ChatBot';

function FAQAccordion({ items, variant = 'full' }: { items: FAQ[], variant?: 'full' | 'simple' }) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const toggle = (idx: number) => {
    setOpenIndex(openIndex === idx ? null : idx);
  };

  if (variant === 'simple') {
    return (
      <div className="space-y-3.5 mt-2">
        {items.map((faq, idx) => {
          const isOpen = openIndex === idx;
          return (
            <div key={idx} className="border-b border-slate-100 pb-3.5 last:border-0 last:pb-0">
              <button
                onClick={() => toggle(idx)}
                className="w-full text-left font-bold text-xs text-slate-800 flex justify-between items-start gap-3 hover:text-blue-600 transition-colors focus:outline-none py-1 group"
              >
                <span className="group-hover:text-blue-600 transition-colors">{faq.question}</span>
                <span className="text-slate-400 font-extrabold text-xs shrink-0 select-none bg-slate-100 group-hover:bg-blue-50 group-hover:text-blue-600 rounded-sm w-4.5 h-4.5 flex items-center justify-center transition-all">
                  {isOpen ? '−' : '+'}
                </span>
              </button>
              {isOpen && (
                <p className="text-[11px] text-slate-500 mt-2 pl-1 leading-relaxed animate-fadeIn border-l border-slate-200">
                  {faq.answer}
                </p>
              )}
            </div>
          );
        })}
      </div>
    );
  }

  return (
    <div className="space-y-2.5">
      {items.map((faq, idx) => {
        const isOpen = openIndex === idx;
        return (
          <div key={idx} className="bg-white border border-slate-200/60 rounded-2xl overflow-hidden transition-all duration-200 shadow-3xs hover:border-slate-300">
            <button
              onClick={() => toggle(idx)}
              className="w-full text-left p-4 flex gap-3 items-center justify-between hover:bg-slate-50/50 transition-colors focus:outline-none"
            >
              <div className="text-xs font-bold text-slate-800 flex gap-2.5 items-start flex-1 pr-2">
                <span className={`text-[9px] font-black rounded-full w-5 h-5 flex items-center justify-center shrink-0 transition-colors ${
                  isOpen ? 'bg-blue-600 text-white' : 'bg-blue-100 text-blue-800'
                }`}>Q</span>
                <span className="mt-0.5">{faq.question}</span>
              </div>
              <span className={`text-slate-400 transition-transform duration-200 text-[10px] font-extrabold p-1 ${
                isOpen ? 'rotate-180 text-blue-600' : ''
              }`}>
                ▼
              </span>
            </button>
            
            {isOpen && (
              <div className="px-4 pb-4 pl-11.5 text-[11px] text-slate-500 leading-relaxed border-l-2 border-blue-500 bg-slate-50/10 animate-fadeIn">
                {faq.answer}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}

interface ServiceDetailProps {
  service: Service;
  user: UserProfile;
  onBack: () => void;
}

export default function ServiceDetail({ service, user, onBack }: ServiceDetailProps) {
  // Common states for calculators
  const [dailySalary, setDailySalary] = useState<number>(350);
  const [yearsOfService, setYearsOfService] = useState<number>(1);
  const [selectedRoute, setSelectedRoute] = useState<'norte' | 'oriente' | 'poniente'>('norte');
  
  // Uniform states
  const [shirtSize, setShirtSize] = useState<string>('M');
  const [pantsSize, setPantsSize] = useState<string>('32');
  const [shoeSize, setShoeSize] = useState<string>('27');
  const [uniformRequested, setUniformRequested] = useState<boolean>(false);

  // Security Report states
  const [hazardLocation, setHazardLocation] = useState<string>('');
  const [hazardDesc, setHazardDesc] = useState<string>('');
  const [hazardReported, setHazardReported] = useState<boolean>(false);
  const [safetyChecklist, setSafetyChecklist] = useState({
    botas: false,
    lentes: false,
    tapones: false,
    chaleco: false
  });

  // Vacation request states
  const [vacStart, setVacStart] = useState<string>('');
  const [vacEnd, setVacEnd] = useState<string>('');
  const [vacRequested, setVacRequested] = useState<boolean>(false);

  // Payslip detail modal simulator
  const [activeDeductionInfo, setActiveDeductionInfo] = useState<string | null>(null);

  // Get FAQs for this service
  const serviceFaqs = faqsData.filter(f => f.category === service.id);

  // Math variables for Fondo de Ahorro
  const weeklySalary = dailySalary * 6; // 6 days
  const weeklySavings = Math.round(weeklySalary * 0.08 * 100) / 100;
  const companyContribution = weeklySavings;
  const totalWeekly = weeklySavings * 2;
  const yearlySavings = Math.round(totalWeekly * 52 * 100) / 100;

  // Math variables for Aguinaldo
  const aguinaldoDays = yearsOfService >= 1 ? 20 : Math.round((yearsOfService * 20)); // Company pays 20 days instead of 15!
  const estimatedAguinaldo = Math.round(dailySalary * aguinaldoDays);

  return (
    <div id={`service-detail-${service.id}`} className="pb-24">
      {/* Header */}
      <div className="flex items-center gap-3 mb-5">
        <button 
          id="btn-back-to-grid"
          onClick={onBack}
          className="w-10 h-10 rounded-xl bg-white border-2 border-slate-200 text-slate-700 flex items-center justify-center hover:bg-slate-50 active:scale-95 transition-transform shadow-2xs"
          aria-label="Volver al inicio"
        >
          <ChevronLeft className="w-5 h-5" strokeWidth={2.5} />
        </button>
        <div>
          <span className="text-[10px] font-extrabold text-blue-600 uppercase tracking-widest">Trámite / Servicio</span>
          <h2 className="text-lg font-extrabold text-slate-900 -mt-0.5">{service.title}</h2>
        </div>
      </div>

      {/* RENDER SPECIFIC SERVICE VIEWS */}

      {/* 1. NÓMINA & PAGOS */}
      {service.id === ServiceId.Nomina && (
        <div className="space-y-4">
          {/* Quick Payday Banner */}
          <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl p-4 text-white shadow-xs">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-blue-100 text-xs font-medium uppercase tracking-wider">Siguiente Día de Pago</p>
                <p className="text-xl font-bold mt-1">Este Viernes (Cada Semana)</p>
                <p className="text-blue-100 text-[11px] mt-0.5">Depósito directo en tu tarjeta Bancomer / Santander antes de las 9:00 AM</p>
              </div>
              <div className="bg-white/15 p-2 rounded-xl">
                <Clock className="w-6 h-6 text-white" />
              </div>
            </div>
          </div>

          {/* Interactive Payslip Guide */}
          <div className="bg-white rounded-2xl border border-slate-200/60 p-4">
            <h3 className="text-sm font-bold text-slate-800 mb-2 flex items-center gap-1.5">
              <Banknote className="w-4 h-4 text-emerald-600" />
              Entiende tu Recibo de Nómina
            </h3>
            <p className="text-[11px] text-slate-500 mb-3">Toca cualquier concepto para ver qué significa en palabras sencillas:</p>
            
            <div className="space-y-2">
              <button 
                onClick={() => setActiveDeductionInfo('sueldo_base')}
                className={`w-full flex justify-between items-center p-2.5 rounded-xl text-left border transition-all ${activeDeductionInfo === 'sueldo_base' ? 'bg-blue-50/70 border-blue-200' : 'bg-slate-50 border-slate-200/50 hover:bg-slate-100/50'}`}
              >
                <span className="text-xs font-semibold text-slate-700">Sueldo Base Semanal</span>
                <span className="text-xs font-bold text-slate-800">$2,400.00 MXN</span>
              </button>
              
              <button 
                onClick={() => setActiveDeductionInfo('premio_puntualidad')}
                className={`w-full flex justify-between items-center p-2.5 rounded-xl text-left border transition-all ${activeDeductionInfo === 'premio_puntualidad' ? 'bg-blue-50/70 border-blue-200' : 'bg-slate-50 border-slate-200/50 hover:bg-slate-100/50'}`}
              >
                <span className="text-xs font-semibold text-slate-700 flex items-center gap-1">
                  Premio de Puntualidad y Asistencia <span className="bg-emerald-100 text-emerald-800 text-[8px] font-bold px-1.5 py-0.5 rounded-sm">¡Extra!</span>
                </span>
                <span className="text-xs font-bold text-emerald-600">+$240.00 MXN</span>
              </button>

              <button 
                onClick={() => setActiveDeductionInfo('imss')}
                className={`w-full flex justify-between items-center p-2.5 rounded-xl text-left border transition-all ${activeDeductionInfo === 'imss' ? 'bg-blue-50/70 border-blue-200' : 'bg-slate-50 border-slate-200/50 hover:bg-slate-100/50'}`}
              >
                <span className="text-xs font-semibold text-slate-700">Retención de IMSS (Seguro Social)</span>
                <span className="text-xs font-bold text-red-600">-$62.40 MXN</span>
              </button>

              <button 
                onClick={() => setActiveDeductionInfo('fondo_ahorro')}
                className={`w-full flex justify-between items-center p-2.5 rounded-xl text-left border transition-all ${activeDeductionInfo === 'fondo_ahorro' ? 'bg-blue-50/70 border-blue-200' : 'bg-slate-50 border-slate-200/50 hover:bg-slate-100/50'}`}
              >
                <span className="text-xs font-semibold text-slate-700 flex items-center gap-1">
                  Tu Ahorro Semanal <span className="bg-blue-100 text-blue-800 text-[8px] font-bold px-1.5 py-0.5 rounded-sm">Fondo</span>
                </span>
                <span className="text-xs font-bold text-slate-700">-$192.00 MXN</span>
              </button>
            </div>

            {/* Explanation box */}
            {activeDeductionInfo && (
              <div className="mt-3 p-3 bg-blue-50/50 border border-blue-100 rounded-xl text-xs text-slate-700 animate-fadeIn">
                {activeDeductionInfo === 'sueldo_base' && (
                  <p><strong>Sueldo Base Semanal:</strong> Es el pago acordado por tu contrato de 6 días laborados. Se calcula multiplicando tu salario base diario por los días trabajados.</p>
                )}
                {activeDeductionInfo === 'premio_puntualidad' && (
                  <p><strong>Premio de Puntualidad y Asistencia:</strong> ¡Un incentivo de la empresa! Si no tienes retardos ni faltas de lunes a sábado, te regalamos el 10% adicional de tu sueldo base semanal.</p>
                )}
                {activeDeductionInfo === 'imss' && (
                  <p><strong>Retención de IMSS:</strong> Es la aportación de ley que te toca para tener derecho a servicio médico gratuito, guarderías e incapacidades pagadas para ti y tu familia.</p>
                )}
                {activeDeductionInfo === 'fondo_ahorro' && (
                  <p><strong>Tu Ahorro Semanal:</strong> Es el 8% que decides ahorrar de tu sueldo. La gran ventaja es que la empresa te aporta otro 8% exactamente igual. Lo verás completo en diciembre.</p>
                )}
              </div>
            )}
          </div>

          {/* Aguinaldo Calculator */}
          <div className="bg-white rounded-2xl border border-slate-200/60 p-4">
            <h3 className="text-sm font-bold text-slate-800 mb-1 flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-indigo-500" />
              Calculadora de Aguinaldo (20 Días de Sueldo)
            </h3>
            <p className="text-[11px] text-slate-500 mb-4">La empresa paga 20 días de aguinaldo (¡5 días más que el mínimo de ley!).</p>
            
            <div className="space-y-3">
              <div>
                <label className="text-xs font-semibold text-slate-600 block mb-1">
                  Tu Salario Base Diario: <span className="text-blue-600 font-bold">${dailySalary} MXN</span>
                </label>
                <input 
                  id="salary-slider-aguinaldo"
                  type="range" 
                  min="250" 
                  max="600" 
                  step="10"
                  value={dailySalary} 
                  onChange={(e) => setDailySalary(Number(e.target.value))}
                  className="w-full accent-blue-600"
                />
                <div className="flex justify-between text-[10px] text-slate-400 mt-1">
                  <span>$250 (Mínimo)</span>
                  <span>$600 (Especialista)</span>
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-600 block mb-1">
                  Años o meses trabajados en el año: <span className="text-blue-600 font-bold">{yearsOfService === 1 ? '1 año completo' : `${Math.round(yearsOfService * 12)} meses`}</span>
                </label>
                <input 
                  id="years-slider-aguinaldo"
                  type="range" 
                  min="0.1" 
                  max="1" 
                  step="0.083" // Roughly 1/12 increments
                  value={yearsOfService} 
                  onChange={(e) => setYearsOfService(Number(e.target.value))}
                  className="w-full accent-blue-600"
                />
                <div className="flex justify-between text-[10px] text-slate-400 mt-1">
                  <span>Recién ingresado (1 mes)</span>
                  <span>1 año completo</span>
                </div>
              </div>

              <div className="bg-indigo-50 border border-indigo-100 rounded-xl p-3 flex justify-between items-center">
                <div>
                  <p className="text-[10px] font-bold text-indigo-800 uppercase tracking-wide">Tu Aguinaldo Estimado</p>
                  <p className="text-xs text-indigo-600">Basado en {yearsOfService >= 1 ? '20 días completos' : `${Math.round(yearsOfService * 20)} días proporcionales`}</p>
                </div>
                <p className="text-lg font-extrabold text-indigo-900">${estimatedAguinaldo.toLocaleString('es-MX')} MXN</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 2. FONDO DE AHORRO */}
      {service.id === ServiceId.FondoAhorro && (
        <div className="space-y-4">
          <div className="bg-emerald-600 rounded-2xl p-4 text-white">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-emerald-100 text-xs font-medium uppercase tracking-wider">Tu Ahorro Acumulado</p>
                <p className="text-2xl font-extrabold mt-1">${user.fondoAhorroBalance.toLocaleString('es-MX')} MXN</p>
                <p className="text-emerald-100 text-[10px] mt-1">Corte: Hoy • Se te deposita la primera semana de diciembre para las fiestas navideñas.</p>
              </div>
              <div className="bg-white/15 p-2 rounded-xl">
                <PiggyBank className="w-6 h-6 text-white" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-slate-200/60 p-4">
            <h3 className="text-sm font-bold text-slate-800 mb-1">Simulador de Fondo de Ahorro (Aporte 1 a 1)</h3>
            <p className="text-[11px] text-slate-500 mb-4">Por cada peso que ahorras de tu sueldo base, la empresa pone otro igual. ¡Duplicas tu dinero gratis!</p>

            <div className="space-y-4">
              <div>
                <label className="text-xs font-semibold text-slate-600 block mb-1">
                  Tu Salario Base Diario: <span className="text-emerald-600 font-bold">${dailySalary} MXN</span>
                </label>
                <input 
                  id="salary-slider-savings"
                  type="range" 
                  min="250" 
                  max="600" 
                  step="10"
                  value={dailySalary} 
                  onChange={(e) => setDailySalary(Number(e.target.value))}
                  className="w-full accent-emerald-600"
                />
              </div>

              <div className="grid grid-cols-2 gap-3 pt-2">
                <div className="bg-slate-50 border border-slate-200/60 rounded-xl p-3 text-center">
                  <p className="text-[10px] text-slate-500 font-semibold">Tú ahorras por semana</p>
                  <p className="text-sm font-bold text-slate-800 mt-0.5">${weeklySavings} MXN</p>
                  <p className="text-[9px] text-slate-400 mt-0.5">(8.33% de tu sueldo)</p>
                </div>
                <div className="bg-slate-50 border border-slate-200/60 rounded-xl p-3 text-center">
                  <p className="text-[10px] text-slate-500 font-semibold">Empresa aporta semanal</p>
                  <p className="text-sm font-bold text-emerald-600 mt-0.5">${companyContribution} MXN</p>
                  <p className="text-[9px] text-emerald-500 mt-0.5">(Aporte patronal igual)</p>
                </div>
              </div>

              <div className="bg-emerald-50 border border-emerald-100 rounded-xl p-4 flex justify-between items-center">
                <div>
                  <p className="text-xs font-bold text-emerald-800 uppercase tracking-wider">Ahorro Anual Neto Estimado</p>
                  <p className="text-[10px] text-emerald-600">Suponiendo 52 semanas de labor</p>
                </div>
                <p className="text-xl font-black text-emerald-900">${yearlySavings.toLocaleString('es-MX')} MXN</p>
              </div>
            </div>
          </div>

          <div className="bg-amber-50 border border-amber-200/60 rounded-xl p-3 text-xs text-amber-800 flex gap-2.5">
            <AlertTriangle className="w-5 h-5 shrink-0 text-amber-600" />
            <div>
              <p className="font-bold">Regla Importante</p>
              <p className="text-[11px] mt-0.5">El dinero del Fondo de Ahorro no se puede retirar antes de diciembre. Es una caja fuerte de ahorro forzoso que te ayuda a tener un gran aguinaldo.</p>
            </div>
          </div>
        </div>
      )}

      {/* 3. VALES DE DESPENSA */}
      {service.id === ServiceId.TarjetaDespensa && (
        <div className="space-y-4">
          <div className="bg-blue-600 rounded-2xl p-4 text-white">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-blue-100 text-xs font-medium uppercase tracking-wider">Tu Saldo Disponible</p>
                <p className="text-2xl font-extrabold mt-1">${user.despensaBalance.toLocaleString('es-MX')} MXN</p>
                <p className="text-blue-100 text-[10px] mt-1">Próximo depósito: Día 25 de este mes • Tarjeta: Toka Despensa</p>
              </div>
              <div className="bg-white/15 p-2 rounded-xl">
                <CreditCard className="w-6 h-6 text-white" />
              </div>
            </div>
          </div>

          {/* List of Accepted Stores */}
          <div className="bg-white rounded-2xl border border-slate-200/60 p-4">
            <h3 className="text-sm font-bold text-slate-800 mb-2.5">¿Dónde se acepta mi tarjeta?</h3>
            <div className="grid grid-cols-2 gap-2">
              {['Walmart', 'Soriana', 'Chedraui', 'Bodega Aurrerá', 'OXXO', 'Sams Club', 'Superama', 'Farmacias Guadalajara'].map((store, idx) => (
                <div key={idx} className="flex items-center gap-2 p-2 bg-slate-50 border border-slate-200/50 rounded-xl">
                  <div className="w-2 h-2 bg-emerald-500 rounded-full"></div>
                  <span className="text-xs font-medium text-slate-700">{store}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Report Loss Instruction */}
          <div className="bg-red-50 border border-red-100 rounded-xl p-4">
            <h4 className="text-xs font-bold text-red-800 uppercase tracking-wider flex items-center gap-1.5 mb-1">
              <AlertCircle className="w-4 h-4 text-red-600" />
              ¿Perdiste tu tarjeta de vales?
            </h4>
            <p className="text-[11px] text-red-700 leading-relaxed mb-3">
              No te preocupes, tu dinero está seguro. Sigue estos sencillos pasos para bloquearla y reponerla hoy mismo:
            </p>
            <div className="space-y-2 text-[11px] text-slate-700">
              <div className="flex gap-2">
                <span className="bg-red-100 text-red-800 font-bold rounded-full w-5 h-5 flex items-center justify-center shrink-0">1</span>
                <p>Llama al <strong>800-400-TOKA (8652)</strong> para bloquearla al instante.</p>
              </div>
              <div className="flex gap-2">
                <span className="bg-red-100 text-red-800 font-bold rounded-full w-5 h-5 flex items-center justify-center shrink-0">2</span>
                <p>Ten a la mano tu ID de empleado <strong>{user.employeeId}</strong> y tu NSS.</p>
              </div>
              <div className="flex gap-2">
                <span className="bg-red-100 text-red-800 font-bold rounded-full w-5 h-5 flex items-center justify-center shrink-0">3</span>
                <p>Acude a las oficinas de Recursos Humanos con tu supervisor por tu plástico de reemplazo (tarda 3 días hábiles).</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 4. VACACIONES */}
      {service.id === ServiceId.Vacaciones && (
        <div className="space-y-4">
          <div className="bg-blue-50 border border-blue-100 rounded-2xl p-4 flex justify-between items-center">
            <div>
              <p className="text-slate-500 text-[11px] font-semibold uppercase tracking-wider">Tus Vacaciones Disponibles</p>
              <p className="text-xl font-bold text-blue-700 mt-0.5">{user.vacationDaysAvailable} Días de Descanso</p>
              <p className="text-[10px] text-slate-400 mt-1">Cumpliendo tu primer aniversario en la empresa</p>
            </div>
            <div className="bg-white p-2.5 rounded-2xl border border-slate-100 shadow-xs">
              <CalendarDays className="w-6 h-6 text-blue-600" />
            </div>
          </div>

          {/* Interactive Law Table Selector */}
          <div className="bg-white rounded-2xl border border-slate-200/60 p-4">
            <h3 className="text-sm font-bold text-slate-800 mb-1">Consulta tus días de Vacaciones por Ley</h3>
            <p className="text-[11px] text-slate-500 mb-4">Selecciona cuántos años tienes en la empresa para ver tus días por ley:</p>

            <div className="flex justify-between gap-1.5 mb-4 overflow-x-auto pb-2">
              {[1, 2, 3, 4, 5, '6-10', '11-15'].map((year) => (
                <button
                  key={year.toString()}
                  onClick={() => setDailySalary(year === '6-10' ? 6 : year === '11-15' ? 11 : Number(year))}
                  className={`px-3 py-2 rounded-xl font-bold text-xs shrink-0 border transition-all ${
                    (dailySalary === year || (year === '6-10' && dailySalary === 6) || (year === '11-15' && dailySalary === 11))
                      ? 'bg-blue-600 text-white border-blue-600'
                      : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
                  }`}
                  style={{ minWidth: '45px' }}
                >
                  {year} {typeof year === 'number' ? 'año' : 'años'}
                </button>
              ))}
            </div>

            <div className="bg-slate-50 border border-slate-100 rounded-xl p-3 flex justify-between items-center">
              <span className="text-xs font-semibold text-slate-600">Días que te corresponden:</span>
              <span className="text-base font-extrabold text-blue-600">
                {dailySalary === 1 ? '12 días' : 
                 dailySalary === 2 ? '14 días' : 
                 dailySalary === 3 ? '16 días' : 
                 dailySalary === 4 ? '18 días' : 
                 dailySalary === 5 ? '20 días' : 
                 dailySalary === 6 ? '22 días' : '24 días'}
              </span>
            </div>
          </div>

          {/* Request Simulator Form */}
          <div className="bg-white rounded-2xl border border-slate-200/60 p-4">
            <h3 className="text-sm font-bold text-slate-800 mb-1 flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              Simular Solicitud de Vacaciones
            </h3>
            <p className="text-[11px] text-slate-500 mb-3">Revisa las fechas deseadas para ver si eres elegible hoy:</p>

            {vacRequested ? (
              <div className="bg-emerald-50 border border-emerald-100 p-3 rounded-xl text-center space-y-1.5 animate-fadeIn">
                <CheckCircle2 className="w-7 h-7 text-emerald-600 mx-auto" />
                <h4 className="text-xs font-bold text-emerald-900">¡Elegible y Pre-Aprobado!</h4>
                <p className="text-[10px] text-emerald-700">Se han guardado tus fechas preliminares para tu supervisor Héctor Ramírez.</p>
                <p className="text-[9px] text-slate-400 mt-2">Fechas: {vacStart} al {vacEnd}</p>
                <button 
                  onClick={() => setVacRequested(false)}
                  className="mt-2 text-[10px] text-blue-600 font-bold underline"
                >
                  Simular otra fecha
                </button>
              </div>
            ) : (
              <div className="space-y-3">
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="text-[10px] font-bold text-slate-500 block mb-1 uppercase">Fecha de Inicio</label>
                    <input 
                      type="date" 
                      value={vacStart}
                      onChange={(e) => setVacStart(e.target.value)}
                      className="w-full text-xs p-2 border border-slate-200 rounded-xl bg-slate-50 text-slate-700"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] font-bold text-slate-500 block mb-1 uppercase">Fecha de Fin</label>
                    <input 
                      type="date" 
                      value={vacEnd}
                      onChange={(e) => setVacEnd(e.target.value)}
                      className="w-full text-xs p-2 border border-slate-200 rounded-xl bg-slate-50 text-slate-700"
                    />
                  </div>
                </div>

                <button
                  onClick={() => {
                    if (vacStart && vacEnd) setVacRequested(true);
                  }}
                  disabled={!vacStart || !vacEnd}
                  className="w-full py-2.5 bg-blue-600 text-white font-bold rounded-xl text-xs hover:bg-blue-700 active:scale-98 transition-all disabled:opacity-50 disabled:pointer-events-none"
                  style={{ minHeight: '48px' }}
                >
                  Consultar Viabilidad de Fechas
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* 5. TRANSPORTE */}
      {service.id === ServiceId.Transporte && (
        <div className="space-y-4">
          <div className="bg-white rounded-2xl border border-slate-200/60 p-4">
            <h3 className="text-sm font-bold text-slate-800 mb-2">Selecciona tu Ruta de Transporte</h3>
            <div className="grid grid-cols-3 gap-1.5 mb-4">
              {[
                { id: 'norte', label: 'Ruta Norte' },
                { id: 'oriente', label: 'Ruta Oriente' },
                { id: 'poniente', label: 'Ruta Poniente' }
              ].map((route) => (
                <button
                  key={route.id}
                  onClick={() => setSelectedRoute(route.id as any)}
                  className={`py-2 px-1 rounded-xl text-center text-xs font-bold border transition-all ${
                    selectedRoute === route.id 
                      ? 'bg-blue-600 text-white border-blue-600' 
                      : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
                  }`}
                  style={{ minHeight: '48px' }}
                >
                  {route.label}
                </button>
              ))}
            </div>

            {/* Live Progress map representation */}
            <div className="bg-slate-50 rounded-xl p-3 border border-slate-100 mb-4">
              <div className="flex justify-between items-center mb-2">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Estatus del Autobús</span>
                <span className="bg-emerald-100 text-emerald-800 text-[9px] font-bold px-1.5 py-0.5 rounded-md flex items-center gap-1">
                  <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-ping"></span> En Ruta
                </span>
              </div>
              <p className="text-xs font-bold text-slate-800 mb-3 flex items-center gap-1">
                <Bus className="w-4 h-4 text-blue-600 shrink-0" />
                Unidad 14 • Próxima parada: <span className="text-blue-600">Plaza Sendero</span> en 8 minutos
              </p>
              
              {/* Vertical timeline of stops */}
              <div className="space-y-3 relative before:absolute before:bottom-2 before:top-2 before:left-2 before:w-0.5 before:bg-slate-200 pl-6">
                {selectedRoute === 'norte' && (
                  <>
                    <div className="relative">
                      <div className="absolute -left-5 top-1 w-2.5 h-2.5 rounded-full bg-blue-600"></div>
                      <p className="text-xs font-bold text-slate-700">05:10 AM - Farmacia Guadalajara (Inicio)</p>
                    </div>
                    <div className="relative">
                      <div className="absolute -left-5 top-1 w-2.5 h-2.5 rounded-full bg-blue-600"></div>
                      <p className="text-xs font-bold text-slate-700">05:25 AM - Plaza Sendero (Cruce)</p>
                    </div>
                    <div className="relative">
                      <div className="absolute -left-5 top-1 w-2.5 h-2.5 rounded-full bg-slate-300"></div>
                      <p className="text-xs font-medium text-slate-500">05:40 AM - Bodega Aurrerá Norte</p>
                    </div>
                    <div className="relative">
                      <div className="absolute -left-5 top-1 w-2.5 h-2.5 rounded-full bg-slate-300"></div>
                      <p className="text-xs font-medium text-slate-500">05:55 AM - Planta (Llegada Turno 1)</p>
                    </div>
                  </>
                )}
                {selectedRoute === 'oriente' && (
                  <>
                    <div className="relative">
                      <div className="absolute -left-5 top-1 w-2.5 h-2.5 rounded-full bg-blue-600"></div>
                      <p className="text-xs font-bold text-slate-700">05:00 AM - Iglesia San Juan (Modificada)</p>
                    </div>
                    <div className="relative">
                      <div className="absolute -left-5 top-1 w-2.5 h-2.5 rounded-full bg-amber-500"></div>
                      <p className="text-xs font-bold text-slate-700 flex items-center gap-1">
                        05:15 AM - OXXO GAS <span className="bg-amber-100 text-amber-800 text-[8px] px-1 rounded-sm">Temporal</span>
                      </p>
                    </div>
                    <div className="relative">
                      <div className="absolute -left-5 top-1 w-2.5 h-2.5 rounded-full bg-slate-300"></div>
                      <p className="text-xs font-medium text-slate-500">05:35 AM - Glorieta de Juárez</p>
                    </div>
                    <div className="relative">
                      <div className="absolute -left-5 top-1 w-2.5 h-2.5 rounded-full bg-slate-300"></div>
                      <p className="text-xs font-medium text-slate-500">05:55 AM - Planta (Llegada Turno 1)</p>
                    </div>
                  </>
                )}
                {selectedRoute === 'poniente' && (
                  <>
                    <div className="relative">
                      <div className="absolute -left-5 top-1 w-2.5 h-2.5 rounded-full bg-blue-600"></div>
                      <p className="text-xs font-bold text-slate-700">05:15 AM - Parque Central (Inicio)</p>
                    </div>
                    <div className="relative">
                      <div className="absolute -left-5 top-1 w-2.5 h-2.5 rounded-full bg-slate-300"></div>
                      <p className="text-xs font-medium text-slate-500">05:30 AM - Clínica 66 IMSS</p>
                    </div>
                    <div className="relative">
                      <div className="absolute -left-5 top-1 w-2.5 h-2.5 rounded-full bg-slate-300"></div>
                      <p className="text-xs font-medium text-slate-500">05:45 AM - Cruce Libramiento</p>
                    </div>
                    <div className="relative">
                      <div className="absolute -left-5 top-1 w-2.5 h-2.5 rounded-full bg-slate-300"></div>
                      <p className="text-xs font-medium text-slate-500">05:55 AM - Planta (Llegada Turno 1)</p>
                    </div>
                  </>
                )}
              </div>
            </div>

            {/* Support route click to call */}
            <a 
              href="tel:5512345678" 
              className="flex justify-between items-center p-3 border border-slate-200 hover:bg-slate-50 rounded-xl transition-all"
            >
              <div className="flex items-center gap-2.5 text-left">
                <div className="bg-blue-100 p-2 rounded-lg text-blue-600">
                  <Phone className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-slate-700">Coordinador de Logística</h4>
                  <p className="text-[10px] text-slate-400">¿Tienes dudas o se retrasó? Llama directo</p>
                </div>
              </div>
              <ExternalLink className="w-4 h-4 text-slate-400" />
            </a>
          </div>
        </div>
      )}

      {/* 6. UNIFORMES Y BOTAS */}
      {service.id === ServiceId.Uniformes && (
        <div className="space-y-4">
          <div className="bg-white rounded-2xl border border-slate-200/60 p-4">
            <h3 className="text-sm font-bold text-slate-800 mb-1">Tu Kit Inicial de Uniforme</h3>
            <p className="text-[11px] text-slate-500 mb-3">Se te entrega de manera gratuita al ingresar y se repone cada 6 meses:</p>

            <ul className="space-y-2 text-xs text-slate-600 mb-4">
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                <span>2 Playeras tipo polo industriales de alta durabilidad</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                <span>2 Pantalones de mezclilla de uso rudo</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                <span>1 Par de botas con casquillo de acero (marca Berrendo)</span>
              </li>
            </ul>

            <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2.5">Registrar / Modificar tus Tallas</h3>
            
            <div className="space-y-3">
              <div className="grid grid-cols-3 gap-2">
                <div>
                  <label className="text-[10px] font-bold text-slate-500 block mb-1">Playera</label>
                  <select 
                    value={shirtSize} 
                    onChange={(e) => setShirtSize(e.target.value)}
                    className="w-full text-xs p-2 border border-slate-200 rounded-xl bg-slate-50 text-slate-700"
                  >
                    <option value="CH">CH (Chica)</option>
                    <option value="M">M (Mediana)</option>
                    <option value="G">G (Grande)</option>
                    <option value="XG">XG (Extra Grande)</option>
                  </select>
                </div>
                <div>
                  <label className="text-[10px] font-bold text-slate-500 block mb-1">Pantalón</label>
                  <select 
                    value={pantsSize} 
                    onChange={(e) => setPantsSize(e.target.value)}
                    className="w-full text-xs p-2 border border-slate-200 rounded-xl bg-slate-50 text-slate-700"
                  >
                    <option value="28">28</option>
                    <option value="30">30</option>
                    <option value="32">32</option>
                    <option value="34">34</option>
                    <option value="36">36</option>
                    <option value="38">38</option>
                  </select>
                </div>
                <div>
                  <label className="text-[10px] font-bold text-slate-500 block mb-1">Calzado (MX)</label>
                  <select 
                    value={shoeSize} 
                    onChange={(e) => setShoeSize(e.target.value)}
                    className="w-full text-xs p-2 border border-slate-200 rounded-xl bg-slate-50 text-slate-700"
                  >
                    <option value="25">25.0</option>
                    <option value="26">26.0</option>
                    <option value="27">27.0</option>
                    <option value="28">28.0</option>
                    <option value="29">29.0</option>
                    <option value="30">30.0</option>
                  </select>
                </div>
              </div>

              {uniformRequested ? (
                <div className="bg-emerald-50 border border-emerald-100 p-3 rounded-xl text-center space-y-1.5 mt-2 animate-fadeIn">
                  <CheckCircle2 className="w-6 h-6 text-emerald-500 mx-auto" />
                  <p className="text-xs font-bold text-emerald-900">¡Tallas Guardadas Exitosamente!</p>
                  <p className="text-[10px] text-emerald-700">Pasa al Almacén General este jueves de 11:00 AM a 3:00 PM para recibir tu kit.</p>
                </div>
              ) : (
                <button
                  onClick={() => setUniformRequested(true)}
                  className="w-full py-2.5 bg-blue-600 text-white font-bold rounded-xl text-xs hover:bg-blue-700 active:scale-98 transition-all"
                  style={{ minHeight: '48px' }}
                >
                  Guardar Tallas y Generar Vale de Almacén
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* 7. SEGURIDAD (EPP) */}
      {service.id === ServiceId.Seguridad && (
        <div className="space-y-4">
          {/* EPP Interactive Checklist */}
          <div className="bg-white rounded-2xl border border-slate-200/60 p-4">
            <h3 className="text-sm font-bold text-slate-800 mb-1 flex items-center gap-1.5">
              <ShieldAlert className="w-4.5 h-4.5 text-blue-600 animate-pulse" />
              Checklist de Seguridad Diario (EPP)
            </h3>
            <p className="text-[11px] text-slate-500 mb-3">Asegúrate de portar todo tu equipo antes de cruzar la línea amarilla de planta:</p>

            <div className="space-y-2">
              {[
                { key: 'botas', label: 'Botas de casquillo de acero Berrendo' },
                { key: 'lentes', label: 'Lentes de protección transparentes' },
                { key: 'tapones', label: 'Tapones auditivos de espuma' },
                { key: 'chaleco', label: 'Chaleco de alta visibilidad reflejante' }
              ].map((item) => (
                <label 
                  key={item.key} 
                  className={`flex items-center gap-3 p-3 rounded-xl border transition-all cursor-pointer ${
                    (safetyChecklist as any)[item.key] 
                      ? 'bg-blue-50/50 border-blue-200 text-blue-900 font-semibold' 
                      : 'bg-slate-50 border-slate-200/50 text-slate-600 hover:bg-slate-100/50'
                  }`}
                  style={{ minHeight: '48px' }}
                >
                  <input 
                    type="checkbox"
                    checked={(safetyChecklist as any)[item.key]}
                    onChange={(e) => setSafetyChecklist(prev => ({ ...prev, [item.key]: e.target.checked }))}
                    className="w-4 h-4 text-blue-600 border-slate-300 rounded focus:ring-blue-500"
                  />
                  <span className="text-xs">{item.label}</span>
                </label>
              ))}
            </div>

            {Object.values(safetyChecklist).every(val => val) && (
              <div className="mt-3 p-3 bg-emerald-50 border border-emerald-100 rounded-xl text-center text-xs text-emerald-800 font-bold animate-fadeIn">
                👍 ¡Excelente! Estás 100% protegido para ingresar seguro a tu turno.
              </div>
            )}
          </div>

          {/* Report Risk Form */}
          <div className="bg-white rounded-2xl border border-slate-200/60 p-4">
            <h3 className="text-sm font-bold text-slate-800 mb-1 flex items-center gap-1.5">
              <AlertTriangle className="w-4 h-4 text-amber-500" />
              Reportar Acto o Condición Insegura
            </h3>
            <p className="text-[11px] text-slate-500 mb-3">Si ves un riesgo, avísanos de inmediato de forma anónima para arreglarlo:</p>

            {hazardReported ? (
              <div className="bg-amber-50 border border-amber-100 p-3 rounded-xl text-center space-y-1.5 animate-fadeIn">
                <CheckCircle2 className="w-6 h-6 text-amber-500 mx-auto" />
                <p className="text-xs font-bold text-amber-900">¡Reporte Enviado con Éxito!</p>
                <p className="text-[10px] text-amber-700">El Ing. de Seguridad e Higiene acudirá al área para verificar el reporte de inmediato.</p>
                <button 
                  onClick={() => {
                    setHazardLocation('');
                    setHazardDesc('');
                    setHazardReported(false);
                  }}
                  className="mt-2 text-[10px] text-blue-600 font-bold underline"
                >
                  Reportar otro riesgo
                </button>
              </div>
            ) : (
              <div className="space-y-3">
                <div>
                  <label className="text-[10px] font-bold text-slate-500 block mb-1 uppercase">¿En qué área de la planta está?</label>
                  <input 
                    id="input-hazard-location"
                    type="text" 
                    placeholder="Ej. Pasillo principal de Línea 3"
                    value={hazardLocation}
                    onChange={(e) => setHazardLocation(e.target.value)}
                    className="w-full text-xs p-2.5 border border-slate-200 rounded-xl bg-slate-50 text-slate-700"
                  />
                </div>
                <div>
                  <label className="text-[10px] font-bold text-slate-500 block mb-1 uppercase">Describe el riesgo brevemente</label>
                  <textarea 
                    id="textarea-hazard-desc"
                    placeholder="Ej. Hay agua tirada en el suelo y peligro de resbalar."
                    rows={2}
                    value={hazardDesc}
                    onChange={(e) => setHazardDesc(e.target.value)}
                    className="w-full text-xs p-2.5 border border-slate-200 rounded-xl bg-slate-50 text-slate-700 resize-none"
                  />
                </div>

                <button
                  onClick={() => {
                    if (hazardLocation && hazardDesc) setHazardReported(true);
                  }}
                  disabled={!hazardLocation || !hazardDesc}
                  className="w-full py-2.5 bg-amber-600 text-white font-bold rounded-xl text-xs hover:bg-amber-700 active:scale-98 transition-all disabled:opacity-50 disabled:pointer-events-none"
                  style={{ minHeight: '48px' }}
                >
                  Enviar Reporte Urgente a Seguridad
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* 8. PREGUNTAS FRECUENTES (FAQs) */}
      {service.id === ServiceId.PreguntasFrecuentes && (
        <div className="space-y-3">
          <p className="text-xs text-slate-400 font-medium px-1 uppercase tracking-wider">Respuestas inmediatas a dudas usuales</p>
          <FAQAccordion items={faqsData} />
        </div>
      )}

      {/* 9. CONTACTAR RRHH / CHATBOT */}
      {service.id === ServiceId.ContactarRRHH && (
        <div className="space-y-4">
          <div className="bg-blue-50 border border-blue-100 rounded-2xl p-4 flex gap-3">
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
          <div className="bg-white border border-slate-200/60 rounded-2xl p-4">
            <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider mb-3">Oficina de Recursos Humanos</h3>
            <div className="space-y-3">
              <a 
                href="https://wa.me/525512345678" 
                target="_blank" 
                rel="noreferrer"
                className="flex items-center justify-between p-2.5 bg-emerald-50 hover:bg-emerald-100/50 border border-emerald-200/50 rounded-xl transition-all"
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
      )}

      {/* RENDER GENERIC SYSTEM FAQS IF SERVICE IS NOT DETAILED ABOVE */}
      {![ServiceId.Nomina, ServiceId.FondoAhorro, ServiceId.TarjetaDespensa, ServiceId.Vacaciones, ServiceId.Transporte, ServiceId.Uniformes, ServiceId.Seguridad, ServiceId.PreguntasFrecuentes, ServiceId.ContactarRRHH].includes(service.id) && (
        <div className="bg-white border border-slate-200/60 rounded-2xl p-4">
          <p className="text-xs text-slate-500 mb-4 leading-relaxed font-semibold">{service.shortDesc}</p>
          <div className="border-t border-slate-100 pt-3.5 mt-3.5">
            <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-wider mb-2">Preguntas Frecuentes Relacionadas</h4>
            {serviceFaqs.length > 0 ? (
              <FAQAccordion items={serviceFaqs} variant="simple" />
            ) : (
              <p className="text-xs text-slate-400 italic">No hay preguntas registradas aún para este tema.</p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
