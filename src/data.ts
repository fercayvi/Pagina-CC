import { ServiceId, Service, FAQ, NewsItem, Aviso, UserProfile, MonthlyRecognition, ContactInfo, CategoryConfig } from './types';

export const defaultCategories: CategoryConfig[] = [
  {
    "id": "all",
    "label": "Todos los trámites",
    "defaultLabel": "Todos los trámites",
    "iconName": "LayoutGrid",
    "colorScheme": "indigo",
    "hidden": false
  },
  {
    "id": "nomina",
    "label": "Nómina y Pagos",
    "defaultLabel": "Nómina y Pagos",
    "iconName": "Wallet",
    "colorScheme": "emerald"
  },
  {
    "id": "tarjetas",
    "label": "Tarjetas y Créditos",
    "defaultLabel": "Tarjetas y Créditos",
    "iconName": "CreditCard",
    "colorScheme": "violet"
  },
  {
    "id": "control",
    "label": "Asistencia y Vacaciones",
    "defaultLabel": "Control y Asistencia",
    "iconName": "CalendarClock",
    "colorScheme": "amber"
  }
];

// Exportación compatible para componentes que usen activeCategories
export const activeCategories: CategoryConfig[] = defaultCategories;

export const initialContact: ContactInfo = {
  "whatsapp": "https://wa.me/525512345678",
  "telefono": "Ext. 202 (5512345678)",
  "ubicacion": "Módulo de Servicios al Personal, ubicado a un lado de Ropería.",
  "horario": "Lunes - Viernes: 7:00 am a 8:00 am | 9:00 am a 12:00 pm | 2:30 pm a 3:30 pm\nSábados: 9:30 am a 12:30 pm",
  "croquisUrl": ""
};

export const initialRecognitions: MonthlyRecognition[] = [
  {
    "id": "rec-1",
    "badgeTitle": "Reconocimiento Mensual",
    "name": "Mateo Rodríguez",
    "initials": "MR",
    "position": "Línea 2 - Montacargas • ¡Cero Retardos y 5S Perfecto!",
    "message": "Mateo mantuvo su área de almacén 100% limpia y ordenada, asegurando que los materiales llegaran a tiempo a la línea de ensamble. ¡Gracias por tu esfuerzo, Mateo!"
  }
];

export const recognitionData: MonthlyRecognition = initialRecognitions[0];

