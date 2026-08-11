import { ServiceId, Service, FAQ, NewsItem, Aviso, UserProfile, MonthlyRecognition } from './types';

export const initialRecognitions: MonthlyRecognition[] = [
  {
    id: 'rec-1',
    badgeTitle: 'Reconocimiento Mensual',
    name: 'Mateo Rodríguez',
    initials: 'MR',
    position: 'Línea 2 - Montacargas • ¡Cero Retardos y 5S Perfecto!',
    message: 'Mateo mantuvo su área de almacén 100% limpia y ordenada, asegurando que los materiales llegaran a tiempo a la línea de ensamble. ¡Gracias por tu esfuerzo, Mateo!'
  }
];

export const recognitionData: MonthlyRecognition = initialRecognitions[0];

export const initialServices: Service[] = [
  // 1. Módulo "Nómina y Pagos"
  {
    id: ServiceId.PoliticasPago,
    title: 'Políticas de Pago',
    iconName: 'Banknote',
    shortDesc: 'Explicación de fechas de pago, periodicidad, conceptos aplicables y consultas frecuentes.',
    category: 'Nómina y Pagos'
  },
  {
    id: ServiceId.RecibosCIF,
    title: 'Recibos de Nómina & CIF',
    iconName: 'FileCheck',
    shortDesc: 'Guía paso a paso para solicitar recibos impresos o digitales y consultar el Timbrado CIF.',
    category: 'Nómina y Pagos'
  },
  {
    id: ServiceId.AclaracionPago,
    title: 'Aclaraciones de Nómina',
    iconName: 'HelpCircle',
    shortDesc: 'Contactos de Talento y Cultura, horarios de atención y FAQs sobre dudas de pago.',
    category: 'Nómina y Pagos'
  },

  // 2. Módulo "Tarjetas y Créditos"
  {
    id: ServiceId.ValesTarjetaNomina,
    title: 'Vales y Tarjeta Nómina',
    iconName: 'CreditCard',
    shortDesc: 'Información sobre solicitud, uso, reposición por robo o extravío y FAQs.',
    category: 'Tarjetas y Créditos'
  },
  {
    id: ServiceId.CajaAhorro,
    title: 'Caja de Ahorro y Préstamos',
    iconName: 'PiggyBank',
    shortDesc: 'Reglas de acceso a la caja de ahorro, tipos de préstamos y procedimiento de solicitud informativa.',
    category: 'Tarjetas y Créditos'
  },
  {
    id: ServiceId.Infonavit,
    title: 'Infonavit',
    iconName: 'Home',
    shortDesc: 'Información de descuentos, retención de crédito y preguntas frecuentes.',
    category: 'Tarjetas y Créditos'
  },

  // 3. Módulo "Control y Asistencia"
  {
    id: ServiceId.Vacaciones,
    title: 'Vacaciones, Flex & Home Week',
    iconName: 'CalendarDays',
    shortDesc: 'Políticas de días disponibles, reglas de uso, Home Week, Días Flex y tiempos de solicitud.',
    category: 'Control y Asistencia'
  },
  {
    id: ServiceId.Incapacidades,
    title: 'Incapacidades',
    iconName: 'ShieldAlert',
    shortDesc: 'Tipos de incapacidad, documentación requerida del IMSS y proceso para reportarla.',
    category: 'Control y Asistencia'
  },
  {
    id: ServiceId.RelojChecador,
    title: 'Reloj Checador',
    iconName: 'Clock',
    shortDesc: 'Guía de uso de lectores en planta, política sobre omisión de marcas y aclaraciones de asistencia.',
    category: 'Control y Asistencia'
  }
];

export const servicesData = initialServices;

export const userProfileData: UserProfile = {
  name: 'Colaborador Planta',
  employeeId: 'OP-4820',
  position: 'Operador de Ensamble A',
  department: 'Producción - Línea 3',
  supervisor: 'Ing. Héctor Ramírez (Cel: 55-9876-5432)',
  shift: 'Primer Turno (06:00 AM - 02:00 PM)',
  hiringDate: '12 de Enero, 2026',
  nss: '12987456321',
  rfc: 'MANJ950812HDF',
  vacationDaysAvailable: 12,
  fondoAhorroBalance: 1840.50,
  despensaBalance: 650.00
};

