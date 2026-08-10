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
      case ServiceId.Nomina:
        return {
          steps: [
            { num: 1, title: 'Presentarse en Ventanilla', desc: 'Acude a la oficina de Recursos Humanos (Planta Baja, junto a Comedor) portando tu gafete oficial de empleado.' },
            { num: 2, title: 'Verificación de Identidad', desc: 'Muestra tu credencial del INE vigente para la validación de cuenta o solicitud de estado de cuenta bancario.' },
            { num: 3, title: 'Firma de Documentos', desc: 'En caso de cambio de cuenta CLABE o apertura de cuenta nómina (BBVA / Santander), firma el formato de domiciliación bancaria.' },
            { num: 4, title: 'Activación del Depósito', desc: 'El cambio quedará activo para el siguiente ciclo de nómina semanal (depósito los viernes).' }
          ],
          requirements: ['Gafete de empleado activo', 'INE original y copia', 'Estado de cuenta con CLABE (si es cuenta propia)'],
          schedule: 'Lunes a Viernes de 8:00 AM a 5:00 PM',
          contact: 'Oficina de Nóminas - Ext. 201'
        };

      case ServiceId.TarjetaDespensa:
        return {
          steps: [
            { num: 1, title: 'Consulta de Saldo', desc: 'El depósito se realiza automáticamente el día 25 de cada mes en tu tarjeta Toka Despensa. Puedes consultar tu saldo llamando al 800-400-8652.' },
            { num: 2, title: 'Reporte por Pérdida o Extravío', desc: 'Si perdiste la tarjeta, marca inmediatamente al 800-400-8652 para solicitar el bloqueo preventivo del plástico.' },
            { num: 3, title: 'Solicitud de Reposición', desc: 'Acude a Recursos Humanos con el folio de bloqueo proporcionado por el banco para solicitar el nuevo plástico.' },
            { num: 4, title: 'Entrega de Plástico', desc: 'La entrega del nuevo plástico toma de 3 a 5 días hábiles en la ventanilla de Recursos Humanos.' }
          ],
          requirements: ['Folio de bloqueo telefónico de Toka', 'Gafete de empleado', 'Número de NSS y RFC'],
          schedule: 'Lunes a Viernes de 8:00 AM a 5:00 PM',
          contact: 'Atención a Vales - Ext. 204'
        };

      case ServiceId.RelojChecador:
        return {
          steps: [
            { num: 1, title: 'Solicitar Formato de Corrección', desc: 'Pide a tu supervisor de turno (Ing. Héctor Ramírez) el "Formato de Corrección de Omisión de Marcaje".' },
            { num: 2, title: 'Llenado y Firma del Supervisor', desc: 'Indica la fecha, turno y hora exacta de entrada/salida. El supervisor debe firmar en señal de conformidad de tu asistencia.' },
            { num: 3, title: 'Entrega en Recursos Humanos', desc: 'Entrega el formato físico firmado en la ventanilla de RH antes del martes a las 12:00 PM.' },
            { num: 4, title: 'Ajuste en Sistema', desc: 'El área de nóminas registrará la asistencia para que se calcule en el pago del viernes.' }
          ],
          requirements: ['Formato de Corrección con firma autógrafa del supervisor', 'Aclaración antes del martes de cada semana'],
          schedule: 'Lunes a Viernes de 8:00 AM a 5:00 PM',
          contact: 'Control de Asistencia - Ext. 203'
        };

      case ServiceId.AclaracionPago:
        return {
          steps: [
            { num: 1, title: 'Revisión de Recibo de Nómina', desc: 'Identifica el concepto con diferencia (horas extra, premio de puntualidad, faltas injustificadas o deducciones).' },
            { num: 2, title: 'Validación con Supervisor', desc: 'Confirma con el Ing. Héctor Ramírez el registro de horas trabajadas y lista de asistencia de la semana anterior.' },
            { num: 3, title: 'Atención en Ventanilla de Nómina', desc: 'Acude a la ventanilla los días martes o jueves de 2:00 PM a 4:00 PM con tu recibo de nómina impreso.' },
            { num: 4, title: 'Ajuste Retroactivo', desc: 'Si la aclaración procede, el ajuste se aplicará en el depósito del viernes posterior.' }
          ],
          requirements: ['Recibo de nómina de la semana a aclarar', 'Lista de asistencia avalada por el supervisor', 'Identificación de empleado'],
          schedule: 'Martes y Jueves de 2:00 PM a 4:00 PM',
          contact: 'Mesa de Aclaraciones - Ext. 202'
        };

      case ServiceId.CajaAhorro:
        return {
          steps: [
            { num: 1, title: 'Elección de Porcentaje', desc: 'Puedes aportar entre el 2% y el 10% de tu sueldo base semanal a la Caja de Ahorro de la empresa.' },
            { num: 2, title: 'Formato de Autorización', desc: 'Llena y firma la Solicitud de Descuento por Nómina en la oficina de Recursos Humanos.' },
            { num: 3, title: 'Fechas de Inscripción', desc: 'El registro y cambio de montos se realiza en las ventanas anuales de Enero y Julio.' },
            { num: 4, title: 'Entrega de Rendimientos', desc: 'El fondo acumulado más los intereses generados se entregan en el mes de Diciembre.' }
          ],
          requirements: ['Antigüedad mínima de 3 meses en la planta', 'Formato de inscripción firmado'],
          schedule: 'Lunes a Viernes de 8:00 AM a 5:00 PM',
          contact: 'Comité de Caja de Ahorro - Ext. 205'
        };

      case ServiceId.Vacaciones:
        return {
          steps: [
            { num: 1, title: 'Verificación de Días Disponibles', desc: 'Los días de vacaciones se determinan según tu antigüedad conforme a la Ley Federal del Trabajo (12 días en el primer año).' },
            { num: 2, title: 'Acuerdo de Fechas con Supervisor', desc: 'Presenta tu propuesta de fechas al supervisor de tu línea con al menos 15 días de anticipación.' },
            { num: 3, title: 'Firma de Papeleta Oficial', desc: 'Acude a Recursos Humanos a imprimir y firmar la Papeleta Oficial de Vacaciones.' },
            { num: 4, title: 'Goce de Descanso', desc: 'Una vez autorizada, las fechas quedan programadas en el sistema de asistencia sin afectación a bonos.' }
          ],
          requirements: ['Solicitud realizada con 15 días de anticipación', 'Autorización por escrito del supervisor de línea'],
          schedule: 'Lunes a Viernes de 8:00 AM a 5:00 PM',
          contact: 'Coordinación de Personal - Ext. 201'
        };

      case ServiceId.Infonavit:
        return {
          steps: [
            { num: 1, title: 'Obtención de Aviso de Retención', desc: 'Descarga tu "Aviso de Retención de Descuentos para Modificación o Suspensión" desde el portal Mi Cuenta Infonavit.' },
            { num: 2, title: 'Entrega en Nóminas', desc: 'Entrega el documento impreso original en la ventanilla de Recursos Humanos.' },
            { num: 3, title: 'Cálculo de Descuento Semanal', desc: 'Nóminas calculará la deducción semanal conforme al Factor de Descuento o cuota fija determinada por Infonavit.' },
            { num: 4, title: 'Aplicación en Recibo', desc: 'El descuento se reflejará a partir de la nómina inmediata posterior a la entrega del aviso.' }
          ],
          requirements: ['Aviso de Retención original vigente', 'Número de Crédito Infonavit (10 dígitos)', 'NSS y RFC'],
          schedule: 'Lunes a Viernes de 9:00 AM a 2:00 PM',
          contact: 'Ventanilla Infonavit / Nóminas - Ext. 202'
        };

      case ServiceId.Incapacidades:
        return {
          steps: [
            { num: 1, title: 'Aviso Inmediato al Supervisor', desc: 'Notifica a tu supervisor directo e informa a RH dentro de las primeras 12 horas de haber recibido atención médica.' },
            { num: 2, title: 'Envío de Copia Digital', desc: 'Envía una foto clara y legible del documento expedido por el IMSS al WhatsApp oficial de Recursos Humanos (+52 55 1234 5678).' },
            { num: 3, title: 'Entrega del Documento Físico', desc: 'Al reincorporarte a tus labores, entrega el certificado original en papel (copia patronal) en el Módulo de Medicina del Trabajo.' },
            { num: 4, title: 'Registro y Justificación', desc: 'Medicina del Trabajo validará el documento para justificar las ausencias en el reloj checador.' }
          ],
          requirements: ['Certificado de Incapacidad del IMSS original (Copia Patrón)', 'Notificación oportuna antes de inicio de turno'],
          schedule: 'Atención WhatsApp 24/7 • Servicio Médico L-S de 6:00 AM a 10:00 PM',
          contact: 'Servicio Médico de Planta - Ext. 105'
        };

      case ServiceId.Prestamos:
        return {
          steps: [
            { num: 1, title: 'Verificación de Elegibilidad', desc: 'Requiere antigüedad mínima de 1 año ininterrumpido en la planta y no tener préstamos activos vigentes.' },
            { num: 2, title: 'Solicitud de Formato', desc: 'Solicita el Formato de Préstamo a Colaboradores en la ventanilla de Recursos Humanos.' },
            { num: 3, title: 'Evaluación de Comité', desc: 'El Comité evalúa la capacidad de pago semanal (el descuento no debe superar el 30% del sueldo base).' },
            { num: 4, title: 'Dispersión de Fondos', desc: 'De ser autorizado, el monto se deposita en tu tarjeta de nómina el viernes siguiente.' }
          ],
          requirements: ['Antigüedad mínima de 1 año', 'Comprobante de domicilio reciente', 'Identificación oficial INE'],
          schedule: 'Recepción de solicitudes: Lunes y Miércoles de 9:00 AM a 1:00 PM',
          contact: 'Atención a Fondo Social - Ext. 206'
        };

      case ServiceId.Transporte:
        return {
          steps: [
            { num: 1, title: 'Ubicación de Parada Autorizada', desc: 'Identifica la ruta que corresponde a tu zona (Norte, Oriente o Poniente) y la parada más cercana a tu domicilio.' },
            { num: 2, title: 'Abordaje de Unidad', desc: 'Preséntate en la parada 5 minutos antes del horario indicado portando tu gafete visible de empleado.' },
            { num: 3, title: 'Registro de Retrasos en Ruta', desc: 'Si la unidad oficial sufre una falla o demora por tráfico, la llegada a planta se registra como falta justificada sin penalización.' },
            { num: 4, title: 'Reportes y Sugerencias', desc: 'Cualquier anomalía con las unidades o choferes repórtala directo a la coordinación de logística.' }
          ],
          requirements: ['Gafete oficial visible', 'Llegar 5 minutos antes a la parada'],
          schedule: 'Turno 1: Llegada a Planta 05:55 AM • Salida 02:15 PM',
          contact: 'Coordinación de Transporte - Ext. 310'
        };

      case ServiceId.Uniformes:
        return {
          steps: [
            { num: 1, title: 'Entrega de Kit Inicial', desc: 'Al ingresar recibes 2 playeras polo, 2 pantalones industriales y 1 par de botas Berrendo con casquillo.' },
            { num: 2, title: 'Renovación Programada', desc: 'Cada 6 meses se realiza la entrega masiva de reposición sin costo en el Almacén General.' },
            { num: 3, title: 'Reposición por Daño Operativo', desc: 'Si tu uniforme o calzado se daña en turno, pide a tu supervisor el Vale de Reposición Extraordinaria.' },
            { num: 4, title: 'Canje en Almacén', desc: 'Presenta el vale firmado en Almacén General los días jueves de 11:00 AM a 3:00 PM.' }
          ],
          requirements: ['Gafete de empleado', 'Vale de reposición firmado por supervisor (si es extraordinario)'],
          schedule: 'Atención en Almacén: Jueves de 11:00 AM a 3:00 PM',
          contact: 'Almacén General - Ext. 112'
        };

      case ServiceId.Seguridad:
        return {
          steps: [
            { num: 1, title: 'Portación de EPP Completo', desc: 'Es obligatorio usar botas de casquillo, lentes de seguridad, tapones auditivos y chaleco reflejante en todo momento.' },
            { num: 2, title: 'Cambio de EPP Desgastado', desc: 'Solicita el cambio de lentes rayados o tapones dañados sin costo en el Módulo de Seguridad.' },
            { num: 3, title: 'Reporte de Condición Insegura', desc: 'Si detectas fugas, cables expuestos o tarimas mal apiladas, avisa inmediatamente a tu brigadista de área.' },
            { num: 4, title: 'Atención de Incidentes', desc: 'Ante cualquier lesión por mínima que sea, acude de inmediato a Medicina del Trabajo.' }
          ],
          requirements: ['Uso obligatorio de EPP en área de manufactura', 'Respeto a líneas amarillas peatonales'],
          schedule: 'Atención 24 Horas en Módulo de Seguridad',
          contact: 'Departamento de Seguridad e Higiene - Ext. 100'
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