export const initialServices: Service[] = [
  {
    "id": "aclaracion_pago",
    "title": "Dudas con Mi Pago",
    "iconName": "HelpCircle",
    "icon": "HelpCircle",
    "shortDesc": "Contactos de Talento y Cultura, horarios de atención y FAQs sobre dudas de pago.",
    "category": "Nómina y Pagos",
    "fullDescription": "Contactos de Talento y Cultura, horarios de atención y FAQs sobre dudas de pago.",
    "steps": [],
    "requirements": [],
    "faqs": [],
    "imageUrl": "",
    "videoUrl": "",
    "pdfUrl": "",
    "pdfTitle": "",
    "tags": [
      "aclaración",
      "dudas",
      "pago",
      "descuentos",
      "retenciones",
      "fonacot",
      "recursos humanos",
      "rh",
      "sueldo"
    ],
    "hidden": false,
    "decisionTree": [],
    "location": "",
    "schedule": "",
    "contact": "",
    "attachments": [],
    "alertNotice": "",
    "layoutBlocks": []
  },
  {
    "id": "vacaciones",
    "title": "Vacaciones",
    "iconName": "Palmtree",
    "icon": "Palmtree",
    "shortDesc": "",
    "category": "Asistencia y Vacaciones",
    "fullDescription": "",
    "steps": [],
    "requirements": [],
    "faqs": [],
    "imageUrl": "",
    "videoUrl": "",
    "pdfUrl": "",
    "pdfTitle": "",
    "location": "",
    "schedule": "",
    "contact": "",
    "attachments": [],
    "alertNotice": "",
    "hidden": false,
    "cardImage": "",
    "decisionTree": [],
    "layoutBlocks": [
      {
        "id": "img_1789053857295_o2bxo",
        "type": "media",
        "mediaType": "image",
        "title": "",
        "url": "",
        "caption": "",
        "alignment": "center",
        "size": "full"
      },
      {
        "id": "txt_1789053883043_p4q17",
        "type": "text",
        "title": "",
        "content": "Conforme a la Ley Federal de Trabajo Vigente el esquema de vacaciones se realiza de la siguiente manera:\n\n<b>Los trabajadores que tengan más de un año de servicios disfrutarán de un período anual de vacaciones pagadas, que en ningún caso podrá ser inferior a 6 días laborables, y que aumentará en 2 días laborables, hasta llegar a 12, por cada año subsecuente de servicios.\n</b>\nDespués del cuarto año, el periodo de vacaciones se aumentará en 2 días por cada 5 años de servicio.\n&nbsp;&nbsp;\nPara solicitar tus vacaciones, descarga el documento que está en la sección de Herramientas y Sitios de interés, llénalo y entrégalo a Talento y Cultura.\n&nbsp;\nRecuerda que tus vacaciones tienen una vigencia de<b> 18 meses&nbsp; a partir de su liberación. </b>En dado caso que no las utilices estas serán redimidas.",
        "align": "left",
        "style": "normal"
      },
      {
        "id": "btn_1790096656856_vqz6h",
        "type": "button",
        "label": "Solicita o consulta tus días de vacaciones",
        "url": "https://",
        "style": "primary",
        "align": "center"
      }
    ],
    "tags": [
      "vacaciones",
      "días disponibles",
      "descanso",
      "home week",
      "días flex",
      "prima vacacional",
      "solicitud",
      "permiso"
    ]
  },
  {
    "id": "politicas_pago",
    "title": "Días y Fechas de Pago",
    "iconName": "Banknote",
    "icon": "Banknote",
    "shortDesc": "Explicación de fechas de pago, periodicidad, conceptos aplicables y consultas frecuentes.",
    "category": "Nómina y Pagos",
    "fullDescription": "Explicación de fechas de pago, periodicidad, conceptos aplicables y consultas frecuentes.",
    "steps": [],
    "requirements": [],
    "faqs": [],
    "imageUrl": "",
    "videoUrl": "",
    "pdfUrl": "",
    "pdfTitle": "",
    "location": "",
    "schedule": "",
    "contact": "",
    "attachments": [],
    "alertNotice": "",
    "tags": [
      "pago",
      "sueldo",
      "salario",
      "fechas",
      "calendario",
      "depósito",
      "semanal",
      "quincenal",
      "dispersión"
    ],
    "hidden": true
  },
  {
    "id": "recibos_cif",
    "title": "Mis Recibos de Nómina",
    "iconName": "ReceiptText",
    "icon": "ReceiptText",
    "shortDesc": "Guía paso a paso para solicitar recibos impresos o digitales y consultar el Timbrado CIF.",
    "category": "Nómina y Pagos",
    "fullDescription": "",
    "steps": [],
    "requirements": [],
    "faqs": [],
    "imageUrl": "",
    "videoUrl": "",
    "pdfUrl": "",
    "pdfTitle": "",
    "tags": [
      "recibos",
      "nómina",
      "timbrado",
      "cif",
      "sat",
      "comprobante",
      "constancia",
      "fiscal",
      "xml",
      "pdf",
      "descarga"
    ],
    "hidden": true
  },
  {
    "id": "vales_tarjeta_nomina",
    "title": "Mi Tarjeta y Vales",
    "iconName": "CreditCard",
    "icon": "CreditCard",
    "shortDesc": "Información sobre solicitud, uso, reposición por robo o extravío y FAQs.",
    "category": "Tarjetas y Créditos",
    "fullDescription": "Información sobre solicitud, uso, reposición por robo o extravío y FAQs.",
    "steps": [],
    "requirements": [],
    "faqs": [],
    "imageUrl": "",
    "videoUrl": "",
    "pdfUrl": "",
    "pdfTitle": "",
    "decisionTree": [
      {
        "id": "node_root_1",
        "title": "Tarjeta Vales de Despensa",
        "nodeType": "category",
        "children": [
          {
            "id": "node_1788446978640_awy8",
            "title": "¿Cómo registrar mi tarjeta?",
            "nodeType": "step",
            "children": [
              {
                "id": "node_1788447025718_4lto",
                "title": "Opción",
                "nodeType": "step",
                "children": [
                  {
                    "id": "node_1788447179506_x8rv",
                    "title": "Opción",
                    "nodeType": "step",
                    "children": [
                      {
                        "id": "node_1788447195454_x0fa",
                        "title": "Opción",
                        "nodeType": "step",
                        "children": [
                          {
                            "id": "node_1788447209926_h15m",
                            "title": "Opción",
                            "nodeType": "step",
                            "children": [
                              {
                                "id": "node_1788447230371_g53k",
                                "title": "Opción",
                                "nodeType": "step",
                                "children": [],
                                "contentData": {
                                  "text": "6. Ingresa los datos adicionales que solicite la aplicación, como:\nFecha de vencimiento.\nCódigo de seguridad CVV, ubicado en la parte posterior de tu tarjeta.\n",
                                  "imageUrl": "",
                                  "videoUrl": "",
                                  "blocks": [
                                    {
                                      "id": "block_node_1788447230371_g53k_1",
                                      "text": "6. Ingresa los datos adicionales que solicite la aplicación, como:\nFecha de vencimiento.\nCódigo de seguridad CVV, ubicado en la parte posterior de tu tarjeta.\n",
                                      "imageUrl": "",
                                      "videoUrl": ""
                                    }
                                  ]
                                }
                              }
                            ],
                            "contentData": {
                              "text": "5. Confirma tu cuenta ingresando el código de verificación que recibirás en el correo electrónico registrado.\n",
                              "imageUrl": "",
                              "videoUrl": "",
                              "blocks": [
                                {
                                  "id": "block_node_1788447209926_h15m_1",
                                  "text": "5. Confirma tu cuenta ingresando el código de verificación que recibirás en el correo electrónico registrado.\n",
                                  "imageUrl": "",
                                  "videoUrl": ""
                                }
                              ]
                            }
                          }
                        ],
                        "contentData": {
                          "text": "4. Coloca tu nombre y apellido, adicional selecciona la casilla del aviso de privacidad",
                          "imageUrl": "",
                          "videoUrl": "",
                          "blocks": [
                            {
                              "id": "block_node_1788447195454_x0fa_1",
                              "text": "4. Coloca tu nombre y apellido, adicional selecciona la casilla del aviso de privacidad",
                              "imageUrl": "",
                              "videoUrl": ""
                            }
                          ]
                        }
                      }
                    ],
                    "contentData": {
                      "text": "3. Ingresa tu correo electrónico y crea una contraseña segura\n",
                      "imageUrl": "",
                      "videoUrl": "",
                      "blocks": [
                        {
                          "id": "block_node_1788447179506_x8rv_1",
                          "text": "3. Ingresa tu correo electrónico y crea una contraseña segura\n",
                          "imageUrl": "",
                          "videoUrl": ""
                        }
                      ]
                    }
                  }
                ],
                "contentData": {
                  "text": "2. Selecciona la opción “Regístrate”",
                  "imageUrl": "",
                  "videoUrl": "",
                  "blocks": [
                    {
                      "id": "block_node_1788447025718_4lto_1",
                      "text": "2. Selecciona la opción “Regístrate”",
                      "imageUrl": "",
                      "videoUrl": ""
                    }
                  ]
                }
              }
            ],
            "contentData": {
              "text": "1. Descarga la aplicación oficial Edenred en tu celular.\n",
              "imageUrl": "",
              "videoUrl": "",
              "blocks": [
                {
                  "id": "block_node_1788446978640_awy8_1",
                  "text": "1. Descarga la aplicación oficial Edenred en tu celular.\n",
                  "imageUrl": "",
                  "videoUrl": ""
                }
              ]
            }
          },
          {
            "id": "node_1788447363434_2vxs",
            "title": "¿Dónde puedo utilizarla?",
            "nodeType": "content",
            "contentData": {
              "text": "",
              "imageUrl": "",
              "videoUrl": ""
            }
          },
          {
            "id": "node_1788456110529_r8d1",
            "title": "¿Cómo puedo obtenerlo?   ",
            "nodeType": "content",
            "contentData": {
              "text": "",
              "imageUrl": "",
              "videoUrl": ""
            }
          },
          {
            "id": "node_1788456194021_kelg",
            "title": "Necesito una reposición",
            "nodeType": "content",
            "contentData": {
              "text": " Acude al Módulo de Servicio al Personal para realizar el trámite.\n\nSolicita tu reposición por un costo de $49 MXN.\n\n",
              "imageUrl": "",
              "videoUrl": "",
              "blocks": [
                {
                  "id": "block_node_1788456194021_kelg_1",
                  "text": "¿Necesitas reponer tu tarjeta de vales de despensa?\n\nSolicita tu reposición por un costo de $49 MXN.\n\n Acude al Módulo de Servicio al Personal para realizar el trámite.\n",
                  "imageUrl": "",
                  "videoUrl": ""
                }
              ]
            }
          }
        ]
      },
      {
        "id": "node_1788446917593_gy9a",
        "title": "Tarjeta de Nómina",
        "nodeType": "category",
        "children": [
          {
            "id": "node_1788469413817_14yd",
            "title": "Nueva Opción",
            "nodeType": "content",
            "contentData": {
              "text": "",
              "imageUrl": "",
              "videoUrl": "",
              "blocks": [
                {
                  "id": "block_node_1788469413817_14yd_1",
                  "text": "",
                  "imageUrl": "",
                  "videoUrl": ""
                }
              ]
            }
          },
          {
            "id": "node_1788469449919_fart",
            "title": "Nueva Opción",
            "nodeType": "step",
            "children": [
              {
                "id": "node_1788469469377_jted",
                "title": "Siguiente",
                "nodeType": "step",
                "children": [],
                "contentData": {
                  "text": "",
                  "imageUrl": "",
                  "videoUrl": ""
                }
              }
            ],
            "contentData": {
              "text": "",
              "imageUrl": "",
              "videoUrl": "",
              "blocks": [
                {
                  "id": "block_node_1788469449919_fart_1",
                  "text": "",
                  "imageUrl": "",
                  "videoUrl": ""
                },
                {
                  "id": "block_1788469464004_rx19",
                  "text": "",
                  "imageUrl": "",
                  "videoUrl": ""
                },
                {
                  "id": "block_1788469466303_xvwu",
                  "text": "",
                  "imageUrl": "",
                  "videoUrl": ""
                }
              ]
            }
          }
        ]
      }
    ],
    "location": "",
    "schedule": "",
    "contact": "",
    "attachments": [],
    "alertNotice": "",
    "tags": [
      "vales",
      "despensa",
      "tarjeta",
      "plástico",
      "reposición",
      "nip",
      "saldo",
      "compras",
      "robo",
      "extravío"
    ],
    "hidden": false,
    "layoutBlocks": []
  },
  {
    "id": "caja_ahorro",
    "title": "Préstamos y Ahorro",
    "iconName": "PiggyBank",
    "icon": "PiggyBank",
    "shortDesc": "Reglas de acceso a la caja de ahorro, tipos de préstamos y procedimiento de solicitud informativa.",
    "category": "Tarjetas y Créditos",
    "fullDescription": "",
    "steps": [],
    "requirements": [],
    "faqs": [],
    "imageUrl": "",
    "videoUrl": "",
    "pdfUrl": "",
    "pdfTitle": "",
    "tags": [
      "préstamos",
      "ahorro",
      "caja de ahorro",
      "fondo",
      "intereses",
      "financiamiento",
      "solicitud",
      "crédito"
    ],
    "hidden": true
  },
  {
    "id": "infonavit",
    "title": "Infonavit",
    "iconName": "Home",
    "icon": "Home",
    "shortDesc": "Información de descuentos, retención de crédito y preguntas frecuentes.",
    "category": "Tarjetas y Créditos",
    "fullDescription": "",
    "steps": [],
    "requirements": [],
    "faqs": [],
    "imageUrl": "",
    "videoUrl": "",
    "pdfUrl": "",
    "pdfTitle": "",
    "tags": [
      "infonavit",
      "crédito",
      "vivienda",
      "retención",
      "aviso",
      "descuento",
      "casa",
      "hipotecario",
      "constancia"
    ],
    "hidden": true
  },
  {
    "id": "incapacidades",
    "title": "Incapacidades IMSS",
    "iconName": "Stethoscope",
    "icon": "Stethoscope",
    "shortDesc": "Tipos de incapacidad, documentación requerida del IMSS y proceso para reportarla.",
    "category": "Asistencia y Vacaciones",
    "fullDescription": "Tipos de incapacidad, documentación requerida del IMSS y proceso para reportarla.",
    "steps": [],
    "requirements": [],
    "faqs": [],
    "imageUrl": "",
    "videoUrl": "",
    "pdfUrl": "",
    "pdfTitle": "",
    "decisionTree": [
      {
        "id": "node_incap_tipo",
        "title": "¿Qué tipo de incapacidad te otorgó el médico?",
        "nodeType": "category",
        "children": [
          {
            "id": "node_enf_gen",
            "title": "Enfermedad General",
            "nodeType": "category",
            "children": []
          },
          {
            "id": "node_riesgo_trabajo",
            "title": "Accidente de Trabajo / Trayecto",
            "nodeType": "category",
            "children": []
          },
          {
            "id": "node_maternidad",
            "title": "Maternidad (Prenatal / Postnatal)",
            "nodeType": "content",
            "contentData": {
              "text": "La incapacidad por Maternidad abarca 84 días naturales (42 días prenatal y 42 días postnatal) y se subsidia al 100% de tu salario registrado por el IMSS.\n\n• Acude a tu UMF entre las semanas 34 y 37 de gestación para la expedición de tu Certificado Único de Maternidad.\n• Entrega en RH la copia patronal inmediatamente tras recibirla para programar tu periodo de descanso.",
              "imageUrl": "",
              "videoUrl": ""
            }
          }
        ]
      }
    ],
    "tags": [
      "incapacidad",
      "imss",
      "médico",
      "enfermedad",
      "accidente",
      "maternidad",
      "riesgo de trabajo",
      "st-7",
      "subsidio",
      "constancia"
    ],
    "location": "",
    "schedule": "",
    "contact": "",
    "attachments": [],
    "alertNotice": "",
    "layoutBlocks": []
  },
  {
    "id": "reloj_checador",
    "title": "Checador y Asistencia",
    "iconName": "Fingerprint",
    "icon": "Fingerprint",
    "shortDesc": "Guía de uso de lectores en planta, política sobre omisión de marcas y aclaraciones de asistencia.",
    "category": "Asistencia y Vacaciones",
    "fullDescription": "",
    "steps": [],
    "requirements": [],
    "faqs": [],
    "imageUrl": "",
    "videoUrl": "",
    "pdfUrl": "",
    "pdfTitle": "",
    "tags": [
      "checador",
      "asistencia",
      "reloj",
      "lector",
      "huella",
      "gafete",
      "retardo",
      "omisión",
      "incidencia",
      "marcas",
      "horario"
    ]
  }
];

