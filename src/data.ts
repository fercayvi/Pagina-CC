import { ServiceId, Service, FAQ, NewsItem, Aviso, UserProfile } from './types';

export const servicesData: Service[] = [
  {
    id: ServiceId.TarjetaDespensa,
    title: 'Tarjeta Vale de Despensa',
    iconName: 'CreditCard',
    shortDesc: 'Solicitud, reposición y consulta de saldo de tu tarjeta de vale de despensa.',
    category: 'servicios_personal'
  },
  {
    id: ServiceId.Nomina,
    title: 'Tarjeta Nómina',
    iconName: 'CreditCard',
    shortDesc: 'Solicitud, reposición y activación de tu tarjeta de nómina.',
    category: 'servicios_personal'
  },
  {
    id: ServiceId.RelojChecador,
    title: 'Aclaraciones Reloj Checador',
    iconName: 'Clock',
    shortDesc: 'Reporta fallas o inconsistencias en tus registros de entrada y salida.',
    category: 'servicios_personal'
  },
  {
    id: ServiceId.AclaracionPago,
    title: 'Aclaraciones de Pago Nómina',
    iconName: 'FileText',
    shortDesc: 'Dudas sobre asistencia, tiempo extra, bonos y premios en tu recibo.',
    category: 'servicios_personal'
  },
  {
    id: ServiceId.CajaAhorro,
    title: 'Caja de Ahorro',
    iconName: 'PiggyBank',
    shortDesc: 'Consulta tu saldo, aportaciones y retiro de caja de ahorro.',
    category: 'servicios_personal'
  },
  {
    id: ServiceId.Vacaciones,
    title: 'Vacaciones',
    iconName: 'CalendarDays',
    shortDesc: 'Días que te corresponden por ley, cómo pedirlos y simulador.',
    category: 'servicios_personal'
  },
  {
    id: ServiceId.Infonavit,
    title: 'Infonavit',
    iconName: 'Home',
    shortDesc: 'Consulta tu crédito, descuentos y trámites ante Infonavit.',
    category: 'servicios_personal'
  },
  {
    id: ServiceId.Incapacidades,
    title: 'Incapacidades',
    iconName: 'ShieldAlert',
    shortDesc: 'Cómo reportar y dar seguimiento a tus incapacidades del IMSS.',
    category: 'servicios_personal'
  },
  {
    id: ServiceId.Prestamos,
    title: 'Préstamos',
    iconName: 'Coins',
    shortDesc: 'Solicitud, saldo y condiciones de préstamos de la empresa.',
    category: 'servicios_personal'
  },
  {
    id: ServiceId.Transporte,
    title: 'Transporte de Personal',
    iconName: 'Bus',
    shortDesc: 'Rutas, horarios de los camiones y paradas autorizadas.',
    category: 'logistica'
  },
  {
    id: ServiceId.Uniformes,
    title: 'Uniformes y Botas',
    iconName: 'Shirt',
    shortDesc: 'Tallas de camisas y pantalones, calzado de seguridad y reposición.',
    category: 'logistica'
  },
  {
    id: ServiceId.Seguridad,
    title: 'Seguridad (EPP)',
    iconName: 'ShieldAlert',
    shortDesc: 'Reglas de seguridad en planta, reporte de riesgos y tu equipo.',
    category: 'bienestar'
  },
  {
    id: ServiceId.PreguntasFrecuentes,
    title: 'Preguntas Frecuentes',
    iconName: 'HelpCircle',
    shortDesc: 'Respuestas rápidas sobre permisos, incapacidades y reglamento.',
    category: 'soporte'
  }
];

