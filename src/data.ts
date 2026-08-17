import { ServiceId, Service, FAQ, NewsItem, Aviso, UserProfile, MonthlyRecognition, ContactInfo } from './types';

export const initialContact: ContactInfo = {
  whatsapp: 'https://wa.me/525512345678',
  telefono: 'Ext. 202 (5512345678)',
  ubicacion: 'Módulo de Servicios al Personal, ubicado a un lado de Ropería.',
  horario: 'Lunes - Viernes: 7:00 am a 8:00 am | 9:00 am a 12:00 pm | 2:30 pm a 3:30 pm\nSábados: 9:30 am a 12:30 pm'
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
    alertNotice: service.alertNotice || ''
  };
}

export const faqsData: FAQ[] = [];
