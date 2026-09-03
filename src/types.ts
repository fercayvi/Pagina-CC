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

// Progressive Disclosure (Árbol de decisiones dinámico)
export interface ContentBlock {
  id: string;
  text?: string;
  imageUrl?: string;
  videoUrl?: string;
}

export interface ServiceNodeContentData {
  text?: string;
  imageUrl?: string;
  videoUrl?: string;
  blocks?: ContentBlock[];
}

export interface ServiceNode {
  id: string;
  title: string; // El texto del botón
  nodeType: 'category' | 'content' | 'step'; // categoría = tiene sub-botones; content = respuesta final; step = paso con contenido + botones
  children?: ServiceNode[]; // Opcional, si es category o step
  contentData?: ServiceNodeContentData; // Opcional, si es content o step
}

export interface ServiceFAQ {
  question: string;
  answer: string;
}

export interface ServiceAttachment {
  id?: string;
  name: string;
  url: string;
  fileType?: string;
}

export interface Service {
  id: ServiceId | string;
  title: string;
  iconName: string;
  icon?: string;
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

  // Árbol de decisiones dinámico (Divulgación progresiva)
  decisionTree?: ServiceNode[];

  // Multimedia & Attachments
  cardImage?: string;
  imageUrl?: string;
  videoUrl?: string;
  pdfUrl?: string;
  pdfTitle?: string;
  attachments?: ServiceAttachment[];

  // Free Text Alert Notice Block (Banner de Alerta opcional)
  alertNotice?: string;
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

export interface MonthlyRecognition {
  id: string;
  badgeTitle?: string;
  name: string;
  initials?: string;
  position: string;
  message: string;
  photoUrl?: string;
  date?: string;
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

export interface ContactInfo {
  whatsapp: string;
  telefono: string;
  ubicacion: string;
  horario: string;
  croquisUrl?: string;
}
