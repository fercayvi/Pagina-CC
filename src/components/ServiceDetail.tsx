import React, { useState } from 'react';
import { 
  ChevronLeft, FileText, CheckCircle2, Clock, MapPin, Phone, 
  HelpCircle, ShieldCheck, AlertCircle, Calendar, CreditCard, 
  Bus, Shirt, ShieldAlert, Coins, Home, Building2, UserCheck
} from 'lucide-react';
import { ServiceId, Service, UserProfile, FAQ } from '../types';
import { faqsData } from '../data';

function FAQAccordion({ items }: { items: FAQ[] }) {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const toggle = (idx: number) => {
    setOpenIndex(openIndex === idx ? null : idx);
  };

  if (!items || items.length === 0) {
    return (
      <p className="text-xs text-slate-400 italic p-3 bg-slate-50 rounded-xl border border-slate-200">
        No hay preguntas registradas aún para este trámite.
      </p>
    );
  }

  return (
    <div className="space-y-2">
      {items.map((faq, idx) => {
        const isOpen = openIndex === idx;
        return (
          <div key={idx} className="bg-white border border-slate-200 rounded-xl overflow-hidden transition-all">
            <button
              onClick={() => toggle(idx)}
              className="w-full text-left p-3.5 flex gap-3 items-center justify-between hover:bg-slate-50 transition-colors focus:outline-none"
            >
              <div className="text-xs font-bold text-slate-800 flex gap-2 items-start flex-1 pr-2">
                <span className={`text-[10px] font-extrabold rounded-md px-1.5 py-0.5 shrink-0 transition-colors ${
                  isOpen ? 'bg-slate-900 text-white' : 'bg-slate-100 text-slate-600'
                }`}>FAQ</span>
                <span className="mt-0.5 leading-snug">{faq.question}</span>
              </div>
              <span className={`text-slate-400 transition-transform duration-200 text-xs font-bold ${
                isOpen ? 'rotate-180 text-blue-600' : ''
              }`}>
                ▼
              </span>
            </button>
            
            {isOpen && (
              <div className="px-4 pb-3.5 text-xs text-slate-600 leading-relaxed border-t border-slate-100 bg-slate-50/60 animate-fadeIn pt-3">
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
  user?: UserProfile;
  onBack: () => void;
}

export default function ServiceDetail({ service, user, onBack }: ServiceDetailProps) {
  // Get FAQs for this service or general
  const serviceFaqs = faqsData.filter(f => f.category === service.id);

  // Helper for rendering realistic structured procedural instructions for each service
  const renderInstructions = () => {
    switch (service.id) {
      case ServiceId.PoliticasPago:
        return {
          steps: [
            { num: 1, title: 'Calendario Semanal de Pago', desc: 'El depósito se efectúa todos los viernes antes de las 09:00 AM. Si el viernes es día inhábil, el pago se adelanta al jueves.' },
            { num: 2, title: 'Corte de Horas y Asistencia', desc: 'El periodo de nómina abarca de Lunes a Domingo. Las horas extra y bonos de la semana previa se calculan en el pago del viernes.' },
            { num: 3, title: 'Conceptos y Percepciones', desc: 'Tu nómina integra Sueldo Base, Horas Extraordinarias, Prima Dominical, Bono de Puntualidad y Vales de Despensa mensual.' },
            { num: 4, title: 'Deducciones Oficiales', desc: 'Se aplican únicamente las retenciones de ley (ISR, IMSS), crédito Infonavit (de existir) y aportación voluntaria a la Caja de Ahorro.' }
          ],
          requirements: ['Gafete oficial activo', 'Cuenta Bancaria de Nómina a tu nombre (BBVA / Santander)'],
          schedule: 'Depósito semanal cada Viernes a las 09:00 AM',
          contact: 'Atención a Nóminas - Ext. 201'
        };

      case ServiceId.RecibosCIF:
        return {
          steps: [
            { num: 1, title: 'Generación Digital Semanal', desc: 'Cada semana se emite tu comprobante fiscal digital de nómina (CFDI / CIF) conforme a la normativa del SAT.' },
            { num: 2, title: 'Envío por Correo Electrónico', desc: 'Recibes tus archivos XML y PDF directamente en la cuenta de correo institucional registrada.' },
            { num: 3, title: 'Solicitud de Impresión Física', desc: 'Si requieres tus recibos impresos sellados para trámites de crédito personal o vivienda, acude a la ventanilla de RH.' },
            { num: 4, title: 'Verificación del Timbrado CIF', desc: 'Puedes validar la autenticidad del timbre fiscal escaneando el código QR del recibo con la app oficial del SAT.' }
          ],
          requirements: ['RFC activo con Homoclave', 'Correo electrónico registrado', 'Identificación INE para impresión física'],
          schedule: 'Atención en Ventanilla: Lunes a Viernes de 8:00 AM a 5:00 PM',
          contact: 'Oficina de Timbrado y Recibos - Ext. 202'
        };

      case ServiceId.AclaracionPago:
        return {
          steps: [
            { num: 1, title: 'Identificación de Diferencia', desc: 'Revisa tu recibo impreso o digital e identifica el concepto a aclarar (horas extra, faltas, bonos o retenciones).' },
            { num: 2, title: 'Validación con Supervisor de Línea', desc: 'Verifica con el supervisor de tu turno el registro de horas trabajadas en las bitácoras de asistencia.' },
            { num: 3, title: 'Atención en Talento y Cultura', desc: 'Presenta tu solicitud en la ventanilla de Talento y Cultura los días martes y jueves de 2:00 PM a 4:00 PM.' },
            { num: 4, title: 'Resolución y Ajuste Retroactivo', desc: 'Si la aclaración procede, el ajuste retroactivo se depositará en el siguiente recibo de nómina del viernes.' }
          ],
          requirements: ['Recibo de nómina de la semana a aclarar', 'Lista de asistencia avalada por supervisor', 'Plazo máximo de 5 días hábiles'],
          schedule: 'Martes y Jueves de 2:00 PM a 4:00 PM',
          contact: 'Mesa de Talento y Cultura - Ext. 202'
        };

      case ServiceId.ValesTarjetaNomina:
        return {
          steps: [
            { num: 1, title: 'Dispersión de Vales Toka', desc: 'El saldo de la tarjeta de vales de despensa se deposita el día 25 de cada mes. Consulta tu saldo al 800-400-8652.' },
            { num: 2, title: 'Reporte Inmediato por Robo/Extravío', desc: 'Si perdiste la tarjeta, llama de inmediato al 800-400-8652 para el bloqueo del plástico y obtención de folio.' },
            { num: 3, title: 'Solicitud de Reposición', desc: 'Acude a Recursos Humanos con tu folio de bloqueo para tramitar la expedición del nuevo plástico.' },
            { num: 4, title: 'Entrega y Activación de Plástico', desc: 'Recoge tu nuevo plástico en RH en un lapso de 3 a 5 días hábiles y actívalo desde la app móvil o por teléfono.' }
          ],
          requirements: ['Folio de bloqueo telefónico oficial', 'Gafete de empleado', 'Identificación oficial INE'],
          schedule: 'Atención en Ventanilla: Lunes a Viernes de 8:00 AM a 5:00 PM',
          contact: 'Atención a Vales y Nómina - Ext. 204'
        };

      case ServiceId.CajaAhorro:
        return {
          steps: [
            { num: 1, title: 'Definición de Porcentaje de Ahorro', desc: 'Elige ahorrar libremente entre el 2% y el 10% de tu sueldo base semanal mediante descuento de nómina.' },
            { num: 2, title: 'Firma de Formato de Autorización', desc: 'Presenta tu solicitud de inscripción en la oficina de Recursos Humanos durante las ventanas de Enero o Julio.' },
            { num: 3, title: 'Solicitud de Préstamos Informativos', desc: 'Al cumplir 1 año de antigüedad puedes solicitar préstamos con tasa preferencial calculados sobre tu capacidad de pago.' },
            { num: 4, title: 'Entrega Anual de Rendimientos', desc: 'El fondo total acumulado junto con los intereses generados se liquida en el mes de Diciembre.' }
          ],
          requirements: ['Antigüedad mínima de 3 meses (Ahorro) / 1 año (Préstamo)', 'Formato de autorización firmado'],
          schedule: 'Lunes a Viernes de 8:00 AM a 5:00 PM',
          contact: 'Comité de Caja de Ahorro - Ext. 205'
        };

      case ServiceId.Infonavit:
        return {
          steps: [
            { num: 1, title: 'Descarga de Aviso de Retención', desc: 'Ingresa al portal "Mi Cuenta Infonavit" y descarga tu Aviso de Retención de Descuentos vigente.' },
            { num: 2, title: 'Entrega de Documento Original', desc: 'Entrega el documento impreso original en la ventanilla de Recursos Humanos de Lunes a Viernes de 9:00 AM a 2:00 PM.' },
            { num: 3, title: 'Cálculo de Deducción Semanal', desc: 'Nóminas programará el descuento exacto en estricto apego al Factor de Descuento (FD) o cuota fija determinada.' },
            { num: 4, title: 'Reflejo en Recibo de Pago', desc: 'La retención comenzará a reflejarse en la nómina inmediata posterior a la entrega oficial del aviso.' }
          ],
          requirements: ['Aviso de Retención impreso original vigente', 'Número de Crédito Infonavit (10 dígitos)', 'NSS y RFC'],
          schedule: 'Recepción: Lunes a Viernes de 9:00 AM a 2:00 PM',
          contact: 'Ventanilla Infonavit - Ext. 202'
        };

      case ServiceId.Vacaciones:
        return {
          steps: [
            { num: 1, title: 'Consulta de Días Disponibles', desc: 'Revisa tus días correspondientes según tu antigüedad cumplida (12 días en el 1er año conforme a la LFT).' },
            { num: 2, title: 'Programación de Días Flex & Home Week', desc: 'Si eres personal administrativo elegible, acuerda los Días Flex o esquema Home Week con tu jefe directo.' },
            { num: 3, title: 'Coordinación con Supervisor', desc: 'Presenta la propuesta de fechas con al menos 15 días de anticipación para asegurar la cobertura operativa.' },
            { num: 4, title: 'Firma de Papeleta Oficial', desc: 'Acude a Recursos Humanos a firmar la Papeleta Oficial de Vacaciones para el registro formal en sistema.' }
          ],
          requirements: ['Solicitud realizada con 15 días de anticipación', 'Autorización firmada del supervisor de línea'],
          schedule: 'Lunes a Viernes de 8:00 AM a 5:00 PM',
          contact: 'Coordinación de Personal - Ext. 201'
        };

      case ServiceId.Incapacidades:
        return {
          steps: [
            { num: 1, title: 'Aviso Inmediato a Planta', desc: 'Notifica a tu supervisor y envía foto clara del certificado IMSS al WhatsApp de RH (+52 55 1234 5678) en las primeras 12 horas.' },
            { num: 2, title: 'Validación en Servicio Médico', desc: 'El área médica de planta registra el tipo de incapacidad (Enfermedad General, Maternidad o Riesgo de Trabajo).' },
            { num: 3, title: 'Entrega de Certificado en Papel', desc: 'Al reincorporarte a tu turno, entrega el certificado original en papel (Copia Patrón) en la ventanilla de Medicina del Trabajo.' },
            { num: 4, title: 'Pago y Justificación', desc: 'Medicina del Trabajo justifica las faltas en el reloj checador. El IMSS efectúa el pago según la ley vigente.' }
          ],
          requirements: ['Certificado de Incapacidad del IMSS impreso original (Copia Patrón)', 'Aviso oportuno antes del turno'],
          schedule: 'Atención WhatsApp 24/7 • Servicio Médico L-S de 6:00 AM a 10:00 PM',
          contact: 'Servicio Médico de Planta - Ext. 105'
        };

      case ServiceId.RelojChecador:
        return {
          steps: [
            { num: 1, title: 'Uso de Lectores Biométricos', desc: 'Checa tu entrada y salida colocando tu huella o rostro firmemente en las estaciones de lectura en accesos de planta.' },
            { num: 2, title: 'Procedimiento por Omisión de Chequeo', desc: 'Si olvidaste checar, solicita a tu supervisor el Formato de Corrección de Omisión de Marcaje de forma inmediata.' },
            { num: 3, title: 'Firma y Justificación del Supervisor', desc: 'Indica la hora exacta y turno. El supervisor de línea debe firmar el formato acreditando tu presencia física.' },
            { num: 4, title: 'Aclaración de Asistencia en RH', desc: 'Entrega la papeleta en RH antes del martes a las 12:00 PM para evitar afectaciones en tu pago semanal.' }
          ],
          requirements: ['Formato de Corrección con firma autógrafa de supervisor', 'Entrega antes del martes 12:00 PM'],
          schedule: 'Lunes a Viernes de 8:00 AM a 5:00 PM',
          contact: 'Control de Asistencia - Ext. 203'
        };

      default:
        return {
          steps: [
            { num: 1, title: 'Consulta de Información', desc: 'Revisa las preguntas frecuentes abajo para conocer los requisitos de este trámite.' },
            { num: 2, title: 'Acudir a Recursos Humanos', desc: 'Visita la oficina de Recursos Humanos con tu gafete de empleado para atención personalizada.' },
            { num: 3, title: 'Seguimiento', desc: 'Da seguimiento a tu solicitud con el encargado del área de Recursos Humanos.' }
          ],
          requirements: ['Gafete de empleado activo'],
          schedule: 'Lunes a Viernes de 8:00 AM a 5:00 PM',
          contact: 'Recursos Humanos - Ext. 200'
        };
    }
  };

  const info = renderInstructions();

  return (
    <div id={`service-detail-${service.id}`} className="space-y-4 pb-20 animate-fadeIn">
      {/* Header Bar */}
      <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-2xs">
        <div className="flex items-center gap-3">
          <button 
            id="btn-back-to-grid"
            onClick={onBack}
            className="w-9 h-9 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 flex items-center justify-center active:scale-95 transition-all shrink-0 border border-slate-200"
            aria-label="Volver al catálogo"
          >
            <ChevronLeft className="w-5 h-5" strokeWidth={2.5} />
          </button>
          <div>
            <span className="text-[10px] font-bold text-blue-700 bg-blue-50 px-2 py-0.5 rounded-md uppercase tracking-wide">
              Instrucciones y Trámite
            </span>
            <h2 className="text-base font-bold text-slate-900 mt-0.5 font-display">{service.title}</h2>
          </div>
        </div>
        <p className="text-xs text-slate-500 font-medium mt-2.5 leading-relaxed pl-1">
          {service.shortDesc}
        </p>
      </div>

      {/* Procedimiento Paso a Paso */}
      <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-2xs">
        <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-3 flex items-center gap-1.5 border-b border-slate-100 pb-2">
          <FileText className="w-4 h-4 text-blue-600" />
          Procedimiento Oficial Paso a Paso
        </h3>

        <div className="space-y-3">
          {info.steps.map((step) => (
            <div key={step.num} className="flex gap-3 items-start bg-slate-50/80 p-3 rounded-xl border border-slate-200/60">
              <span className="w-6 h-6 rounded-lg bg-slate-900 text-white font-extrabold text-xs flex items-center justify-center shrink-0 mt-0.5">
                {step.num}
              </span>
              <div>
                <h4 className="text-xs font-bold text-slate-900">{step.title}</h4>
                <p className="text-[11px] text-slate-600 mt-0.5 leading-relaxed">{step.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Requisitos y Horarios */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {/* Requisitos Obligatorios */}
        <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-2xs">
          <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-2.5 flex items-center gap-1.5">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            Requisitos Necesarios
          </h3>
          <ul className="space-y-2">
            {info.requirements.map((req, idx) => (
              <li key={idx} className="flex items-start gap-2 text-xs text-slate-700">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 mt-1.5 shrink-0"></span>
                <span>{req}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Horario y Ventanilla */}
        <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-2xs">
          <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-2.5 flex items-center gap-1.5">
            <Clock className="w-4 h-4 text-blue-600" />
            Atención y Ubicación
          </h3>
          <div className="space-y-2 text-xs text-slate-700">
            <div className="flex items-center gap-2">
              <MapPin className="w-4 h-4 text-slate-400 shrink-0" />
              <span>Planta Baja • Edificio de Recursos Humanos</span>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-slate-400 shrink-0" />
              <span>{info.schedule}</span>
            </div>
            <div className="flex items-center gap-2">
              <Phone className="w-4 h-4 text-slate-400 shrink-0" />
              <span className="font-semibold text-blue-700">{info.contact}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Sección de Preguntas Frecuentes (FAQs) */}
      <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-2xs">
        <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-3 flex items-center gap-1.5 border-b border-slate-100 pb-2">
          <HelpCircle className="w-4 h-4 text-blue-600" />
          Preguntas Frecuentes Relacionadas
        </h3>
        <FAQAccordion items={serviceFaqs.length > 0 ? serviceFaqs : faqsData.filter(f => f.category === 'general')} />
      </div>
    </div>
  );
}
