import { ServiceId, Service, FAQ, NewsItem, Aviso, UserProfile } from './types';

export const servicesData: Service[] = [
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

export const newsData: NewsItem[] = [
  {
    id: 'n4',
    title: 'Nueva edición de Hecho en Planta ya disponible',
    summary: 'Consulta la revista interna con las últimas noticias, logros y reconocimientos de la planta.',
    content: 'Ya se encuentra en circulación el nuevo número de nuestra revista interna "Hecho en Planta". En esta edición celebramos la certificación ISO de la línea 2, compartimos la galería de fotos del torneo de fútbol inter-plantas y un reportaje especial sobre los procesos de soldadura robótica de última generación. Puedes pedir tu ejemplar impreso con tu supervisor de turno o solicitarlo en Recursos Humanos de forma completamente gratuita.',
    date: 'Hoy',
    imageName: 'revista_planta',
    category: 'comunicado'
  },
  {
    id: 'n1',
    title: '¡Bienvenidos Nuevos Colaboradores!',
    summary: 'Hoy damos la bienvenida a la generación de julio en la planta de manufactura.',
    content: 'Estamos muy emocionados de recibir a los nuevos operarios en las líneas de ensamble y empaque. Recuerden que su supervisor asignado los acompañará durante las primeras dos semanas para su entrenamiento práctico de seguridad y operación.',
    date: 'Hace 2 días',
    imageName: 'welcome_team',
    category: 'evento'
  },
  {
    id: 'n2',
    title: 'Nueva Campaña de Salud en Planta',
    summary: 'Exámenes médicos de vista y dental gratuitos para todo el personal.',
    content: 'La próxima semana se instalará la unidad médica móvil en el estacionamiento principal. Podrás acudir en tu tiempo de comida o agendar con tu supervisor una salida de 15 minutos. Los lentes graduados tienen un subsidio especial.',
    date: 'Hace 5 días',
    imageName: 'health_campaign',
    category: 'comunicado'
  },
  {
    id: 'n3',
    title: 'Rompe Récord Línea 3 de Ensamble',
    summary: '¡Felicidades al equipo del primer turno por lograr cero defectos esta semana!',
    content: 'Queremos reconocer el excelente trabajo de la Línea 3 liderada por el equipo de manufactura. Lograron armar 1,200 piezas sin una sola alerta de calidad. Todo el equipo recibirá un reconocimiento especial.',
    date: 'Hace 1 semana',
    imageName: 'production_record',
    category: 'logro'
  }
];

export const avisosData: Aviso[] = [];

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
