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
    question: '¿Qué día de la semana pagan?',
    answer: 'Para los operadores de planta, el pago es SEMANAL y se deposita cada VIERNES por la mañana. Si hay un día festivo bancario el viernes, se deposita el jueves.'
  },
  {
    category: ServiceId.Nomina,
    question: '¿Cómo obtengo mis recibos de nómina?',
    answer: 'Los recibos se envían automáticamente por correo electrónico de la empresa o puedes descargarlos enviando la palabra "RECIBO" al WhatsApp oficial de RH de la empresa. También puedes solicitar su impresión mensual con tu supervisor.'
  },
  {
    category: ServiceId.FondoAhorro,
    question: '¿Cuánto me descuentan del fondo de ahorro?',
    answer: 'Se te descuenta el 8% de tu salario base semanal, y la empresa aporta una cantidad exactamente igual (8%). Es decir, guardas el doble de lo que te quitan. Se entrega todo junto en la primera semana de diciembre.'
  },
  {
    category: ServiceId.TarjetaDespensa,
    question: '¿Cuándo cargan el saldo de los vales de despensa?',
    answer: 'Los vales de despensa se depositan el día 25 de cada mes. Si cae en fin de semana, se deposita el viernes anterior.'
  },
  {
    category: ServiceId.Vacaciones,
    question: '¿Cuántos días de vacaciones tengo en mi primer año?',
    answer: 'Por la nueva ley mexicana, al cumplir tu primer año completo de trabajo tienes derecho a 12 DÍAS hábiles de vacaciones pagadas.'
  },
  {
    category: ServiceId.Transporte,
    question: '¿Qué pasa si el camión de transporte se retrasa?',
    answer: 'Si el camión llega tarde a la planta por tráfico o falla mecánica, tu retardo está JUSTIFICADO al 100%. Debes avisar de inmediato al grupo de WhatsApp de tu ruta.'
  },
  {
    category: ServiceId.Uniformes,
    question: '¿Qué hago si se daña mi uniforme o botas?',
    answer: 'Acude con tu supervisor para que llene el formato de "Reposición por Daño Operativo". Con este papel firmado, asistes a Almacén para recibir tu nueva prenda o calzado sin costo.'
  },
  {
    category: ServiceId.RelojChecador,
    question: '¿Cómo reporto una omisión de marca?',
    answer: 'Debes solicitar a tu supervisor Héctor Ramírez que firme el formato de Corrección de Marcaje y entregarlo en la oficina de RH en un plazo no mayor a 3 días.'
  },
  {
    category: ServiceId.RelojChecador,
    question: '¿Qué pasa si olvido registrar mi entrada?',
    answer: 'Se registrará como falta injustificada temporalmente hasta que presentes el formato de corrección debidamente autorizado por tu jefe inmediato.'
  },
  {
    category: ServiceId.AclaracionPago,
    question: '¿Cuánto tiempo tengo para reclamar un error en mi recibo?',
    answer: 'Tienes un plazo de 5 días hábiles a partir del día de pago para realizar cualquier aclaración sobre horas extra, bonos o deducciones en tu recibo.'
  },
  {
    category: ServiceId.AclaracionPago,
    question: '¿Con quién debo acudir para aclarar mi nómina?',
    answer: 'Puedes mandar un mensaje a través del asistente virtual "Sofía" o acudir directamente a la ventanilla de atención de nóminas los martes y jueves de 2:00 PM a 4:00 PM.'
  },
  {
    category: ServiceId.CajaAhorro,
    question: '¿Cuándo puedo retirar fondos de la caja de ahorro?',
    answer: 'Los retiros ordinarios se pueden realizar dos veces al año (en junio y diciembre). Para retiros de emergencia, consulta las condiciones con Recursos Humanos.'
  },
  {
    category: ServiceId.CajaAhorro,
    question: '¿Cuál es el rendimiento anual de la caja de ahorro?',
    answer: 'La caja ofrece un rendimiento promedio del 6.5% anual sobre tus aportaciones acumuladas, libre de comisiones.'
  },
  {
    category: ServiceId.Infonavit,
    question: '¿Cómo solicito mi carta de retención del Infonavit?',
    answer: 'Puedes descargarla directamente desde el portal Mi Cuenta Infonavit y enviarla digitalizada al correo de nóminas de la planta para que se aplique el descuento correspondiente.'
  },
  {
    category: ServiceId.Infonavit,
    question: '¿La empresa hace aportaciones a mi crédito Infonavit?',
    answer: 'Sí, la empresa aporta bimestralmente el equivalente al 5% de tu salario diario integrado a tu Subcuenta de Vivienda.'
  },
  {
    category: ServiceId.Incapacidades,
    question: '¿Cómo debo reportar una incapacidad médica?',
    answer: 'Debes enviar una foto legible de tu formato de incapacidad del IMSS al WhatsApp oficial de Recursos Humanos en las primeras 24 horas. El documento original en papel se debe entregar al regresar a laborar.'
  },
  {
    category: ServiceId.Incapacidades,
    question: '¿Cuánto paga el IMSS por incapacidad por enfermedad general?',
    answer: 'El IMSS cubre a partir del cuarto día el 60% del salario registrado. Si es por riesgo de trabajo calificado, se paga al 100% desde el primer día.'
  },
  {
    category: ServiceId.Prestamos,
    question: '¿Cuáles son los requisitos para pedir un préstamo de la empresa?',
    answer: 'Tener al menos 1 año de antigüedad en la planta, no contar con un préstamo activo vigente y que el descuento semanal no supere el 30% de tu sueldo base.'
  },
  {
    category: ServiceId.Prestamos,
    question: '¿Cuál es la tasa de interés de los préstamos?',
    answer: 'Los préstamos de la empresa tienen un interés preferencial del 0% al 2% anual, diseñado exclusivamente para el apoyo de la economía de nuestros colaboradores de planta.'
  },
  {
    category: 'general',
    question: '¿Cómo justifico una falta si me enfermo?',
    answer: 'Debes presentar ÚNICAMENTE la receta o incapacidad original emitida por el IMSS. Tienes hasta 48 horas después de tu regreso para entregarla a Recursos Humanos.'
  },
  {
    category: 'general',
    question: '¿Perdí mi gafete de empleado, qué hago?',
    answer: 'Reporta de inmediato con la caseta de seguridad para que te den un pase temporal. La primera reposición es gratuita; a partir de la segunda tiene un costo de $50 MXN que se descuenta de nómina.'
  }
];