export const userProfileData: UserProfile = {
  name: 'Juan Carlos Martínez',
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
    content: 'Estamos muy emocionados de recibir a 15 nuevos operarios en las líneas de ensamble y empaque. Recuerden que su supervisor asignado los acompañará durante las primeras dos semanas para su entrenamiento práctico de seguridad y operación.',
    date: 'Hace 2 días',
    imageName: 'welcome_team',
    category: 'evento'
  },
  {
    id: 'n2',
    title: 'Nueva Campaña de Salud en Planta',
    summary: 'Exámenes médicos de vista y dental gratuitos para todo el personal.',
    content: 'La próxima semana se instalará la unidad médica móvil en el estacionamiento principal. Podrás acudir en tu tiempo de comida o agendar con tu supervisor una salida de 15 minutos. Los lentes graduados tienen un subsidio del 70% por parte del sindicato y la empresa.',
    date: 'Hace 5 días',
    imageName: 'health_campaign',
    category: 'comunicado'
  },
  {
    id: 'n3',
    title: 'Rompe Récord Línea 3 de Ensamble',
    summary: '¡Felicidades al equipo del primer turno por lograr cero defectos esta semana!',
    content: 'Queremos reconocer el excelente trabajo de la Línea 3 liderada por el Ing. Héctor Ramírez. Lograron armar 1,200 piezas sin una sola alerta de calidad. Todo el equipo recibirá un cupón de comida especial para el viernes de tacos.',
    date: 'Hace 1 semana',
    imageName: 'production_record',
    category: 'logro'
  }
];

export const avisosData: Aviso[] = [
  {
    id: 'a1',
    title: '⚠️ Cambio de Parada: Ruta Oriente',
    message: 'Por obras viales, el autobús de la Ruta Oriente no pasará temporalmente por la parada de San Juan. La parada alterna será en la gasolinera OXXO GAS a 200 metros sobre la avenida principal. Favor de llegar 5 minutos antes.',
    date: 'Hoy, 05:30 AM',
    urgency: 'alta',
    read: false,
    sender: 'Coordinación de Transporte'
  },
  {
    id: 'a2',
    title: '👕 Entrega de Uniformes de Reposición',
    message: 'Se les recuerda que la entrega de uniformes para quienes ingresaron hace 6 meses iniciará este jueves en la oficina de Almacén General de 11:00 AM a 3:00 PM. Deberán presentar su gafete de empleado.',
    date: 'Ayer, 02:15 PM',
    urgency: 'media',
    read: false,
    sender: 'Recursos Humanos'
  },
  {
    id: 'a3',
    title: '⚡ Mantenimiento Preventivo de Planta',
    message: 'El domingo 20 de julio se realizará corte general de energía por mantenimiento preventivo anual en las subestaciones. Se suspenden labores de tiempo extra para ese día en todas las líneas.',
    date: 'Hace 3 días',
    urgency: 'baja',
    read: true,
    sender: 'Mantenimiento e Ingeniería'
  }
];