export const initialNews: NewsItem[] = [];
export const newsData = initialNews;

export const avisosData: Aviso[] = [];

export function getDefaultServiceDetails(service: Service) {
  let fullDescription = service.fullDescription || service.shortDesc;
  let steps = service.steps && service.steps.length > 0 ? service.steps : null;
  let requirements = service.requirements && service.requirements.length > 0 ? service.requirements : null;
  let location = service.location || 'Planta Baja • Edificio de Recursos Humanos';
  let schedule = service.schedule;
  let contact = service.contact;
  let faqs = service.faqs && service.faqs.length > 0 ? service.faqs : null;

  if (!steps) {
    switch (service.id) {
      case ServiceId.PoliticasPago:
        steps = [
          { num: 1, title: 'Calendario Semanal de Pago', desc: 'El depósito se efectúa todos los viernes antes de las 09:00 AM. Si el viernes es día inhábil, el pago se adelanta al jueves.' },
          { num: 2, title: 'Corte de Horas y Asistencia', desc: 'El periodo de nómina abarca de Lunes a Domingo. Las horas extra y bonos de la semana previa se calculan en el pago del viernes.' },
          { num: 3, title: 'Conceptos y Percepciones', desc: 'Tu nómina integra Sueldo Base, Horas Extraordinarias, Prima Dominical, Bono de Puntualidad y Vales de Despensa mensual.' },
          { num: 4, title: 'Deducciones Oficiales', desc: 'Se aplican únicamente las retenciones de ley (ISR, IMSS), crédito Infonavit (de existir) y aportación voluntaria a la Caja de Ahorro.' }
        ];
        break;
      case ServiceId.RecibosCIF:
        steps = [
          { num: 1, title: 'Generación Digital Semanal', desc: 'Cada semana se emite tu comprobante fiscal digital de nómina (CFDI / CIF) conforme a la normativa del SAT.' },
          { num: 2, title: 'Envío por Correo Electrónico', desc: 'Recibes tus archivos XML y PDF directamente en la cuenta de correo institucional registrada.' },
          { num: 3, title: 'Solicitud de Impresión Física', desc: 'Si requieres tus recibos impresos sellados para trámites de crédito personal o vivienda, acude a la ventanilla de RH.' },
          { num: 4, title: 'Verificación del Timbrado CIF', desc: 'Puedes validar la autenticidad del timbre fiscal escaneando el código QR del recibo con la app oficial del SAT.' }
        ];
        break;
      case ServiceId.AclaracionPago:
        steps = [
          { num: 1, title: 'Identificación de Diferencia', desc: 'Revisa tu recibo impreso o digital e identifica el concepto a aclarar (horas extra, faltas, bonos o retenciones).' },
          { num: 2, title: 'Validación con Supervisor de Línea', desc: 'Verifica con el supervisor de tu turno el registro de horas trabajadas en las bitácoras de asistencia.' },
          { num: 3, title: 'Atención en Talento y Cultura', desc: 'Presenta tu solicitud en la ventanilla de Talento y Cultura los días martes y jueves de 2:00 PM a 4:00 PM.' },
          { num: 4, title: 'Resolución y Ajuste Retroactivo', desc: 'Si la aclaración procede, el ajuste retroactivo se depositará en el siguiente recibo de nómina del viernes.' }
        ];
        break;
      case ServiceId.ValesTarjetaNomina:
        steps = [
          { num: 1, title: 'Dispersión de Vales Toka', desc: 'El saldo de la tarjeta de vales de despensa se deposita el día 25 de cada mes. Consulta tu saldo al 800-400-8652.' },
          { num: 2, title: 'Reporte Inmediato por Robo/Extravío', desc: 'Si perdiste la tarjeta, llama de inmediato al 800-400-8652 para el bloqueo del plástico y obtención de folio.' },
          { num: 3, title: 'Solicitud de Reposición', desc: 'Acude a Recursos Humanos con tu folio de bloqueo para tramitar la expedición del nuevo plástico.' },
          { num: 4, title: 'Entrega y Activación de Plástico', desc: 'Recoge tu nuevo plástico en RH en un lapso de 3 a 5 días hábiles y actívalo desde la app móvil o por teléfono.' }
        ];
        break;
      case ServiceId.CajaAhorro:
        steps = [
          { num: 1, title: 'Definición de Porcentaje de Ahorro', desc: 'Elige ahorrar libremente entre el 2% y el 10% de tu sueldo base semanal mediante descuento de nómina.' },
          { num: 2, title: 'Firma de Formato de Autorización', desc: 'Presenta tu solicitud de inscripción en la oficina de Recursos Humanos durante las ventanas de Enero o Julio.' },
          { num: 3, title: 'Solicitud de Préstamos Informativos', desc: 'Al cumplir 1 año de antigüedad puedes solicitar préstamos con tasa preferencial calculados sobre tu capacidad de pago.' },
          { num: 4, title: 'Entrega Anual de Rendimientos', desc: 'El fondo total acumulado junto con los intereses generados se liquida en el mes de Diciembre.' }
        ];
        break;
      case ServiceId.Infonavit:
        steps = [
          { num: 1, title: 'Descarga de Aviso de Retención', desc: 'Ingresa al portal "Mi Cuenta Infonavit" y descarga tu Aviso de Retención de Descuentos vigente.' },
          { num: 2, title: 'Entrega de Documento Original', desc: 'Entrega el documento impreso original en la ventanilla de Recursos Humanos de Lunes a Viernes de 9:00 AM a 2:00 PM.' },
          { num: 3, title: 'Cálculo de Deducción Semanal', desc: 'Nóminas programará el descuento exacto en estricto apego al Factor de Descuento (FD) o cuota fija determinada.' },
          { num: 4, title: 'Reflejo en Recibo de Pago', desc: 'La retención comenzará a reflejarse en la nómina inmediata posterior a la entrega oficial del aviso.' }
        ];
        break;
      case ServiceId.Vacaciones:
        steps = [
          { num: 1, title: 'Consulta de Días Disponibles', desc: 'Revisa tus días correspondientes según tu antigüedad cumplida (12 días en el 1er año conforme a la LFT).' },
          { num: 2, title: 'Programación de Días Flex & Home Week', desc: 'Si eres personal administrativo elegible, acuerda los Días Flex o esquema Home Week con tu jefe directo.' },
          { num: 3, title: 'Coordinación con Supervisor', desc: 'Presenta la propuesta de fechas con al menos 15 días de anticipación para asegurar la cobertura operativa.' },
          { num: 4, title: 'Firma de Papeleta Oficial', desc: 'Acude a Recursos Humanos a firmar la Papeleta Oficial de Vacaciones para el registro formal en sistema.' }
        ];
        break;
      case ServiceId.Incapacidades:
        steps = [
          { num: 1, title: 'Aviso Inmediato a Planta', desc: 'Notifica a tu supervisor y envía foto clara del certificado IMSS al WhatsApp de RH (+52 55 1234 5678) en las primeras 12 horas.' },
          { num: 2, title: 'Validación en Servicio Médico', desc: 'El área médica de planta registra el tipo de incapacidad (Enfermedad General, Maternidad o Riesgo de Trabajo).' },
          { num: 3, title: 'Entrega de Certificado en Papel', desc: 'Al reincorporarte a tu turno, entrega el certificado original en papel (Copia Patrón) en la ventanilla de Medicina del Trabajo.' },
          { num: 4, title: 'Pago y Justificación', desc: 'Medicina del Trabajo justifica las faltas en el reloj checador. El IMSS efectúa el pago según la ley vigente.' }
        ];
        break;
      case ServiceId.RelojChecador:
        steps = [
          { num: 1, title: 'Uso de Lectores Biométricos', desc: 'Checa tu entrada y salida colocando tu huella o rostro firmemente en las estaciones de lectura en accesos de planta.' },
          { num: 2, title: 'Procedimiento por Omisión de Chequeo', desc: 'Si olvidaste checar, solicita a tu supervisor el Formato de Corrección de Omisión de Marcaje de forma inmediata.' },
          { num: 3, title: 'Firma y Justificación del Supervisor', desc: 'Indica la hora exacta y turno. El supervisor de línea debe firmar el formato acreditando tu presencia física.' },
          { num: 4, title: 'Aclaración de Asistencia en RH', desc: 'Entrega la papeleta en RH antes del martes a las 12:00 PM para evitar afectaciones en tu pago semanal.' }
        ];
        break;
      default:
        steps = [
          { num: 1, title: 'Consulta de Información', desc: 'Revisa las preguntas frecuentes abajo para conocer los requisitos de este trámite.' },
          { num: 2, title: 'Acudir a Recursos Humanos', desc: 'Visita la oficina de Recursos Humanos con tu gafete de empleado para atención personalizada.' },
          { num: 3, title: 'Seguimiento', desc: 'Da seguimiento a tu solicitud con el encargado del área de Recursos Humanos.' }
        ];
        break;
    }
  }

  if (!requirements) {
    switch (service.id) {
      case ServiceId.PoliticasPago:
        requirements = ['Gafete oficial activo', 'Cuenta Bancaria de Nómina a tu nombre (BBVA / Santander)'];
        break;
      case ServiceId.RecibosCIF:
        requirements = ['RFC activo con Homoclave', 'Correo electrónico registrado', 'Identificación INE para impresión física'];
        break;
      case ServiceId.AclaracionPago:
        requirements = ['Recibo de nómina de la semana a aclarar', 'Lista de asistencia avalada por supervisor', 'Plazo máximo de 5 días hábiles'];
        break;
      case ServiceId.ValesTarjetaNomina:
        requirements = ['Folio de bloqueo telefónico oficial', 'Gafete de empleado', 'Identificación oficial INE'];
        break;
      case ServiceId.CajaAhorro:
        requirements = ['Antigüedad mínima de 3 meses (Ahorro) / 1 año (Préstamo)', 'Formato de autorización firmado'];
        break;
      case ServiceId.Infonavit:
        requirements = ['Aviso de Retención impreso original vigente', 'Número de Crédito Infonavit (10 dígitos)', 'NSS y RFC'];
        break;
      case ServiceId.Vacaciones:
        requirements = ['Solicitud realizada con 15 días de anticipación', 'Autorización firmada del supervisor de línea'];
        break;
      case ServiceId.Incapacidades:
        requirements = ['Certificado de Incapacidad del IMSS impreso original (Copia Patrón)', 'Aviso oportuno antes del turno'];
        break;
      case ServiceId.RelojChecador:
        requirements = ['Formato de Corrección con firma autógrafa de supervisor', 'Entrega antes del martes 12:00 PM'];
        break;
      default:
        requirements = ['Gafete de empleado activo'];
        break;
    }
  }

  if (!schedule) {
    switch (service.id) {
      case ServiceId.PoliticasPago:
        schedule = 'Depósito semanal cada Viernes a las 09:00 AM';
        break;
      case ServiceId.RecibosCIF:
      case ServiceId.ValesTarjetaNomina:
      case ServiceId.CajaAhorro:
      case ServiceId.Vacaciones:
      case ServiceId.RelojChecador:
        schedule = 'Lunes a Viernes de 8:00 AM a 5:00 PM';
        break;
      case ServiceId.AclaracionPago:
        schedule = 'Martes y Jueves de 2:00 PM a 4:00 PM';
        break;
      case ServiceId.Infonavit:
        schedule = 'Recepción: Lunes a Viernes de 9:00 AM a 2:00 PM';
        break;
      case ServiceId.Incapacidades:
        schedule = 'Atención WhatsApp 24/7 • Servicio Médico L-S de 6:00 AM a 10:00 PM';
        break;
      default:
        schedule = 'Lunes a Viernes de 8:00 AM a 5:00 PM';
        break;
    }
  }

  if (!contact) {
    switch (service.id) {
      case ServiceId.PoliticasPago:
        contact = 'Atención a Nóminas - Ext. 201';
        break;
      case ServiceId.RecibosCIF:
        contact = 'Oficina de Timbrado y Recibos - Ext. 202';
        break;
      case ServiceId.AclaracionPago:
        contact = 'Mesa de Talento y Cultura - Ext. 202';
        break;
      case ServiceId.ValesTarjetaNomina:
        contact = 'Atención a Vales y Nómina - Ext. 204';
        break;
      case ServiceId.CajaAhorro:
        contact = 'Comité de Caja de Ahorro - Ext. 205';
        break;
      case ServiceId.Infonavit:
        contact = 'Ventanilla Infonavit - Ext. 202';
        break;
      case ServiceId.Vacaciones:
        contact = 'Coordinación de Personal - Ext. 201';
        break;
      case ServiceId.Incapacidades:
        contact = 'Servicio Médico de Planta - Ext. 105';
        break;
      case ServiceId.RelojChecador:
        contact = 'Control de Asistencia - Ext. 203';
        break;
      default:
        contact = 'Recursos Humanos - Ext. 200';
        break;
    }
  }

  if (!faqs) {
    const matched = faqsData.filter(f => f.category === service.id);
    if (matched.length > 0) {
      faqs = matched.map(f => ({ question: f.question, answer: f.answer }));
    } else {
      faqs = [
        {
          question: `¿Dónde puedo realizar el trámite de ${service.title}?`,
          answer: `Puedes acudir a la oficina de Recursos Humanos en horario laboral o comunicarte a la extensión ${contact}.`
        }
      ];
    }
  }

  return {
    fullDescription,
    steps,
    requirements,
    location,
    schedule,
    contact,
    faqs,
    showSteps: service.showSteps ?? true,
    showRequirements: service.showRequirements ?? true,
    showContact: service.showContact ?? true,
    showFaqs: service.showFaqs ?? true,
    imageUrl: service.imageUrl || '',
    videoUrl: service.videoUrl || '',
    attachments: service.attachments || [],
    showAlertNotice: service.showAlertNotice ?? false,
    alertNotice: service.alertNotice || ''
  };
}

