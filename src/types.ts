export enum ServiceId {
  PoliticasPago = 'politicas_pago',
  RecibosCIF = 'recibos_cif',
  AclaracionPago = 'aclaracion_pago',
  ValesTarjetaNomina = 'vales_tarjeta_nomina',
  CajaAhorro = 'caja_ahorro',
  Infonavit = 'infonavit',
  Vacaciones = 'vacaciones',
  Incapacidades = 'incapacidades',
  RelojChecador = 'reloj_checador'
}

export interface StepItem {
  num?: number;
  title: string;
  desc: string;
}

export interface ServiceFAQ {
  question: string;
  answer: string;
}

export interface Service {
  id: ServiceId | string;
  title: string;
  iconName: string;
  shortDesc: string;
  category: 'Nómina y Pagos' | 'Tarjetas y Créditos' | 'Control y Asistencia';
  fullDescription?: string;
  steps?: StepItem[];
  requirements?: string[];
  location?: string;
  schedule?: string;
  contact?: string;
  faqs?: ServiceFAQ[];
  hidden?: boolean;
}

export interface FAQ {
  question: string;
  answer: string;
  category: ServiceId | 'general';
}

export interface NewsItem {
  id: string;
  title: string;
  summary: string;
  content: string;
  date: string;
  imageName: string;
  category: 'evento' | 'comunicado' | 'logro';
}

export interface Aviso {
  id: string;
  title: string;
  message: string;
  date: string;
  urgency: 'alta' | 'media' | 'baja';
  read: boolean;
  sender: string;
}

export interface UserProfile {
  name: string;
  employeeId: string;
  position: string;
  department: string;
  supervisor: string;
  shift: string;
  hiringDate: string;
  nss: string;
  rfc: string;
  vacationDaysAvailable: number;
  fondoAhorroBalance: number;
  despensaBalance: number;
}