export const allServices: Service[] = initialServices;
export const servicesData = initialServices;

export const userProfileData: UserProfile = {
  "name": "Colaborador Planta",
  "employeeId": "OP-4820",
  "position": "Operador de Ensamble A",
  "department": "Producción - Línea 3",
  "supervisor": "Ing. Héctor Ramírez (Cel: 55-9876-5432)",
  "shift": "Primer Turno (06:00 AM - 02:00 PM)",
  "hiringDate": "12 de Enero, 2026",
  "nss": "12987456321",
  "rfc": "MANJ950812HDF",
  "vacationDaysAvailable": 12,
  "fondoAhorroBalance": 1840.5,
  "despensaBalance": 650
};

export const initialNews: NewsItem[] = [
  {
    "id": "news_1788467824316",
    "title": "¡Próximamente: Descubre tu nuevo Portal de Talento y Cultura!",
    "summary": "Muy pronto tendrás todos tus trámites, consultas y tutoriales de Recursos Humanos al alcance de tu celular, sin necesidad de hacer filas. ¡Espéralo!",
    "content": "Estimado equipo,\n\nEn Talento y Cultura seguimos innovando para hacerte la vida más fácil. Nos emociona anunciar que estamos afinando los últimos detalles para el gran lanzamiento de nuestro nuevo Portal Digital de Servicios al Personal.\n\nSabemos que tu tiempo es valioso, por lo que hemos diseñado una plataforma completamente nueva, pensada para usarse de forma rápida y sencilla desde cualquier teléfono celular.\n\n¿Qué podrás encontrar en este nuevo portal?\n\nTrámites en un clic: Información clara sobre vacaciones, préstamos, control de asistencia y dudas de pago.\n\nTutoriales paso a paso: Guías visuales para que sepas exactamente cómo registrar tus tarjetas o usar las aplicaciones oficiales.\n\nAtención directa: Acceso directo a nuestro WhatsApp oficial, horarios actualizados y un croquis para ubicar nuestra ventanilla rápidamente.\n\nNuestro objetivo es que tengas la información de la empresa disponible las 24 horas del día, los 7 días de la semana, evitándote vueltas innecesarias a la oficina.\n\n¡Mantente atento a nuestros próximos comunicados! Muy pronto te compartiremos el enlace oficial y las instrucciones de acceso para que seas de los primeros en probarlo.\n\nTalento y Cultura",
    "date": "Hoy",
    "imageName": "welcome_team",
    "category": "comunicado"
  }
];
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
