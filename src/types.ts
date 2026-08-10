export enum ServiceId {
  Nomina = 'nomina',
  FondoAhorro = 'fondo_ahorro',
  TarjetaDespensa = 'tarjeta_despensa',
  Vacaciones = 'vacaciones',
  Transporte = 'transporte',
  Uniformes = 'uniformes',
  Seguridad = 'seguridad',
  PreguntasFrecuentes = 'faq',
  ContactarRRHH = 'contacto_rrhh',
  RelojChecador = 'reloj_checador',
  AclaracionPago = 'aclaracion_pago',
  CajaAhorro = 'caja_ahorro',
  Infonavit = 'infonavit',
  Incapacidades = 'incapacidades',
  Prestamos = 'prestamos'
}

export interface Service {
  id: ServiceId;
  title: string;
  iconName: string;
  shortDesc: string;
  category: 'nomina_pagos' | 'tarjetas_creditos' | 'control_asistencia';
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