export const faqsData: FAQ[] = [
  // Políticas de Pago
  {
    category: ServiceId.PoliticasPago,
    question: '¿Qué día de la semana depositan la nómina?',
    answer: 'Para todo el personal operativo de planta, el pago es SEMANAL y se deposita cada VIERNES por la mañana antes de las 9:00 AM. Si el viernes es día festivo bancario, el depósito se adelanta al jueves inmediato anterior.'
  },
  {
    category: ServiceId.PoliticasPago,
    question: '¿Qué conceptos se incluyen en el pago semanal?',
    answer: 'Tu pago incluye el sueldo base pactado, horas extraordinarias autorizadas, prima dominical (si aplica), bono de asistencia y puntualidad, con las deducciones de ley como ISR e IMSS.'
  },

  // Recibos de Nómina & CIF
  {
    category: ServiceId.RecibosCIF,
    question: '¿Cómo puedo obtener mis recibos de nómina digitales?',
    answer: 'Los recibos digitales timbrados fiscalmente (CFDI / CIF) se envían semanalmente a tu correo institucional o los puedes consultar en el portal interno de la empresa.'
  },
  {
    category: ServiceId.RecibosCIF,
    question: '¿Dónde pido la versión impresa de mis recibos de nómina?',
    answer: 'Si requieres tus recibos impresos para trámites bancarios o personales, puedes solicitarlos directamente en la ventanilla de Recursos Humanos de Lunes a Viernes de 8:00 AM a 5:00 PM.'
  },

  // Aclaraciones de Nómina
  {
    category: ServiceId.AclaracionPago,
    question: '¿Cuál es el tiempo límite para solicitar aclaraciones de pago?',
    answer: 'Tienes un plazo máximo de 5 días hábiles contados a partir del viernes de pago para reportar cualquier omisión en horas extra o bonos con tu recibo impreso y firma de tu supervisor.'
  },
  {
    category: ServiceId.AclaracionPago,
    question: '¿Con quién me pongo en contacto en Talento y Cultura para una duda?',
    answer: 'Puedes acudir a la ventanilla de Talento y Cultura (Nóminas - Ext. 202) los martes y jueves de 2:00 PM a 4:00 PM o enviar un mensaje al WhatsApp oficial de RH.'
  },

  // Vales y Tarjeta Nómina
  {
    category: ServiceId.ValesTarjetaNomina,
    question: '¿Cuándo se realiza la dispersión de vales de despensa?',
    answer: 'El saldo de la tarjeta de vales Toka se deposita el día 25 de cada mes. Si cae en fin de semana o festivo, se adelanta al día hábil anterior.'
  },
  {
    category: ServiceId.ValesTarjetaNomina,
    question: '¿Qué hago en caso de robo o extravío de mi tarjeta de nómina o vales?',
    answer: 'Llama de inmediato a la línea del banco o de Toka (800-400-8652) para realizar el bloqueo preventivo y solicita tu número de folio. Con ese folio acude a RH para tramitar la reposición.'
  },

  // Caja de Ahorro y Préstamos
  {
    category: ServiceId.CajaAhorro,
    question: '¿Cómo funciona la Caja de Ahorro y los préstamos?',
    answer: 'Puedes ahorrar libremente entre el 2% y el 10% de tu sueldo base. La caja otorga rendimientos anuales. Tras 1 año de antigüedad, puedes solicitar un préstamo con tasa preferencial cuya deducción semanal no exceda el 30% de tu sueldo.'
  },
  {
    category: ServiceId.CajaAhorro,
    question: '¿En qué meses se puede modificar la aportación a la caja de ahorro?',
    answer: 'Los cambios en el porcentaje de descuento se solicitan durante los meses de Enero y Julio en la ventanilla de Recursos Humanos.'
  },

  // Infonavit
  {
    category: ServiceId.Infonavit,
    question: '¿Dónde entregó mi Aviso de Retención de Descuentos de Infonavit?',
    answer: 'Debes entregar el aviso impreso original en la oficina de Nóminas de Lunes a Viernes de 9:00 AM a 2:00 PM para que se aplique el descuento oficial en tu nómina semanal.'
  },
  {
    category: ServiceId.Infonavit,
    question: '¿Cómo se calcula el descuento semanal para el pago de Infonavit?',
    answer: 'La deducción se realiza en estricto apego al Factor de Descuento (FD) o cuota fija expresada en VSM/UMAs contenida en tu Aviso de Retención expedido por el Infonavit.'
  },

  // Vacaciones, Flex & Home Week
  {
    category: ServiceId.Vacaciones,
    question: '¿Cuántos días de vacaciones me corresponden según la Ley Federal del Trabajo?',
    answer: 'De acuerdo con la LFT: 1er año = 12 días; 2do año = 14 días; 3er año = 16 días; 4to año = 18 días; 5to año = 20 días. A partir del 6to año se incrementan 2 días por cada 5 años laborados.'
  },
  {
    category: ServiceId.Vacaciones,
    question: '¿Cómo funcionan las políticas de Días Flex y Home Week?',
    answer: 'Los Días Flex y esquemas de Home Week aplican para puestos administrativos elegibles coordinando la agenda previa con tu jefe directo sin descuidar la cobertura operativa.'
  },

  // Incapacidades
  {
    category: ServiceId.Incapacidades,
    question: '¿Cómo y cuándo debo reportar un certificado de incapacidad IMSS?',
    answer: 'Notifica a tu supervisor e informa a RH enviando foto legible del certificado original en las primeras 12 horas. Al regresar a laborar, entrega la copia patronal en el Módulo de Servicio Médico.'
  },
  {
    category: ServiceId.Incapacidades,
    question: '¿Cómo se efectúa el pago de días por incapacidad médica?',
    answer: 'Por enfermedad general, el IMSS paga a partir del 4to día el 60% del Salario Diario Integrado. En accidentes de trabajo o trayecto calificados, se otorga el 100% desde el primer día.'
  },

  // Reloj Checador
  {
    category: ServiceId.RelojChecador,
    question: '¿Qué debo hacer si olvidé checar mi entrada o salida en el reloj biológico?',
    answer: 'Solicita a tu supervisor de turno la Papeleta de Corrección de Omisión de Chequeo. Pide su firma de autorización y entrégala en la ventanilla de RH antes del martes a las 12:00 PM.'
  },
  {
    category: ServiceId.RelojChecador,
    question: '¿Qué sucede si llego tarde a mi turno de trabajo?',
    answer: 'Se otorga una tolerancia de 5 minutos al inicio del turno. Pasado este tiempo se considerará retardo y requerirá visto bueno del supervisor para ingreso a la línea de producción.'
  }
];