export const faqsData: FAQ[] = [
  {
    category: ServiceId.Nomina,
    question: '¿Qué día de la semana depositan la nómina?',
    answer: 'Para todo el personal operativo de planta, el pago es SEMANAL y se deposita cada VIERNES por la mañana antes de las 9:00 AM. Si el viernes es día festivo bancario, el depósito se realiza el jueves inmediato anterior.'
  },
  {
    category: ServiceId.Nomina,
    question: '¿Cómo puedo obtener mis recibos de nómina impresos o digitales?',
    answer: 'Los recibos digitales se envían semanalmente a tu correo institucional. Si requieres tus recibos impresos para un trámite personal, puedes solicitarlos en la ventanilla de Recursos Humanos de Lunes a Viernes de 8:00 AM a 5:00 PM.'
  },
  {
    category: ServiceId.TarjetaDespensa,
    question: '¿Cuándo se realiza la dispersión de vales de despensa?',
    answer: 'El saldo de la tarjeta de vales Toka se deposita el día 25 de cada mes. Si el día 25 cae en fin de semana o día festivo, la dispersión se adelanta al día hábil anterior.'
  },
  {
    category: ServiceId.TarjetaDespensa,
    question: '¿Qué debo hacer si pierdo o me roban la tarjeta de vales?',
    answer: 'Llama inmediatamente a la línea de Toka al 800-400-8652 para bloquear el plástico. Posteriormente, acude a Recursos Humanos con tu número de reporte de bloqueo para tramitar el repuesto.'
  },
  {
    category: ServiceId.RelojChecador,
    question: '¿Cómo solicito la justificación por omisión de chequeo?',
    answer: 'Solicita la Papeleta de Corrección de Chequeo a tu supervisor de turno (Ing. Héctor Ramírez), pide su firma de autorización y entrégala en la ventanilla de RH antes del martes a las 12:00 PM.'
  },
  {
    category: ServiceId.AclaracionPago,
    question: '¿Cuál es el tiempo límite para solicitar aclaraciones de mi sueldo?',
    answer: 'Tienes un plazo máximo de 5 días hábiles contados a partir del viernes de pago. Debes presentar tu recibo de nómina físico y contar con la verificación del supervisor de turno.'
  },
  {
    category: ServiceId.CajaAhorro,
    question: '¿Cuándo puedo modificar mi porcentaje de ahorro en la Caja?',
    answer: 'Los cambios de porcentaje (entre 2% y 10%) se solicitan en la ventanilla de Recursos Humanos durante los meses de Enero y Julio de cada año.'
  },
  {
    category: ServiceId.Vacaciones,
    question: '¿Con cuánta anticipación debo programar mis vacaciones?',
    answer: 'Debes acordar las fechas con tu supervisor inmediato con al menos 15 días de anticipación y firmar la Solicitud de Vacaciones en RH para garantizar la cobertura en la línea de producción.'
  },
  {
    category: ServiceId.Vacaciones,
    question: '¿Cuántos días de descanso me corresponden por antigüedad?',
    answer: 'De acuerdo con la Ley Federal del Trabajo: 1 año = 12 días; 2 años = 14 días; 3 años = 16 días; 4 años = 18 días; 5 años = 20 días; de 6 a 10 años = 22 días.'
  },
  {
    category: ServiceId.Infonavit,
    question: '¿Dónde entregó mi Aviso de Retención de Descuentos de Infonavit?',
    answer: 'Debes entregar el documento impreso original en la oficina de Nóminas de Planta de Lunes a Viernes de 9:00 AM a 2:00 PM para su aplicación en la siguiente nómina.'
  },
  {
    category: ServiceId.Incapacidades,
    question: '¿Cómo se deben reportar las incapacidades expedidas por el IMSS?',
    answer: 'Notifica a tu supervisor y envía una foto legible de la copia patronal de la incapacidad al WhatsApp de RH (+52 55 1234 5678) dentro de las primeras 24 horas. El original en papel se entrega al regresar a laborar.'
  },
  {
    category: ServiceId.Incapacidades,
    question: '¿Cómo se pagan los días de incapacidad por enfermedad general?',
    answer: 'El IMSS paga a partir del 4to día de incapacidad el 60% de tu salario diario integrado registrado. Los primeros 3 días no son cubiertos por el instituto salvo disposición de contrato colectivo.'
  },
  {
    category: ServiceId.Prestamos,
    question: '¿Cuáles son los requisitos para solicitar un préstamo de empresa?',
    answer: 'Antigüedad mínima de 1 año ininterrumpido en la planta, no contar con ningún adeudo previo activo y que la deducción semanal no exceda el 30% de tu sueldo base.'
  },
  {
    category: ServiceId.Transporte,
    question: '¿Qué tolerancia existe si la unidad de transporte sufre un retraso?',
    answer: 'Si la unidad oficial de la empresa sufre una falla o demora en el tráfico, la llegada a la planta se registra como asistencia justificada sin penalización de retardo.'
  },
  {
    category: ServiceId.Uniformes,
    question: '¿Cada cuánto tiempo se renueva el uniforme y las botas de casquillo?',
    answer: 'La reposición ordinaria de uniforme (playeras y pantalones) y calzado de seguridad Berrendo se realiza de manera programada cada 6 meses sin costo para el trabajador.'
  },
  {
    category: ServiceId.Seguridad,
    question: '¿Es obligatorio usar todo el Equipo de Protección Personal (EPP)?',
    answer: 'Sí. El uso de botas de casquillo, lentes de seguridad, tapones auditivos y chaleco reflejante es estrictamente obligatorio para ingresar y permanecer en todas las áreas de manufactura.'
  },
  {
    category: 'general',
    question: '¿Cuál es el horario de atención de la oficina de Recursos Humanos?',
    answer: 'La ventanilla de Recursos Humanos atiende de Lunes a Viernes en horario corrido de 8:00 AM a 5:00 PM y Sábados de 8:00 AM a 1:00 PM.'
  },
  {
    category: 'general',
    question: '¿Qué procedimiento debo seguir en caso de pérdida de mi gafete oficial?',
    answer: 'Acude a la Caseta Principal de Seguridad para tramitar un pase provisional de acceso. La reposición física del gafete se gestiona en Recursos Humanos con un costo de $50 MXN.'
  }
];
