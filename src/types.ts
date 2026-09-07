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

export interface CategoryConfig {
  id: string;
  label: string;
  defaultLabel: string;
  iconName: string;
  colorScheme: string;
}

// ==================== BLOCK BUILDER TYPES ====================
export interface TextLayoutBlock {
  id: string;
  type: 'text';
  title?: string;
  content: string;
}

export interface AlertLayoutBlock {
  id: string;
  type: 'alert';
  title?: string;
  message: string;
  level: 'info' | 'warning' | 'success' | 'danger';
}

export interface FAQBlockItem {
  q: string;
  a: string;
}

export interface FAQLayoutBlock {
  id: string;
  type: 'faq';
  title?: string;
  items: FAQBlockItem[];
}

export interface MediaLayoutBlock {
  id: string;
  type: 'media';
  title?: string;
  url: string;
  mediaType?: 'image' | 'video' | 'pdf';
  caption?: string;
}

export type LayoutBlock = 
  | TextLayoutBlock 
  | AlertLayoutBlock 
  | FAQLayoutBlock 
  | MediaLayoutBlock;

export interface Service {
  id: ServiceId | string;
  title: string;
  iconName: string;
  icon?: string;
  shortDesc: string;
  category: 'Nómina y Pagos' | 'Tarjetas y Créditos' | 'Control y Asistencia' | string;
  fullDescription?: string;
  hidden?: boolean;

  // Árbol de decisiones dinámico (Divulgación progresiva)
  decisionTree?: ServiceNode[];

  // Tarjeta en home/catálogo
  cardImage?: string;

  // Constructor de Bloques de Página
  layoutBlocks?: LayoutBlock[];

  // Campos opcionales para compatibilidad con versiones previas
  steps?: StepItem[];
  requirements?: string[];
  location?: string;
  schedule?: string;
  contact?: string;
  faqs?: ServiceFAQ[];
  imageUrl?: string;
  videoUrl?: string;
  pdfUrl?: string;
  pdfTitle?: string;
  attachments?: ServiceAttachment[];
  alertNotice?: string;
  showAlertNotice?: boolean;
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
