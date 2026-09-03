import { ServiceId, Service, FAQ, NewsItem, Aviso, UserProfile, MonthlyRecognition, ContactInfo } from './types';

export const initialContact: ContactInfo = {
  whatsapp: 'https://wa.me/525512345678',
  telefono: 'Ext. 202 (5512345678)',
  ubicacion: 'Módulo de Servicios al Personal, ubicado a un lado de Ropería.',
  horario: 'Lunes - Viernes: 7:00 am a 8:00 am | 9:00 am a 12:00 pm | 2:30 pm a 3:30 pm\nSábados: 9:30 am a 12:30 pm',
  croquisUrl: ''
};

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
    title: 'Días y Fechas de Pago',
    iconName: 'Banknote',
    icon: 'Banknote',
    shortDesc: 'Explicación de fechas de pago, periodicidad, conceptos aplicables y consultas frecuentes.',
    category: 'Nómina y Pagos',
    fullDescription: '',
    steps: [],
    requirements: [],
    faqs: [],
    imageUrl: '',
    videoUrl: '',
    pdfUrl: '',
    pdfTitle: ''
  },
  {
    id: ServiceId.RecibosCIF,
    title: 'Mis Recibos de Nómina',
    iconName: 'ReceiptText',
    icon: 'ReceiptText',
    shortDesc: 'Guía paso a paso para solicitar recibos impresos o digitales y consultar el Timbrado CIF.',
    category: 'Nómina y Pagos',
    fullDescription: '',
    steps: [],
    requirements: [],
    faqs: [],
    imageUrl: '',
    videoUrl: '',
    pdfUrl: '',
    pdfTitle: ''
  },
  {
    id: ServiceId.AclaracionPago,
    title: 'Dudas con Mi Pago',
    iconName: 'HelpCircle',
    icon: 'HelpCircle',
    shortDesc: 'Contactos de Talento y Cultura, horarios de atención y FAQs sobre dudas de pago.',
    category: 'Nómina y Pagos',
    fullDescription: '',
    steps: [],
    requirements: [],
    faqs: [],
    imageUrl: '',
    videoUrl: '',
    pdfUrl: '',
    pdfTitle: ''
  },

  // 2. Módulo "Tarjetas y Créditos"
  {
    id: ServiceId.ValesTarjetaNomina,
    title: 'Mi Tarjeta y Vales',
    iconName: 'CreditCard',
    icon: 'CreditCard',
    shortDesc: 'Información sobre solicitud, uso, reposición por robo o extravío y FAQs.',
    category: 'Tarjetas y Créditos',
    fullDescription: '',
    steps: [],
    requirements: [],
    faqs: [],
    imageUrl: '',
    videoUrl: '',
    pdfUrl: '',
    pdfTitle: ''
  },
  {
    id: ServiceId.CajaAhorro,
    title: 'Préstamos y Ahorro',
    iconName: 'PiggyBank',
    icon: 'PiggyBank',
    shortDesc: 'Reglas de acceso a la caja de ahorro, tipos de préstamos y procedimiento de solicitud informativa.',
    category: 'Tarjetas y Créditos',
    fullDescription: '',
    steps: [],
    requirements: [],
    faqs: [],
    imageUrl: '',
    videoUrl: '',
    pdfUrl: '',
    pdfTitle: ''
  },
  {
    id: ServiceId.Infonavit,
    title: 'Infonavit',
    iconName: 'Home',
    icon: 'Home',
    shortDesc: 'Información de descuentos, retención de crédito y preguntas frecuentes.',
    category: 'Tarjetas y Créditos',
    fullDescription: '',
    steps: [],
    requirements: [],
    faqs: [],
    imageUrl: '',
    videoUrl: '',
    pdfUrl: '',
    pdfTitle: ''
  },

  // 3. Módulo "Control y Asistencia"
  {
    id: ServiceId.Vacaciones,
    title: 'Mis Vacaciones',
    iconName: 'Palmtree',
    icon: 'Palmtree',
    shortDesc: 'Políticas de días disponibles, reglas de uso, Home Week, Días Flex y tiempos de solicitud.',
    category: 'Control y Asistencia',
    fullDescription: '',
    steps: [],
    requirements: [],
    faqs: [],
    imageUrl: '',
    videoUrl: '',
    pdfUrl: '',
    pdfTitle: ''
  },
  {
    id: ServiceId.Incapacidades,
    title: 'Incapacidades IMSS',
    iconName: 'Stethoscope',
    icon: 'Stethoscope',
    shortDesc: 'Tipos de incapacidad, documentación requerida del IMSS y proceso para reportarla.',
    category: 'Control y Asistencia',
    fullDescription: 'Guía interactiva para tramitar, entregar y dar seguimiento a tus incapacidades médicas emitidas por el IMSS.',
    steps: [
      { num: 1, title: 'Atención Médica', desc: 'Acude a tu clínica del IMSS (UMF) para valoración médica.' },
      { num: 2, title: 'Entrega de Certificado', desc: 'Entrega la copia patronal en Recursos Humanos dentro de 24 hrs.' }
    ],
    requirements: [
      'Certificado de Incapacidad original (Copia Patrón)',
      'Gafete de empleado vigente',
      'Alta o reporte médico si fue riesgo de trabajo'
    ],
    faqs: [
      { question: '¿Cuántos días tengo para entregar mi incapacidad?', answer: 'Cuentas con un máximo de 24 horas después de emitida para notificar y enviar comprobante a Recursos Humanos.' }
    ],
    imageUrl: '',
    videoUrl: '',
    pdfUrl: '',
    pdfTitle: '',
    decisionTree: [
      {
        id: 'node_enf_gen',
        title: 'Enfermedad General',
        nodeType: 'category',
        children: [
          {
            id: 'node_enf_menor_3',
            title: 'De 1 a 3 días',
            nodeType: 'content',
            contentData: {
              text: 'Las incapacidades por Enfermedad General de 1 a 3 días NO son subsidiadas por el IMSS (art. 96 LSS).\n\n1. Envía foto clara del Certificado (Copia Patrón) por WhatsApp de RH dentro de las primeras 24 hrs.\n2. Al reincorporarte a tu turno, entrega el documento físico original en la ventanilla de Recursos Humanos para justificar tus faltas.',
              imageUrl: ''
            }
          },
          {
            id: 'node_enf_mayor_3',
            title: '4 días o más (con Subsidio)',
            nodeType: 'content',
            contentData: {
              text: 'A partir del 4to día, el IMSS cubre el 60% del salario base de cotización registrado.\n\n• Requisito IMSS: Tener al menos 4 cotizaciones semanales inmediatas anteriores.\n• Cobro: Registra tu CLABE interbancaria en el portal IMSS Digital para recibir el pago directo en tu cuenta bancaria sin acudir al banco.',
              imageUrl: ''
            }
          }
        ]
      },
      {
        id: 'node_riesgo_trabajo',
        title: 'Accidente de Trabajo / Trayecto',
        nodeType: 'category',
        children: [
          {
            id: 'node_acc_planta',
            title: 'Ocurrió dentro de la Planta',
            nodeType: 'content',
            contentData: {
              text: '1. Notifica inmediatamente a tu supervisor y al Médico de Planta.\n2. Te emitirán el formato ST-7 (Aviso de Atención Médica Inicial).\n3. El IMSS cubre el 100% de tu salario desde el primer día una vez calificado como Sí de Trabajo por Salud en el Trabajo.',
              imageUrl: ''
            }
          },
          {
            id: 'node_acc_trayecto',
            title: 'Ocurrió en Trayecto (Casa - Trabajo)',
            nodeType: 'content',
            contentData: {
              text: 'Si el accidente ocurrió en la ruta directa entre tu domicilio y la empresa:\n\n1. Acude al área de urgencias de tu clínica del IMSS.\n2. Solicita en RH tu Carta de Horario y Trayecto Oficial.\n3. Presenta ambos documentos en Salud en el Trabajo de tu clínica para la calificación correspondiente.',
              imageUrl: ''
            }
          }
        ]
      },
      {
        id: 'node_maternidad',
        title: 'Maternidad (Prenatal / Postnatal)',
        nodeType: 'content',
        contentData: {
          text: 'La incapacidad por Maternidad abarca 84 días naturales (42 días prenatal y 42 días postnatal) y se subsidia al 100% de tu salario registrado por el IMSS.\n\n• Acude a tu UMF entre las semanas 34 y 37 de gestación para la expedición de tu Certificado Único de Maternidad.\n• Entrega en RH la copia patronal inmediatamente tras recibirla para programar tu periodo de descanso.',
          imageUrl: ''
        }
      }
    ]
  },
  {
    id: ServiceId.RelojChecador,
    title: 'Checador y Asistencia',
    iconName: 'Fingerprint',
    icon: 'Fingerprint',
    shortDesc: 'Guía de uso de lectores en planta, política sobre omisión de marcas y aclaraciones de asistencia.',
    category: 'Control y Asistencia',
    fullDescription: '',
    steps: [],
    requirements: [],
    faqs: [],
    imageUrl: '',
    videoUrl: '',
    pdfUrl: '',
    pdfTitle: ''
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
  return {
    fullDescription: service.fullDescription || service.shortDesc || '',
    steps: service.steps || [],
    requirements: service.requirements || [],
    location: service.location || '',
    schedule: service.schedule || '',
    contact: service.contact || '',
    faqs: service.faqs || [],
    imageUrl: service.imageUrl || '',
    videoUrl: service.videoUrl || '',
    pdfUrl: service.pdfUrl || '',
    pdfTitle: service.pdfTitle || '',
    attachments: service.attachments || [],
    alertNotice: service.alertNotice || '',
    decisionTree: service.decisionTree || []
  };
}

export const faqsData: FAQ[] = [];
